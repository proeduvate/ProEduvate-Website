"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { api, ApiError, type Row } from "@/lib/admin/api";
import { fieldsForCollection, rowSubtitle, rowTitle, type FieldSpec } from "@/lib/admin/schema";
import { RecordForm, type Payload } from "@/components/admin/RecordForm";
import { cn } from "@/lib/utils";

/*
 * List + edit for any one collection.
 *
 * Nothing here knows what a product or a milestone is; the shape comes from
 * the API schema and the rows come from the API. That is what lets one
 * component cover all nineteen collections -- and what stops the admin from
 * quietly falling behind the backend.
 */

type Editing = { mode: "create" } | { mode: "update"; row: Row } | null;

export function CollectionEditor({ slug, label }: { slug: string; label: string }) {
  const [fields, setFields] = useState<FieldSpec[] | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Editing>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [spec, data] = await Promise.all([fieldsForCollection(slug), api.list(slug)]);
      setFields(spec);
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [slug]);

  // Nothing is reset here on purpose: the shell remounts this component per
  // collection, so there is no stale list to clear -- and clearing it
  // synchronously in an effect would just cost an extra render pass.
  useEffect(() => {
    // `load` only sets state after awaiting the network -- the async-callback
    // case the rule itself allows. The checker cannot see past the await.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async callback, not a sync set
    void load();
  }, [load]);

  const run = async (work: () => Promise<void>, done: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await work();
      setNotice(done);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const save = (payload: Payload) => {
    const current = editing;
    if (!current) return;
    void run(async () => {
      if (current.mode === "create") await api.create(slug, payload);
      else await api.update(slug, current.row.id, payload);
      setRows(await api.list(slug));
      setEditing(null);
    }, current.mode === "create" ? "Created." : "Saved.");
  };

  const remove = (row: Row) => {
    if (!window.confirm(`Delete "${rowTitle(row)}"? This cannot be undone.`)) return;
    void run(async () => {
      await api.remove(slug, row.id);
      setRows(await api.list(slug));
      setEditing(null);
    }, "Deleted.");
  };

  const move = (index: number, direction: -1 | 1) => {
    if (!rows) return;
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const order = rows.map((r) => r.id);
    [order[index], order[target]] = [order[target], order[index]];
    // Optimistic: the arrows are the one control people press repeatedly, and
    // waiting a round trip for each press makes reordering feel broken.
    setRows(order.map((id) => rows.find((r) => r.id === id)!));
    void run(async () => {
      setRows(await api.reorder(slug, order));
    }, "Order saved.");
  };

  const togglePublished = (row: Row) => {
    void run(async () => {
      await api.update(slug, row.id, { published: !row.published });
      setRows(await api.list(slug));
    }, row.published ? "Unpublished." : "Published.");
  };

  if (error && !rows) {
    return (
      <Panel>
        <p className="text-sm text-warning">{error}</p>
        <button
          onClick={() => void load()}
          className="mt-4 border border-white/15 px-4 py-2 text-sm text-gray-300 hover:border-white/35"
        >
          Try again
        </button>
      </Panel>
    );
  }

  if (!fields || !rows) {
    return (
      <Panel>
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading {label.toLowerCase()}…
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-chalk">{label}</h1>
          <p className="label-micro mt-2 text-gray-600">
            {rows.length} {rows.length === 1 ? "record" : "records"} · /api/v1/{slug}
          </p>
        </div>
        <button
          onClick={() => setEditing({ mode: "create" })}
          className="inline-flex items-center gap-2 border border-accent/50 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/20"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New record
        </button>
      </header>

      {(error || notice) && (
        <p
          className={cn(
            "border px-3 py-2 text-sm",
            error
              ? "border-warning/40 bg-warning/10 text-warning"
              : "border-success/40 bg-success/10 text-success"
          )}
        >
          {error ?? notice}
        </p>
      )}

      {editing && (
        <Panel>
          <p className="label-micro mb-5 text-accent">
            {editing.mode === "create" ? `New ${label.toLowerCase()} record` : `Editing · ${rowTitle(editing.row)}`}
          </p>
          <RecordForm
            // Remount per record: the form holds its own draft state, and a
            // prop change alone would leave the previous record's text in it.
            key={editing.mode === "create" ? "new" : editing.row.id}
            fields={fields}
            row={editing.mode === "update" ? editing.row : null}
            mode={editing.mode}
            busy={busy}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        </Panel>
      )}

      <ul className="divide-y divide-white/8 border border-white/10 bg-white/[0.02]">
        {rows.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-gray-600">
            Nothing here yet.
          </li>
        )}
        {rows.map((row, i) => {
          const subtitle = rowSubtitle(row);
          const isEditing = editing?.mode === "update" && editing.row.id === row.id;
          return (
            <li
              key={row.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors",
                isEditing ? "bg-accent/[0.07]" : "hover:bg-white/[0.03]"
              )}
            >
              <div className="flex flex-col">
                <IconButton
                  label="Move up"
                  disabled={i === 0 || busy}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Move down"
                  disabled={i === rows.length - 1 || busy}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </IconButton>
              </div>

              <button
                onClick={() => setEditing({ mode: "update", row })}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block truncate text-sm text-chalk">{rowTitle(row)}</span>
                {subtitle && (
                  <span className="mt-0.5 block truncate text-xs text-gray-600">{subtitle}</span>
                )}
              </button>

              <button
                onClick={() => togglePublished(row)}
                disabled={busy}
                title={row.published ? "Published — click to hide from the site" : "Draft — click to publish"}
                className={cn(
                  "label-micro shrink-0 border px-2 py-1 transition-colors disabled:opacity-50",
                  row.published
                    ? "border-success/40 text-success hover:bg-success/10"
                    : "border-white/15 text-gray-600 hover:border-white/35"
                )}
              >
                {row.published ? "Live" : "Draft"}
              </button>

              <IconButton label="Delete" disabled={busy} onClick={() => remove(row)} danger>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">{children}</div>;
}

function IconButton({
  label,
  disabled,
  danger,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-6 w-6 items-center justify-center text-gray-600 transition-colors disabled:opacity-25",
        danger ? "h-8 w-8 hover:text-warning" : "hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}
