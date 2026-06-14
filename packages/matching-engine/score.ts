import type { Answer } from '@aura/types';

const CATEGORY_WEIGHTS: Record<string, number> = {
  values: 0.40,
  lifestyle: 0.25,
  goals: 0.25,
  dealbreakers: 0.10,
};

// Dealbreaker pairs: [dealbreaker question id, lifestyle question id, incompatible answer index combos]
// Q24 (smoking dealbreaker index 0 = "Yes, absolutely") vs Q11 (smokes index 2 or 3)
const DEALBREAKER_RULES: Array<{ dbQId: number; lifestyleQId: number; dbIndex: number; badIndexes: number[] }> = [
  { dbQId: 24, lifestyleQId: 11, dbIndex: 0, badIndexes: [2, 3] },
];

function questionScore(indexA: number, indexB: number): number {
  const diff = Math.abs(indexA - indexB);
  return [1.0, 0.5, 0.1, 0.0][diff] ?? 0;
}

function indexById(answers: Answer[]): Record<number, Answer> {
  return Object.fromEntries(answers.map((a) => [a.question_id, a]));
}

export function isHardBlocked(answersA: Answer[], answersB: Answer[]): boolean {
  const mapA = indexById(answersA);
  const mapB = indexById(answersB);

  for (const rule of DEALBREAKER_RULES) {
    const dbA = mapA[rule.dbQId];
    const lsB = mapB[rule.lifestyleQId];
    if (dbA?.answer_index === rule.dbIndex && lsB && rule.badIndexes.includes(lsB.answer_index)) return true;

    const dbB = mapB[rule.dbQId];
    const lsA = mapA[rule.lifestyleQId];
    if (dbB?.answer_index === rule.dbIndex && lsA && rule.badIndexes.includes(lsA.answer_index)) return true;
  }
  return false;
}

export function computeCompatibility(answersA: Answer[], answersB: Answer[]): number {
  if (isHardBlocked(answersA, answersB)) return 0;

  const mapA = indexById(answersA);
  const mapB = indexById(answersB);

  const categoryScores: Record<string, { total: number; count: number }> = {};

  for (const qId of Object.keys(mapA)) {
    const a = mapA[Number(qId)];
    const b = mapB[Number(qId)];
    if (!a || !b) continue;

    const cat = a.category;
    if (!categoryScores[cat]) categoryScores[cat] = { total: 0, count: 0 };
    categoryScores[cat].total += questionScore(a.answer_index, b.answer_index);
    categoryScores[cat].count += 1;
  }

  let weightedScore = 0;
  for (const [cat, { total, count }] of Object.entries(categoryScores)) {
    if (count === 0) continue;
    const catAvg = total / count;
    weightedScore += catAvg * (CATEGORY_WEIGHTS[cat] ?? 0);
  }

  return Math.round(weightedScore * 100);
}

export function getSharedHighlights(answersA: Answer[], answersB: Answer[]): string[] {
  const mapB = indexById(answersB);
  return answersA
    .filter((a) => mapB[a.question_id]?.answer_index === a.answer_index)
    .slice(0, 3)
    .map((a) => a.answer_text);
}
