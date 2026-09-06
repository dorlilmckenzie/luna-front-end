'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as reminderService from '@/services/reminder.service';
import type { ReminderPreference } from '@/types';

export function useReminders() {
  return useQuery({ queryKey: queryKeys.reminders, queryFn: reminderService.getReminders });
}

export function useUpdateReminders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Omit<ReminderPreference, 'updatedAt'>>) =>
      reminderService.updateReminders(input),
    onSuccess: (data) => qc.setQueryData(queryKeys.reminders, data),
  });
}
