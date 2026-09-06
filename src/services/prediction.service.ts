import { api } from './api';
import type { ApiEnvelope, CalendarOverlay, Prediction } from '@/types';

export async function getPrediction(): Promise<Prediction> {
  const res = await api.get<ApiEnvelope<{ prediction: Prediction }>>('/predictions');
  return res.data.data.prediction;
}

export async function getCalendarOverlay(
  from: string,
  to: string,
): Promise<{ overlay: CalendarOverlay; prediction: Prediction }> {
  const res = await api.get<ApiEnvelope<{ overlay: CalendarOverlay; prediction: Prediction }>>(
    '/predictions/calendar',
    { params: { from, to } },
  );
  return res.data.data;
}
