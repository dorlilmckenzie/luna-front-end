import { api } from './api';
import type { ApiEnvelope, ReminderPreference } from '@/types';

export async function getReminders(): Promise<ReminderPreference> {
  const res = await api.get<ApiEnvelope<{ reminders: ReminderPreference }>>('/reminders');
  return res.data.data.reminders;
}

export async function updateReminders(
  input: Partial<Omit<ReminderPreference, 'updatedAt'>>,
): Promise<ReminderPreference> {
  const res = await api.patch<ApiEnvelope<{ reminders: ReminderPreference }>>('/reminders', input);
  return res.data.data.reminders;
}
