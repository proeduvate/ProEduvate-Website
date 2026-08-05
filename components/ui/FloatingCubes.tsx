"use client";

/*
 * Skeleton (wireframe) cubes drifting in the space behind a section.
 *
 * Each cube is six bordered faces with transparent fills under
 * `preserve-3d`, so what you see is the twelve edges -- an actual cube in
 * perspective rather than a drawing of one. Faces rather than twelve
 * separate edge elements: six divs give the same silhouette for half the
 * nodes, and the borders meet cleanly at the corners on their own.
 *
 * Layout is a fixed table, not random: values generated at render time would
 * differ between the server and client pass and trip hydration, and a fixed
 * arrangement can be tuned so nothing lands on top of the words.
 */

type Cube = {
  /** Percentages, so the field reflows with the section. */
  left: number;
  top: number;
  size: number;
  /** 1 is nearest; smaller recedes. */
  scale: number;
  tumble: number;
  bob: number;
  delay: number;
  opacity: number;
};

const CUBES: Cube[] = [
  { left: 4, top: 18, size: 96, scale: 1, tumble: 34, bob: 9, delay: 0, opacity: 0.5 },
  { left: 15, top: 62, size: 58, scale: 0.8, tumble: 46, bob: 11, delay: -3, opacity: 0.34 },
  { left: 27, top: 12, size: 40, scale: 0.6, tumble: 28, bob: 7, delay: -5, opacity: 0.26 },
  { left: 76, top: 20, size: 74, scale: 0.9, tumble: 40, bob: 10, delay: -2, opacity: 0.44 },
  { left: 88, top: 58, size: 110, scale: 1, tumble: 52, bob: 13, delay: -6, opacity: 0.4 },
  { left: 66, top: 72, size: 46, scale: 0.7, tumble: 30, bob: 8, delay: -4, opacity: 0.28 },
  { left: 44, top: 84, size: 34, scale: 0.55, tumble: 38, bob: 12, delay: -1, opacity: 0.22 },
  { left: 55, top: 6, size: 30, scale: 0.5, tumble: 44, bob: 6, delay: -7, opacity: 0.2 },
];

const FACES = [
  "translateZ(var(--h))",
  "rotateY(180deg) translateZ(var(--h))",
  "rotateY(90deg) translateZ(var(--h))",
  "rotateY(-90deg) translateZ(var(--h))",
  "rotateX(90deg) translateZ(var(--h))",
  "rotateX(-90deg) translateZ(var(--h))",
];

export function FloatingCubes({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className ?? ""}`}
      style={{ perspective: "1400px" }}
    >
      {CUBES.map((cube, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${cube.left}%`,
            top: `${cube.top}%`,
            animation: `cube-bob ${cube.bob}s ease-in-out ${cube.delay}s infinite`,
            opacity: cube.opacity,
          }}
        >
          <div
            style={{
              width: cube.size,
              height: cube.size,
              transformStyle: "preserve-3d",
              animation: `cube-tumble ${cube.tumble}s linear ${cube.delay}s infinite`,
              // Half the edge length, reused by all six faces.
              ["--h" as string]: `${cube.size / 2}px`,
              scale: cube.scale,
            }}
          >
            {FACES.map((transform) => (
              <span
                key={transform}
                className="absolute inset-0 border border-accent/45"
                style={{ transform }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
