'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as periodService from '@/services/period.service';
import type { PeriodInput } from '@/services/period.service';

export function usePeriods(params?: { from?: string; to?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.periods(params),
    queryFn: () => periodService.listPeriods(params),
  });
}

function useInvalidateCycleData() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['periods'] });
    qc.invalidateQueries({ queryKey: queryKeys.cycles });
    qc.invalidateQueries({ queryKey: queryKeys.statistics });
    qc.invalidateQueries({ queryKey: queryKeys.summary });
    qc.invalidateQueries({ queryKey: queryKeys.prediction });
    qc.invalidateQueries({ queryKey: ['calendar-overlay'] });
  };
}

export function useCreatePeriod() {
  const invalidate = useInvalidateCycleData();
  return useMutation({
    mutationFn: (input: PeriodInput) => periodService.createPeriod(input),
    onSuccess: invalidate,
  });
}

export function useUpdatePeriod() {
  const invalidate = useInvalidateCycleData();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PeriodInput> }) =>
      periodService.updatePeriod(id, input),
    onSuccess: invalidate,
  });
}

export function useDeletePeriod() {
  const invalidate = useInvalidateCycleData();
  return useMutation({
    mutationFn: (id: string) => periodService.deletePeriod(id),
    onSuccess: invalidate,
  });
}
