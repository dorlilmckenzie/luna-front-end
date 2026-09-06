import { api } from './api';
import type { ApiEnvelope, Cycle, CurrentCycleInfo, CycleStatistics } from '@/types';

export async function listCycles(): Promise<Cycle[]> {
  const res = await api.get<ApiEnvelope<{ cycles: Cycle[] }>>('/cycles');
  return res.data.data.cycles;
}

export async function getStatistics(): Promise<CycleStatistics> {
  const res = await api.get<ApiEnvelope<{ statistics: CycleStatistics }>>('/cycles/statistics');
  return res.data.data.statistics;
}

export async function getSummary(): Promise<{ current: CurrentCycleInfo; statistics: CycleStatistics }> {
  const res = await api.get<ApiEnvelope<{ current: CurrentCycleInfo; statistics: CycleStatistics }>>(
    '/cycles/summary',
  );
  return res.data.data;
}
