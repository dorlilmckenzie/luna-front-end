export type Flow = 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'VERY_HEAVY';

export type SymptomType =
  | 'CRAMPS'
  | 'HEADACHE'
  | 'BLOATING'
  | 'ACNE'
  | 'FATIGUE'
  | 'BACK_PAIN'
  | 'MOOD_CHANGES'
  | 'BREAST_TENDERNESS'
  | 'NAUSEA'
  | 'OTHER';

export type Severity = 'MILD' | 'MODERATE' | 'SEVERE';

export type MoodValue =
  | 'HAPPY'
  | 'CALM'
  | 'ENERGETIC'
  | 'NEUTRAL'
  | 'SAD'
  | 'IRRITATED'
  | 'ANXIOUS'
  | 'TIRED';

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: { field?: string; message: string }[];
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface Period {
  id: string;
  startDate: string;
  endDate: string | null;
  flow: Flow;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomLog {
  id: string;
  date: string;
  type: SymptomType;
  severity: Severity;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: MoodValue;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cycle {
  index: number;
  periodStart: string;
  periodEnd: string | null;
  periodLength: number | null;
  cycleLength: number | null;
}

export interface CycleStatistics {
  cyclesTracked: number;
  averageCycleLength: number | null;
  shortestCycle: number | null;
  longestCycle: number | null;
  averagePeriodLength: number | null;
  shortestPeriod: number | null;
  longestPeriod: number | null;
  periodsLogged: number;
  lastPeriodStart: string | null;
}

export interface CurrentCycleInfo {
  cycleDay: number | null;
  onPeriod: boolean;
  lastPeriodStart: string | null;
  lastPeriodEnd: string | null;
}

export type PredictionConfidence = 'none' | 'low' | 'medium' | 'high';

export interface Prediction {
  hasEnoughData: boolean;
  confidence: PredictionConfidence;
  basedOnCycles: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodStart: string | null;
  nextPeriod: {
    startDate: string;
    endDate: string;
    earliest: string;
    latest: string;
  } | null;
  ovulation: { estimatedDate: string } | null;
  fertileWindow: { startDate: string; endDate: string } | null;
  disclaimer: string;
  note?: string;
}

export interface CalendarOverlay {
  predictedPeriod: string[];
  fertileWindow: string[];
  ovulation: string[];
}

export interface ReminderPreference {
  periodReminder: boolean;
  periodReminderDaysBefore: number;
  symptomReminder: boolean;
  reminderTime: string;
  updatedAt: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
}
