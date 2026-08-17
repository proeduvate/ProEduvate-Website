"use client";

import { useMemo, useState } from "react";
import type { FieldSpec } from "@/lib/admin/schema";
import { cn } from "@/lib/utils";

/*
 * One form, driven entirely by the field specs read off the API schema.
 *
 * Every value is held as a string (or a boolean for checkboxes) while it is
 * being typed, and converted to its real type only on submit. Keeping typed
 * values in state instead would mean fighting the input on every keystroke --
 * a half-typed number is not a number, and a half-typed JSON array is not an
 * array.
 */

export type Payload = Record<string, unknown>;

type Draft = Record<string, string | boolean>;

/**
 * Lists are almost always lists of strings, edited one per line. `socials` is
 * the one that holds objects, so that field falls back to raw JSON rather
 * than being flattened into unusable text.
 */
function isObjectList(value: unknown): boolean {
  return (
    Array.isArray(value) && value.some((item) => item !== null && typeof item === "object")
  );
}

function toDraftValue(field: FieldSpec, value: unknown, objectList: boolean): string | boolean {
  if (field.kind === "boolean") return value === true;
  if (value === null || value === undefined) return "";
  if (field.kind === "list") {
    const items = Array.isArray(value) ? value : [];
    if (objectList) return JSON.stringify(items, null, 2);
    return items.map((item) => String(item)).join("\n");
  }
  return String(value);
}

class FieldError extends Error {
  constructor(readonly field: string, message: string) {
    super(message);
  }
}

/** `undefined` means "leave this out of the payload entirely". */
function fromDraftValue(
  field: FieldSpec,
  raw: string | boolean,
  objectList: boolean
): unknown {
  if (field.kind === "boolean") return raw === true;

  const text = String(raw);

  if (field.kind === "list") {
    if (!objectList) {
      return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
    if (!text.trim()) return [];
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new FieldError(field.name, `${field.label} is not valid JSON`);
    }
    if (!Array.isArray(parsed)) {
      throw new FieldError(field.name, `${field.label} must be a JSON array`);
    }
    return parsed;
  }

  if (field.kind === "number") {
    if (!text.trim()) return field.nullable ? null : undefined;
    const n = Number(text);
    if (!Number.isFinite(n)) throw new FieldError(field.name, `${field.label} must be a number`);
    return n;
  }

  if (!text) return field.nullable ? null : undefined;
  return text;
}

const INPUT =
  "w-full border border-white/12 bg-black/40 px-3 py-2 text-sm text-chalk outline-none " +
  "transition-colors placeholder:text-gray-600 focus:border-accent/70";

export function RecordForm({
  fields,
  row,
  mode,
  busy,
  onSubmit,
  onCancel,
}: {
  fields: FieldSpec[];
  /** The record being edited, or null for a new one. */
  row: Record<string, unknown> | null;
  mode: "create" | "update";
  busy: boolean;
  /** Receives only what should be sent: everything on create, the diff on update. */
  onSubmit: (payload: Payload) => void;
  onCancel?: () => void;
}) {
  // Decided once from the incoming row so the editor cannot switch shape
  // under the user mid-edit.
  const objectLists = useMemo(() => {
    const set = new Set<string>();
    for (const field of fields) {
      if (field.kind === "list" && isObjectList(row?.[field.name])) set.add(field.name);
    }
    return set;
  }, [fields, row]);

  const initial = useMemo<Draft>(() => {
    const draft: Draft = {};
    for (const field of fields) {
      if (row) {
        draft[field.name] = toDraftValue(field, row[field.name], objectLists.has(field.name));
      } else if (field.kind === "boolean") {
        // A new record should go live by default; anything else is opt-in.
        draft[field.name] = field.name === "published";
      } else {
        draft[field.name] = "";
      }
    }
    return draft;
  }, [fields, row, objectLists]);

  const [draft, setDraft] = useState<Draft>(initial);
  const [problem, setProblem] = useState<string | null>(null);

  const set = (name: string, value: string | boolean) => {
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Payload = {};

    try {
      for (const field of fields) {
        const value = fromDraftValue(field, draft[field.name], objectLists.has(field.name));

        if (value === undefined) {
          if (field.required) {
            throw new FieldError(field.name, `${field.label} is required`);
          }
          continue; // let the column keep its database default
        }

        if (mode === "update") {
          // A real PATCH: send only what actually moved, so two people
          // editing different fields don't overwrite each other.
          const before = row?.[field.name] ?? null;
          const normalised = value === undefined ? null : value;
          if (JSON.stringify(before) === JSON.stringify(normalised)) continue;
        }

        payload[field.name] = value;
      }
    } catch (error) {
      setProblem(error instanceof FieldError ? error.message : String(error));
      return;
    }

    if (mode === "update" && Object.keys(payload).length === 0) {
      setProblem("Nothing changed.");
      return;
    }

    setProblem(null);
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {fields.map((field) => {
          const value = draft[field.name];
          const objectList = objectLists.has(field.name);
          const wide = field.kind === "text" || field.kind === "list";

          return (
            <div key={field.name} className={cn(wide && "lg:col-span-2")}>
              <label
                htmlFor={`field-${field.name}`}
                className="label-micro mb-2 flex items-center gap-2 text-gray-400"
              >
                {field.label}
                {field.required && <span className="text-accent">required</span>}
              </label>

              {field.kind === "boolean" ? (
                <label className="flex w-fit cursor-pointer items-center gap-3 border border-white/12 bg-black/40 px-3 py-2 text-sm text-gray-200">
                  <input
                    id={`field-${field.name}`}
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => set(field.name, e.target.checked)}
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                  {value === true ? "Yes" : "No"}
                </label>
              ) : field.kind === "text" || field.kind === "list" ? (
                <>
                  <textarea
                    id={`field-${field.name}`}
                    value={String(value)}
                    onChange={(e) => set(field.name, e.target.value)}
                    rows={field.kind === "list" ? 5 : 3}
                    spellCheck={field.kind !== "list"}
                    className={cn(INPUT, "resize-y", field.kind === "list" && "font-mono text-xs")}
                    placeholder={
                      field.kind === "list"
                        ? objectList
                          ? '[{ "label": "…", "href": "…" }]'
                          : "One item per line"
                        : undefined
                    }
                  />
                  {field.kind === "list" && (
                    <p className="mt-1.5 text-[11px] text-gray-600">
                      {objectList ? "JSON array — one object per entry." : "One item per line."}
                    </p>
                  )}
                </>
              ) : (
                <input
                  id={`field-${field.name}`}
                  type={field.kind === "number" ? "number" : "text"}
                  value={String(value)}
                  onChange={(e) => set(field.name, e.target.value)}
                  className={INPUT}
                />
              )}
            </div>
          );
        })}
      </div>

      {problem && (
        <p className="border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
          {problem}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="border border-white/15 px-5 py-2.5 text-sm text-gray-300 transition-colors hover:border-white/35 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
