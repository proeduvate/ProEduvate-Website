import * as THREE from "three";

// Deterministic PRNG so the Hero gem and the Pillars shards can share a
// seed and read as literal fragments of the same crystal.
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface CrystalOptions {
  seed?: number;
  /** Facet count around the ring. Odd numbers (7, 9) read as "cut gem" more than round numbers. */
  girdleSegments?: number;
  radius?: number;
  crownHeight?: number;
  pavilionHeight?: number;
  tableRadiusRatio?: number;
  /** 0..1, per-vertex radius/angle/height noise. Keeps the gem from looking like a lathe-perfect solid. */
  jitter?: number;
}

export interface CrystalGeometrySet {
  /** Upper half: flat-topped "table" facet + bezel facets down to the girdle. */
  crown: THREE.BufferGeometry;
  /** Lower half: facets tapering to a point. */
  pavilion: THREE.BufferGeometry;
  /** crown + pavilion as one gem, for the Hero's single centerpiece. */
  full: THREE.BufferGeometry;
}

const DEFAULTS: Required<CrystalOptions> = {
  seed: 1337,
  girdleSegments: 7,
  radius: 1,
  crownHeight: 0.55,
  pavilionHeight: 1.15,
  tableRadiusRatio: 0.4,
  jitter: 0.16,
};

function jitterScalar(rand: () => number, amount: number) {
  return 1 + (rand() - 0.5) * amount;
}

function buildRing(
  rand: () => number,
  segments: number,
  y: number,
  radius: number,
  jitter: number,
  angleOffset: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2 + angleOffset;
    const jitteredAngle = angle + (rand() - 0.5) * jitter * 0.15;
    const jitteredRadius = radius * jitterScalar(rand, jitter);
    const jitteredY = y + (rand() - 0.5) * jitter * 0.1 * radius;
    points.push(
      new THREE.Vector3(
        Math.cos(jitteredAngle) * jitteredRadius,
        jitteredY,
        Math.sin(jitteredAngle) * jitteredRadius
      )
    );
  }
  return points;
}

function pushTriangle(
  positions: number[],
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3
) {
  positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
}

function nonIndexedGeometry(positions: number[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  // Non-indexed: computeVertexNormals() assigns one flat face normal per
  // triangle rather than averaging across shared positions, which is what
  // gives the gem hard facet edges instead of a smooth/rounded look.
  geometry.computeVertexNormals();
  return geometry;
}

export function createCrystalGeometry(opts: CrystalOptions = {}): CrystalGeometrySet {
  const o = { ...DEFAULTS, ...opts };
  const rand = mulberry32(o.seed);

  const girdle = buildRing(rand, o.girdleSegments, 0, o.radius, o.jitter, 0);
  // Offset the table ring by half a segment so bezel facets are proper
  // trapezoids instead of degenerate wedges lined up with the girdle points.
  const table = buildRing(
    rand,
    o.girdleSegments,
    o.crownHeight,
    o.radius * o.tableRadiusRatio,
    o.jitter,
    Math.PI / o.girdleSegments
  );

  const tableCenter = new THREE.Vector3(0, o.crownHeight, 0);
  const apex = new THREE.Vector3(0, -o.pavilionHeight, 0);

  const crownPositions: number[] = [];
  for (let i = 0; i < o.girdleSegments; i++) {
    const next = (i + 1) % o.girdleSegments;
    pushTriangle(crownPositions, tableCenter, table[i], table[next]);
    pushTriangle(crownPositions, table[i], girdle[i], girdle[next]);
    pushTriangle(crownPositions, table[i], girdle[next], table[next]);
  }

  const pavilionPositions: number[] = [];
  for (let i = 0; i < o.girdleSegments; i++) {
    const next = (i + 1) % o.girdleSegments;
    pushTriangle(pavilionPositions, apex, girdle[next], girdle[i]);
  }

  const crown = nonIndexedGeometry(crownPositions);
  const pavilion = nonIndexedGeometry(pavilionPositions);
  const full = nonIndexedGeometry([...crownPositions, ...pavilionPositions]);

  return { crown, pavilion, full };
}
