'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import * as cycleService from '@/services/cycle.service';

export function useCycles() {
  return useQuery({ queryKey: queryKeys.cycles, queryFn: cycleService.listCycles });
}

export function useStatistics() {
  return useQuery({ queryKey: queryKeys.statistics, queryFn: cycleService.getStatistics });
}

export function useSummary() {
  return useQuery({ queryKey: queryKeys.summary, queryFn: cycleService.getSummary });
}
