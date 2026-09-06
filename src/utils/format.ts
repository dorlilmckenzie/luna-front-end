import { format, parseISO } from 'date-fns';
import type { Flow, MoodValue, Severity, SymptomType } from '@/types';

export function formatDate(iso: string | null | undefined, fallback = '—'): string {
  if (!iso) return fallback;
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return fallback;
  }
}

export function formatShortDate(iso: string | null | undefined, fallback = '—'): string {
  if (!iso) return fallback;
  try {
    return format(parseISO(iso), 'MMM d');
  } catch {
    return fallback;
  }
}

export const FLOW_LABELS: Record<Flow, string> = {
  LIGHT: 'Light',
  MEDIUM: 'Medium',
  HEAVY: 'Heavy',
  VERY_HEAVY: 'Very heavy',
};

export const SYMPTOM_LABELS: Record<SymptomType, string> = {
  CRAMPS: 'Cramps',
  HEADACHE: 'Headache',
  BLOATING: 'Bloating',
  ACNE: 'Acne',
  FATIGUE: 'Fatigue',
  BACK_PAIN: 'Back pain',
  MOOD_CHANGES: 'Mood changes',
  BREAST_TENDERNESS: 'Breast tenderness',
  NAUSEA: 'Nausea',
  OTHER: 'Other',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  MILD: 'Mild',
  MODERATE: 'Moderate',
  SEVERE: 'Severe',
};

export const MOOD_LABELS: Record<MoodValue, string> = {
  HAPPY: 'Happy',
  CALM: 'Calm',
  ENERGETIC: 'Energetic',
  NEUTRAL: 'Neutral',
  SAD: 'Sad',
  IRRITATED: 'Irritated',
  ANXIOUS: 'Anxious',
  TIRED: 'Tired',
};

export const MOOD_EMOJI: Record<MoodValue, string> = {
  HAPPY: '😊',
  CALM: '😌',
  ENERGETIC: '⚡',
  NEUTRAL: '😐',
  SAD: '😔',
  IRRITATED: '😤',
  ANXIOUS: '😰',
  TIRED: '😴',
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  none: 'Not enough data',
  low: 'Low confidence',
  medium: 'Medium confidence',
  high: 'High confidence',
};

export function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return format(parseISO(iso), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

export function todayInputValue(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Normalise any ISO datetime string to a YYYY-MM-DD key for map lookups. */
export function isoToDayKey(iso: string): string {
  try {
    return format(parseISO(iso), 'yyyy-MM-dd');
  } catch {
    return iso.slice(0, 10);
  }
}
