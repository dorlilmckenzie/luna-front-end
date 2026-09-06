import { api } from './api';
import type { ApiEnvelope, Flow, Period } from '@/types';

export interface PeriodInput {
  startDate: string;
  endDate?: string | null;
  flow: Flow;
  notes?: string | null;
}

export async function listPeriods(params?: { from?: string; to?: string; limit?: number }): Promise<Period[]> {
  const res = await api.get<ApiEnvelope<{ periods: Period[] }>>('/periods', { params });
  return res.data.data.periods;
}

export async function getPeriod(id: string): Promise<Period> {
  const res = await api.get<ApiEnvelope<{ period: Period }>>(`/periods/${id}`);
  return res.data.data.period;
}

export async function createPeriod(input: PeriodInput): Promise<Period> {
  const res = await api.post<ApiEnvelope<{ period: Period }>>('/periods', input);
  return res.data.data.period;
}

export async function updatePeriod(id: string, input: Partial<PeriodInput>): Promise<Period> {
  const res = await api.patch<ApiEnvelope<{ period: Period }>>(`/periods/${id}`, input);
  return res.data.data.period;
}

export async function deletePeriod(id: string): Promise<void> {
  await api.delete(`/periods/${id}`);
}
