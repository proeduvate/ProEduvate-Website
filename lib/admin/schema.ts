"use client";

import { apiBase, READ_ONLY_FIELDS } from "./api";

/*
 * Form fields, derived from the API's own OpenAPI document.
 *
 * The backend already generates its schemas from the SQLAlchemy models, so
 * hand-writing a field list here would reintroduce exactly the drift that
 * generation was meant to remove -- add a column, and the admin silently
 * cannot edit it. Reading /openapi.json instead means the editor grows a
 * field the moment the model does.
 *
 * Collections are described by their POST body (which columns are writable,
 * which are required); singletons by their PATCH body (everything optional).
 */

export type FieldKind = "string" | "text" | "number" | "boolean" | "list";

export type FieldSpec = {
  name: string;
  label: string;
  kind: FieldKind;
  /** Required on create. Singleton fields are never required. */
  required: boolean;
  /** Accepts null, so an empty input clears the column instead of blanking it. */
  nullable: boolean;
};

type JsonSchema = {
  type?: string;
  anyOf?: JsonSchema[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
};

type OpenApi = {
  paths: Record<
    string,
    Record<
      string,
      { requestBody?: { content?: Record<string, { schema?: { $ref?: string } }> } }
    >
  >;
  components: { schemas: Record<string, JsonSchema> };
};

let docPromise: Promise<OpenApi> | null = null;

function loadDoc(): Promise<OpenApi> {
  if (!docPromise) {
    docPromise = fetch(`${apiBase}/openapi.json`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Could not read the API schema (${res.status})`);
        return res.json() as Promise<OpenApi>;
      })
      .catch((error) => {
        // Don't cache a failure -- a retry should actually retry.
        docPromise = null;
        throw error;
      });
  }
  return docPromise;
}

/** Columns that hold a paragraph rather than a phrase, so they get a textarea. */
const LONG_TEXT = /(description|summary|quote|body|about|blurb|intro|tagline|query)/;

const ACRONYMS: Record<string, string> = {
  url: "URL",
  id: "ID",
  ceo: "CEO",
  hr: "HR",
  ai: "AI",
};

function humanize(name: string): string {
  return name
    .split("_")
    .map((word, i) => {
      const acronym = ACRONYMS[word];
      if (acronym) return acronym;
      return i === 0 ? word[0].toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
}

function describe(name: string, schema: JsonSchema, required: boolean): FieldSpec {
  // Optional columns come through as anyOf: [{real type}, {null}].
  const branches = schema.anyOf ?? [schema];
  const nullable = branches.some((branch) => branch.type === "null");
  const primary = branches.find((branch) => branch.type && branch.type !== "null") ?? {};

  let kind: FieldKind = "string";
  if (primary.type === "boolean") kind = "boolean";
  else if (primary.type === "integer" || primary.type === "number") kind = "number";
  else if (primary.type === "array") kind = "list";
  else if (LONG_TEXT.test(name)) kind = "text";

  return { name, label: humanize(name), kind, required, nullable };
}

async function fieldsFor(path: string, method: "post" | "patch"): Promise<FieldSpec[]> {
  const doc = await loadDoc();
  const ref = doc.paths?.[path]?.[method]?.requestBody?.content?.["application/json"]?.schema?.$ref;
  if (!ref) throw new Error(`The API exposes no ${method.toUpperCase()} body for ${path}`);

  const schema = doc.components?.schemas?.[ref.split("/").pop() ?? ""];
  if (!schema?.properties) throw new Error(`The API schema ${ref} has no fields`);

  const required = new Set(schema.required ?? []);
  return Object.entries(schema.properties)
    .filter(([name]) => !READ_ONLY_FIELDS.has(name))
    .map(([name, prop]) => describe(name, prop, required.has(name)));
}

export const fieldsForCollection = (slug: string) => fieldsFor(`/api/v1/${slug}`, "post");
export const fieldsForSingleton = (slug: string) => fieldsFor(`/api/v1/${slug}`, "patch");

/** The best human label for a row, for the list view. */
const TITLE_KEYS = ["name", "title", "label", "discipline", "abbr", "month", "year", "slug"];

export function rowTitle(row: Record<string, unknown>): string {
  for (const key of TITLE_KEYS) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return `#${row.id}`;
}

/**
 * A short second line. Other title candidates are skipped, so a product shows
 * its tagline rather than repeating its own name back as a slug.
 */
export function rowSubtitle(row: Record<string, unknown>): string | null {
  for (const [key, value] of Object.entries(row)) {
    if (READ_ONLY_FIELDS.has(key) || TITLE_KEYS.includes(key)) continue;
    if (key === "position" || key === "published") continue;
    if (typeof value !== "string" || !value.trim()) continue;
    return value.length > 90 ? `${value.slice(0, 90)}…` : value;
  }
  return null;
}
