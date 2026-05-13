import type { MeditationSession, ResetSession, User } from '@/types';

export interface ApiErrorBody {
  statusCode?: number;
  error?: string;
  message?: string | string[];
  timestamp?: string;
  path?: string;
  code?: string;
}

export interface ApiAuthResponse {
  access_token: string;
  user: User;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  username: string;
}

export interface ResetRequest {
  external_id: string;
  duration_minutes: number;
  score_before: number;
  score_after: number;
  started_at: string;
  ended_at?: string;
  completed?: boolean;
}

export interface ResetResponse {
  session_id: string;
  status: 'completed' | 'pending';
  improvement: number;
}

export interface HistoryItemResponse {
  id?: string;
  session_id?: string;
  duration_minutes: number;
  started_at: string;
  ended_at?: string | null;
  completed?: boolean;
  score_before?: number | null;
  score_after?: number | null;
  improvement?: number | null;
}

export interface SyncRequest {
  sessions: ResetRequest[];
}

export interface SyncResponse {
  synced: number;
  duplicates: number;
}

export interface AnalyticsResponse {
  streak: number;
  totalSessions: number;
  avgImprovement: number;
  weeklyData: number[];
  recentSessions?: HistoryItemResponse[];
}

export interface MeditationSessionResponse {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  duration_minutes: number;
  channel_name: string;
  status: string;
  max_participants?: number | null;
  participant_count?: number;
}

export interface MeditationJoinResponse {
  status: 'joined';
}

export interface MeditationTokenResponse {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  expiresAt: string;
}

export type ProfileResponse = User;

export function toResetRequest(session: ResetSession): ResetRequest | null {
  const externalId = session.externalId ?? session.id;
  if (
    !externalId ||
    ![3, 5, 7, 10].includes(session.durationMinutes) ||
    session.scoreBefore == null ||
    session.scoreAfter == null ||
    session.scoreBefore < 1 ||
    session.scoreBefore > 5 ||
    session.scoreAfter < 1 ||
    session.scoreAfter > 5
  ) {
    return null;
  }

  return {
    external_id: externalId,
    duration_minutes: session.durationMinutes,
    score_before: session.scoreBefore,
    score_after: session.scoreAfter,
    started_at: session.startedAt,
    ended_at: session.endedAt,
    completed: session.completed,
  };
}

export function fromHistoryItem(item: HistoryItemResponse): ResetSession {
  const id = item.session_id ?? item.id ?? '';
  return {
    id,
    externalId: id,
    durationMinutes: item.duration_minutes,
    startedAt: item.started_at,
    endedAt: item.ended_at ?? undefined,
    completed: item.completed ?? true,
    scoreBefore: item.score_before ?? undefined,
    scoreAfter: item.score_after ?? undefined,
    synced: true,
  };
}

export function fromMeditationSession(
  item: MeditationSessionResponse,
): MeditationSession {
  return {
    id: item.id,
    title: item.title,
    description: item.description ?? '',
    startTime: item.start_time,
    durationMinutes: item.duration_minutes,
    participantCount: item.participant_count ?? 0,
    isLive: item.status === 'LIVE' || item.status === 'IN_PROGRESS',
    channelName: item.channel_name,
    status: item.status,
    maxParticipants: item.max_participants ?? undefined,
  };
}
