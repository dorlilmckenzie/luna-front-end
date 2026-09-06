'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as symptomService from '@/services/symptom.service';
import type { SymptomInput } from '@/services/symptom.service';

export function useSymptoms(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: queryKeys.symptoms(params),
    queryFn: () => symptomService.listSymptoms(params),
  });
}

export function useCreateSymptoms() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SymptomInput) => symptomService.createSymptoms(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['symptoms'] });
      qc.invalidateQueries({ queryKey: ['calendar-overlay'] });
    },
  });
}

export function useDeleteSymptom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => symptomService.deleteSymptom(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['symptoms'] }),
  });
}
