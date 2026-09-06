import { api } from './api';
import type { ApiEnvelope, MoodLog, MoodValue } from '@/types';

export interface MoodInput {
  date: string;
  mood: MoodValue;
  notes?: string | null;
}

export async function listMoods(params?: { from?: string; to?: string }): Promise<MoodLog[]> {
  const res = await api.get<ApiEnvelope<{ moods: MoodLog[] }>>('/moods', { params });
  return res.data.data.moods;
}

export async function createMood(input: MoodInput): Promise<MoodLog> {
  const res = await api.post<ApiEnvelope<{ mood: MoodLog }>>('/moods', input);
  return res.data.data.mood;
}

export async function updateMood(id: string, input: Partial<MoodInput>): Promise<MoodLog> {
  const res = await api.patch<ApiEnvelope<{ mood: MoodLog }>>(`/moods/${id}`, input);
  return res.data.data.mood;
}

export async function deleteMood(id: string): Promise<void> {
  await api.delete(`/moods/${id}`);
}
