/**
 * Demo Mock Data for Development & Testing
 * Replace with actual data from API in production
 */

export const mockPatient = {
  id: 'patient-001',
  bedNo: 'ICU-105',
  initials: 'JD',
  insertionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  patientFactors: {
    agitation: true,
    extremeAge: false,
    obesity: false,
    diabetes: true,
    ckd: false,
    cancer: false,
    dialysis: false,
    tpn: true,
    immunosuppression: false,
    malnutrition: false,
  },
  safetyChecklist: {
    capsClosed: true,
    glovesWorn: true,
    noAbnormalities: true,
    dressingIntact: true,
  },
};

export const mockRiskScore = {
  patientId: 'patient-001',
  clisaScore: 3,
  predictiveClabsiScore: 4,
  predictiveClabsiBand: 'yellow' as const,
  predictiveVenousResistanceBand: 'green' as const,
  recommendedAction: 'Flush Q12h + Inform Medical Officer',
  actionColor: 'yellow' as const,
  computedAt: new Date(),
};

export const mockAlerts = [
  {
    id: 'alert-001',
    patientId: 'patient-001',
    reason: 'Predictive CLABSI Risk = Yellow',
    severity: 'yellow' as const,
    recommendedAction: 'Increase flushing frequency to Q12h',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    acknowledged: false,
  },
];

export const mockTrendData = [
  {
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    clisaScore: 2,
    predictiveClabsiScore: 2,
    predictiveVenousResistanceBand: 'green' as const,
  },
  {
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
    clisaScore: 3,
    predictiveClabsiScore: 3,
    predictiveVenousResistanceBand: 'green' as const,
    eventType: 'dressing_change' as const,
  },
  {
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    clisaScore: 2,
    predictiveClabsiScore: 2,
    predictiveVenousResistanceBand: 'green' as const,
  },
  {
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    clisaScore: 4,
    predictiveClabsiScore: 4,
    predictiveVenousResistanceBand: 'yellow' as const,
  },
];

export const mockWardAnalytics = [
  {
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    clabsiCases: 2,
    totalCentralLineDays: 45,
    dressingChangeCount: 30,
    catheterChangeCount: 2,
    clabsiRate: 44.44,
  },
  {
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    clabsiCases: 1,
    totalCentralLineDays: 48,
    dressingChangeCount: 32,
    catheterChangeCount: 1,
    clabsiRate: 20.83,
  },
  {
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    clabsiCases: 1,
    totalCentralLineDays: 50,
    dressingChangeCount: 35,
    catheterChangeCount: 1,
    clabsiRate: 20.0,
  },
  {
    date: new Date(),
    clabsiCases: 0,
    totalCentralLineDays: 52,
    dressingChangeCount: 38,
    catheterChangeCount: 0,
    clabsiRate: 0,
  },
];

export const mockResourceDeprivation = {
  wardId: 'ward-icu-1',
  patientsNeedingToday: 8,
  availableDressings: 5,
  availableCatheters: 8,
  dressingDeprivationRate: 37.5,
  catheterDeprivationRate: 0,
  combinedDeprivedRate: 18.75,
  deprivationBand: 'shortage' as const,
  alertTriggered: false,
};
