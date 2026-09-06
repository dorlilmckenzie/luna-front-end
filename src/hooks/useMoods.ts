'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as moodService from '@/services/mood.service';
import type { MoodInput } from '@/services/mood.service';

export function useMoods(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: queryKeys.moods(params),
    queryFn: () => moodService.listMoods(params),
  });
}

export function useCreateMood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MoodInput) => moodService.createMood(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moods'] }),
  });
}

export function useDeleteMood() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => moodService.deleteMood(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['moods'] }),
  });
}
