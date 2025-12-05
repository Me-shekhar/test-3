import 'next/dist/build/swc/types'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      GEMINI_API_KEY: string;
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_API_URL: string;
    }
  }
}

export interface PatientFactors {
  agitation: boolean;
  extremeAge: boolean;
  obesity: boolean;
  diabetes: boolean;
  ckd: boolean;
  cancer: boolean;
  dialysis: boolean;
  tpn: boolean;
  immunosuppression: boolean;
  malnutrition: boolean;
}

export interface SafetyChecklist {
  capsClosed: boolean;
  glovesWorn: boolean;
  noAbnormalities: boolean;
  dressingIntact: boolean;
}

export interface Patient {
  id: string;
  bedNo: string;
  initials: string;
  insertionDate: Date;
  patientFactors: PatientFactors;
  safetyChecklist: SafetyChecklist;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentRecord {
  id: string;
  patientId: string;
  audioPlayed: boolean;
  audioLanguageUsed: string;
  playbackFinishedTimestamp: Date | null;
  consentObtained: boolean;
  createdAt: Date;
}

export interface ImageCapture {
  id: string;
  patientId: string;
  cathetersiteUrl: string;
  tractionDeviceUrl?: string;
  yellowPulls: number;
  redPulls: number;
  capturedAt: Date;
}

export interface RiskScore {
  patientId: string;
  clisaScore: number;
  predictiveClabsiScore: number;
  predictiveClabsiBand: 'green' | 'yellow' | 'red';
  predictiveVenousResistanceBand: 'green' | 'yellow' | 'red';
  recommendedAction: string;
  actionColor: 'green' | 'yellow' | 'orange' | 'red';
  computedAt: Date;
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  reason: string;
  severity: 'green' | 'yellow' | 'orange' | 'red';
  recommendedAction: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface TrendData {
  timestamp: Date;
  clisaScore: number;
  predictiveClabsiScore: number;
  predictiveVenousResistanceBand: 'green' | 'yellow' | 'red';
  eventType?: 'dressing_change' | 'catheter_change' | 'flushing';
}

export interface WardAnalytics {
  id: string;
  wardId: string;
  date: Date;
  clabsiCases: number;
  totalCentralLineDays: number;
  dressingChangeCount: number;
  catheterChangeCount: number;
  derivedRate: number;
}

export interface ResourceDeprivation {
  id: string;
  wardId: string;
  patientsNeedingToday: number;
  availableDressings: number;
  availableCatheters: number;
  dressingDeprivationRate: number;
  catheterDeprivationRate: number;
  combinedDeprivedRate: number;
  deprivationBand: 'safe' | 'shortage' | 'major_shortage' | 'critical';
  alertTriggered: boolean;
  computedAt: Date;
}

export {}
