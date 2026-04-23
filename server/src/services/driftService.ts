/**
 * 🔬 Evaluation Drift Monitor - Production Service
 * Implements Centroid + Variance drift analysis.
 */

function cosineSimilarity(v1: number[], v2: number[]): number {
  if (!v1 || !v2 || v1.length !== v2.length) return 0;
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
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
}

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

function getSpread(vectors: number[][], centroid: number[]): number {
  if (vectors.length === 0) return 0;
  let totalDist = 0;
  for (const v of vectors) {
    totalDist += 1 - cosineSimilarity(v, centroid);
  }
  return totalDist / vectors.length;
}

export function calculateEnhancedDrift(baseline: any[], currentRun: any[]) {
  if (baseline.length === 0 || currentRun.length === 0) {
    return { overallScore: 0, status: 'STABLE', details: 'Insufficient data' };
  }

  const baseEmbeds = baseline.map(b => b.embedding);
  const currentEmbeds = currentRun.map(c => c.embedding);

  const baseCentroid = getCentroid(baseEmbeds);
  const currentCentroid = getCentroid(currentEmbeds);

  const centroidDrift = 1 - cosineSimilarity(baseCentroid, currentCentroid);

  const baseSpread = getSpread(baseEmbeds, baseCentroid);
  const currentSpread = getSpread(currentEmbeds, currentCentroid);
  const varianceDrift = Math.abs(currentSpread - baseSpread);

  const overallScore = (centroidDrift * 0.7) + (varianceDrift * 0.3);

  let status = 'STABLE';
  if (overallScore > 0.4) status = 'CRITICAL';
  else if (overallScore > 0.2) status = 'WARNING';

  return {
    overallScore,
    centroidDrift,
    varianceDrift,
    status,
    details: `Centroid Shift: ${(centroidDrift * 100).toFixed(1)}% | Variance Shift: ${(varianceDrift * 100).toFixed(1)}%`,
    affectedClusters: [] // TODO: Implement clustering logic
  };
}
