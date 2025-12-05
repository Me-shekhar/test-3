import { ResourceDeprivation } from '@/types';

export interface DeprivationInput {
  wardId: string;
  patientsNeedingToday: number;
  availableDressings: number;
  availableCatheters: number;
}

export function calculateResourceDeprivation(input: DeprivationInput): ResourceDeprivation {
  const { wardId, patientsNeedingToday, availableDressings, availableCatheters } = input;

  // DDR = (P – D) / P × 100 (if D < P else 0)
  const dressingDeprivationRate = availableDressings < patientsNeedingToday
    ? ((patientsNeedingToday - availableDressings) / patientsNeedingToday) * 100
    : 0;

  // CDR = (P – C) / P × 100 (if C < P else 0)
  const catheterDeprivationRate = availableCatheters < patientsNeedingToday
    ? ((patientsNeedingToday - availableCatheters) / patientsNeedingToday) * 100
    : 0;

  // Combined Deprived Rate = (DDR + CDR) / 2
  const combinedDeprivedRate = (dressingDeprivationRate + catheterDeprivationRate) / 2;

  // Determine band
  let deprivationBand: 'safe' | 'shortage' | 'major_shortage' | 'critical';
  if (combinedDeprivedRate <= 10) {
    deprivationBand = 'safe';
  } else if (combinedDeprivedRate <= 30) {
    deprivationBand = 'shortage';
  } else if (combinedDeprivedRate <= 60) {
    deprivationBand = 'major_shortage';
  } else {
    deprivationBand = 'critical';
  }

  // Trigger alert if > 30%
  const alertTriggered = combinedDeprivedRate > 30;

  return {
    id: `dep_${Date.now()}`,
    wardId,
    patientsNeedingToday,
    availableDressings,
    availableCatheters,
    dressingDeprivationRate: Math.round(dressingDeprivationRate * 100) / 100,
    catheterDeprivationRate: Math.round(catheterDeprivationRate * 100) / 100,
    combinedDeprivedRate: Math.round(combinedDeprivedRate * 100) / 100,
    deprivationBand,
    alertTriggered,
    computedAt: new Date(),
  };
}

export function getDeprivationBandColor(band: 'safe' | 'shortage' | 'major_shortage' | 'critical'): string {
  const colorMap = {
    safe: 'medical-green',
    shortage: 'medical-yellow',
    major_shortage: 'medical-orange',
    critical: 'medical-red',
  };
  return colorMap[band];
}
