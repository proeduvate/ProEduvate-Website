"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api, ApiError, type Row } from "@/lib/admin/api";
import { fieldsForSingleton, type FieldSpec } from "@/lib/admin/schema";
import { RecordForm, type Payload } from "@/components/admin/RecordForm";
import { cn } from "@/lib/utils";

/* The one-row tables (CEO profile, contact details): no list, just a form. */

export function SingletonEditor({ slug, label }: { slug: string; label: string }) {
  const [fields, setFields] = useState<FieldSpec[] | null>(null);
  const [row, setRow] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [spec, data] = await Promise.all([fieldsForSingleton(slug), api.getSingleton(slug)]);
      setFields(spec);
      setRow(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [slug]);

  useEffect(() => {
    // Same as CollectionEditor: the state lands in an async callback.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async callback, not a sync set
    void load();
  }, [load]);

  const save = (payload: Payload) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    void (async () => {
      try {
        setRow(await api.updateSingleton(slug, payload));
        setNotice("Saved.");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : String(err));
      } finally {
        setBusy(false);
      }
    })();
  };

  if (error && !row) {
    return (
      <div className="border border-white/10 bg-white/[0.02] p-6">
        <p className="text-sm text-warning">{error}</p>
        <button
          onClick={() => void load()}
          className="mt-4 border border-white/15 px-4 py-2 text-sm text-gray-300 hover:border-white/35"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!fields || !row) {
    return (
      <p className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading {label.toLowerCase()}…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl text-chalk">{label}</h1>
        <p className="label-micro mt-2 text-gray-600">Single record · /api/v1/{slug}</p>
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

      <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <RecordForm
          // Keyed on updated_at so a successful save reseeds the draft from
          // whatever the server actually stored.
          key={String(row.updated_at ?? row.id)}
          fields={fields}
          row={row}
          mode="update"
          busy={busy}
          onSubmit={save}
        />
      </div>
    </div>
  );
}
