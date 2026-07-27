"use client";

/**
 * Synthetic HUD layer over the hero. The frame sequence is photographic and
 * already busy, so this deliberately uses hard geometry and mono type --
 * it reads as an interface drawn *on* the footage, and keeps something
 * moving even while the sequence is parked on a snap point.
 *
 * Purely decorative: aria-hidden, and every readout it shows is also
 * available as real text elsewhere in the hero.
 */
export function HeroHud({
  progress,
  label,
  showTelemetry = true,
}: {
  progress: number;
  label: string;
  /** Suppressed while frames preload, so it doesn't sit on the loading bar. */
  showTelemetry?: boolean;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Sweeping scan bar */}
      <div className="animate-[--animate-hero-scan] absolute inset-x-0 top-0 h-px">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-2/70 to-transparent" />
        <div className="h-16 w-full bg-gradient-to-b from-accent/12 to-transparent" />
      </div>

      {/* Corner brackets */}
      <div className="animate-[--animate-bracket] absolute inset-6 hidden md:block">
        <span className="absolute top-0 left-0 h-8 w-8 border-t border-l border-accent-2/60" />
        <span className="absolute top-0 right-0 h-8 w-8 border-t border-r border-accent-2/60" />
        <span className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-accent-2/60" />
        <span className="absolute right-0 bottom-0 h-8 w-8 border-b border-r border-accent-2/60" />
      </div>

      {/* Live telemetry readout */}
      <div
        className="absolute bottom-6 left-6 hidden items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase transition-opacity duration-500 md:flex"
        style={{ opacity: showTelemetry ? 1 : 0 }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
        </span>
        <span className="text-white/70">{label}</span>
        <span className="text-white/20">/</span>
        <span className="tabular-nums">{String(pct).padStart(3, "0")}%</span>
        <span className="h-px w-16 bg-white/15">
          <span
            className="block h-px bg-accent-2 transition-[width] duration-150"
            style={{ width: `${pct}%` }}
          />
        </span>
      </div>
    </div>
  );
}
