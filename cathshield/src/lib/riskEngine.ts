import { RiskScore, PatientFactors, SafetyChecklist } from '@/types';

interface RiskEngineInput {
  daysOnCatheter: number;
  dressing: {
    integrityScore: number; // 0-4 based on image analysis
    recentChange: boolean;
  };
  traction: {
    yellowPullsLast12h: number;
    redPullsLast12h: number;
  };
  patientFactors: PatientFactors;
  safetyChecklist: SafetyChecklist;
}

export function calculateRiskScore(input: RiskEngineInput): RiskScore {
  // Domain A: CLISA + dressing integrity (0-4)
  let domainA = input.dressing.integrityScore;
  if (!input.dressing.recentChange) {
    domainA = Math.min(4, domainA + 1); // Penalty if no recent change
  }

  // Domain B: Traction risk (0-3)
  let domainB = 0;
  if (input.traction.yellowPullsLast12h >= 2) domainB += 1;
  if (input.traction.yellowPullsLast12h >= 5) domainB += 1;
  if (input.traction.redPullsLast12h >= 1) domainB = 3;
  domainB = Math.min(3, domainB);

  // Domain C: Patient/systemic factors (0-3)
  let domainC = 0;
  const riskFactorCount = Object.values(input.patientFactors).filter(Boolean).length;
  if (riskFactorCount >= 3) domainC = 1;
  if (riskFactorCount >= 5) domainC = 2;
  if (riskFactorCount >= 7) domainC = 3;

  // Safety checklist bonus (reduces score by 1 if all passed)
  const checklistPassed = Object.values(input.safetyChecklist).every(Boolean);

  // Domain D: Dwell time adjustment (auto +1 after day 9)
  let domainD = 0;
  if (input.daysOnCatheter > 9) domainD = 1;

  // Calculate composite scores
  let clisaScore = domainA + domainB; // 0-7
  let predictiveClabsiScore = domainA + domainB + domainC + domainD; // 0-10
  
  if (checklistPassed) {
    predictiveClabsiScore = Math.max(0, predictiveClabsiScore - 1);
  }

  // Determine bands
  const predictiveClabsiBand = predictiveClabsiScore <= 3 ? 'green' : predictiveClabsiScore <= 6 ? 'yellow' : 'red';
  
  // Venous Resistance Risk = based on traction + dwell time
  let venousResistanceScore = domainB + (input.daysOnCatheter > 7 ? 1 : 0);
  const predictiveVenousResistanceBand = venousResistanceScore <= 1 ? 'green' : venousResistanceScore <= 2 ? 'yellow' : 'red';

  // Recommended action based on CVL-RCRI protocol
  let recommendedAction = '';
  let actionColor: 'green' | 'yellow' | 'orange' | 'red' = 'green';

  if (predictiveClabsiScore <= 3) {
    recommendedAction = 'Routine flush Q24h';
    actionColor = 'green';
  } else if (predictiveClabsiScore <= 6) {
    recommendedAction = 'Flush Q12h + Inform Medical Officer';
    actionColor = 'yellow';
  } else if (predictiveClabsiScore <= 9) {
    recommendedAction = 'Flush Q8h + Urgent Ultrasound';
    actionColor = 'orange';
  } else {
    recommendedAction = 'Stop infusions + Emergency Medical Officer';
    actionColor = 'red';
  }

  return {
    patientId: '',
    clisaScore,
    predictiveClabsiScore,
    predictiveClabsiBand: predictiveClabsiBand as 'green' | 'yellow' | 'red',
    predictiveVenousResistanceBand: predictiveVenousResistanceBand as 'green' | 'yellow' | 'red',
    recommendedAction,
    actionColor,
    computedAt: new Date(),
  };
}

/**
 * Mock AI image analysis - replace with actual ML model integration
 * Returns dressing integrity score (0-4)
 */
export async function analyzeDressingImage(imageUrl: string): Promise<number> {
  // In production, call actual ML model via Gemini API
  // For now, return random score between 0-4
  return Math.floor(Math.random() * 5);
}

/**
 * Determine if alert should be triggered
 */
export function shouldTriggerAlert(
  clabsiBand: 'green' | 'yellow' | 'red',
  venousResistanceBand: 'green' | 'yellow' | 'red',
  tractionCluster: boolean
): boolean {
  return clabsiBand !== 'green' || venousResistanceBand !== 'green' || tractionCluster;
}
