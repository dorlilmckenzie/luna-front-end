import { api } from './api';
import type { ApiEnvelope, Severity, SymptomLog, SymptomType } from '@/types';

export interface SymptomInput {
  date: string;
  types: SymptomType[];
  severity: Severity;
  notes?: string | null;
}

export async function listSymptoms(params?: { from?: string; to?: string }): Promise<SymptomLog[]> {
  const res = await api.get<ApiEnvelope<{ symptoms: SymptomLog[] }>>('/symptoms', { params });
  return res.data.data.symptoms;
}

export async function createSymptoms(input: SymptomInput): Promise<SymptomLog[]> {
  const res = await api.post<ApiEnvelope<{ symptoms: SymptomLog[] }>>('/symptoms', input);
  return res.data.data.symptoms;
}

export async function updateSymptom(
  id: string,
  input: Partial<{ date: string; type: SymptomType; severity: Severity; notes: string | null }>,
): Promise<SymptomLog> {
  const res = await api.patch<ApiEnvelope<{ symptom: SymptomLog }>>(`/symptoms/${id}`, input);
  return res.data.data.symptom;
}

export async function deleteSymptom(id: string): Promise<void> {
  await api.delete(`/symptoms/${id}`);
}
