export const queryKeys = {
  me: ['me'] as const,
  profile: ['profile'] as const,
  periods: (params?: Record<string, unknown>) => ['periods', params ?? {}] as const,
  period: (id: string) => ['period', id] as const,
  symptoms: (params?: Record<string, unknown>) => ['symptoms', params ?? {}] as const,
  moods: (params?: Record<string, unknown>) => ['moods', params ?? {}] as const,
  cycles: ['cycles'] as const,
  statistics: ['statistics'] as const,
  summary: ['summary'] as const,
  prediction: ['prediction'] as const,
  calendarOverlay: (from: string, to: string) => ['calendar-overlay', from, to] as const,
  reminders: ['reminders'] as const,
};
