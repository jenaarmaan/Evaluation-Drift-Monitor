/**
 * 🔬 Evaluation Drift Monitor - Core Engine
 * Implements "Embedding Centroid Drift" and "Distribution Variance" analysis.
 */

export interface DriftPoint {
  id: string;
  prompt: string;
  response: string;
  category: string;
  embedding: number[];
  timestamp: string;
}

export interface DriftResult {
  driftScore: number; // 0 to 1
  status: 'STABLE' | 'WARNING' | 'CRITICAL';
  driftDetails: string;
  affectedClusters: string[];
}

/**
 * Calculates Cosine Distance between two vectors.
 */
function cosineDistance(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return 1.0;
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    mA += v1[i] * v1[i];
    mB += v2[i] * v2[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  const similarity = dotProduct / (mA * mB);
  return 1 - similarity;
}

/**
 * Calculates the centroid of a set of vectors.
 */
function getCentroid(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const centroid = new Array(dim).fill(0);
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      centroid[i] += v[i] / vectors.length;
    }
  }
  return centroid;
}

/**
 * Core Algorithm: Calculates Drift between Baseline and Runtime evaluations.
 */
export function calculateDrift(
  baseline: DriftPoint[],
  currentRun: DriftPoint[]
): DriftResult {
  if (baseline.length === 0 || currentRun.length === 0) {
    return { driftScore: 0, status: 'STABLE', driftDetails: 'Empty baseline - no drift possible', affectedClusters: [] };
  }

  const baseCentroid = getCentroid(baseline.map(b => b.embedding));
  const currentCentroid = getCentroid(currentRun.map(c => c.embedding));

  const driftScore = cosineDistance(baseCentroid, currentCentroid);

  // PhD Logic: Categorical Shift Detection (Simple version using string labels)
  const baseCategories = new Set(baseline.map(b => b.category));
  const currentCategories = new Set(currentRun.map(c => c.category));
  
  const newClusters = Array.from(currentCategories).filter(cat => !baseCategories.has(cat));

  let status: 'STABLE' | 'WARNING' | 'CRITICAL' = 'STABLE';
  if (driftScore > 0.3) status = 'CRITICAL';
  else if (driftScore > 0.15 || newClusters.length > 0) status = 'WARNING';

  let driftDetails = `Semantic similarity shift detected: ${(driftScore * 100).toFixed(1)}%.`;
  if (newClusters.length > 0) {
    driftDetails += ` Detected ${newClusters.length} new usage patterns not present in baseline.`;
  }

  return {
    driftScore,
    status,
    driftDetails,
    affectedClusters: newClusters
  };
}

/**
 * 🛠️ Mock Data Generator for the "Ed-Tech" Case Study
 */
export function generateMockData(): { baseline: DriftPoint[], current: DriftPoint[] } {
  const baseline: DriftPoint[] = [
    { id: 'b1', prompt: 'Solve for x: 2x + 5 = 11', response: 'x = 3', category: 'Algebra', embedding: [0.1, 0.2, 0.9], timestamp: '2D ago' },
    { id: 'b2', prompt: 'Area of circle radius 5', response: '78.54', category: 'Geometry', embedding: [0.15, 0.25, 0.85], timestamp: '2D ago' },
    { id: 'b3', prompt: 'Pythagorean theorem formula', response: 'a^2 + b^2 = c^2', category: 'Geometry', embedding: [0.12, 0.22, 0.88], timestamp: '2D ago' },
  ];

  const currentRun: DriftPoint[] = [
    { id: 'c1', prompt: 'What is the limit of sin(x)/x as x -> 0?', response: '1', category: 'Calculus', embedding: [0.8, 0.7, 0.2], timestamp: 'Now' },
    { id: 'c2', prompt: 'Derivate log(x)', response: '1/x', category: 'Calculus', embedding: [0.85, 0.75, 0.15], timestamp: 'Now' },
    { id: 'c3', prompt: 'Integrate e^x', response: 'e^x + C', category: 'Calculus', embedding: [0.82, 0.72, 0.22], timestamp: 'Now' },
  ];

  return { baseline, current: currentRun };
}
