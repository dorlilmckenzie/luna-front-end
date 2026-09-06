'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as predictionService from '@/services/prediction.service';

export function usePrediction() {
  return useQuery({ queryKey: queryKeys.prediction, queryFn: predictionService.getPrediction });
}

export function useCalendarOverlay(from: string, to: string) {
  return useQuery({
    queryKey: queryKeys.calendarOverlay(from, to),
    queryFn: () => predictionService.getCalendarOverlay(from, to),
    enabled: Boolean(from && to),
  });
}
