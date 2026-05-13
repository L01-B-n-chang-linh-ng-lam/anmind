import type { MeditationSession } from '@/types';
import { api } from './api';
import type {
  MeditationJoinResponse,
  MeditationSessionResponse,
  MeditationTokenResponse,
} from './api.types';
import { fromMeditationSession } from './api.types';

export async function getMeditationSessions(): Promise<MeditationSession[]> {
  const { data } = await api.get<MeditationSessionResponse[]>('/meditation-sessions');
  return data.map(fromMeditationSession);
}

export async function getMeditationSession(id: string): Promise<MeditationSession> {
  const { data } = await api.get<MeditationSessionResponse>(`/meditation-sessions/${id}`);
  return fromMeditationSession(data);
}

export async function joinMeditationSession(id: string): Promise<MeditationJoinResponse> {
  const { data } = await api.post<MeditationJoinResponse>(`/meditation-sessions/${id}/join`);
  return data;
}

export async function getMeditationToken(id: string): Promise<MeditationTokenResponse> {
  const { data } = await api.get<MeditationTokenResponse>(`/meditation-sessions/${id}/token`);
  return data;
}
