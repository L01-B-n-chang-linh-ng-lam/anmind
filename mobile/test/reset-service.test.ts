import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  multiRemove: jest.fn().mockResolvedValue(undefined),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as resetService from '@/services/reset.service';
import type { ResetSession } from '@/types';

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;

const sampleSession: ResetSession = {
  id: 'session-001',
  durationMinutes: 5,
  startedAt: '2026-01-01T10:00:00Z',
  endedAt: '2026-01-01T10:05:00Z',
  completed: true,
  scoreBefore: 2,
  scoreAfter: 4,
};

describe('resetService.getSessions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns empty array when storage is empty', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await resetService.getSessions();
    expect(result).toEqual([]);
  });

  it('returns parsed sessions from storage', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleSession]));
    const result = await resetService.getSessions();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('session-001');
  });
});

describe('resetService.addSession', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appends session to existing sessions', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleSession]));
    const newSession: ResetSession = { ...sampleSession, id: 'session-002' };
    await resetService.addSession(newSession);
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved).toHaveLength(2);
    expect(saved[1].id).toBe('session-002');
  });

  it('creates new array when storage is empty', async () => {
    mockGetItem.mockResolvedValue(null);
    await resetService.addSession(sampleSession);
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved).toHaveLength(1);
  });
});

describe('resetService.deleteSession', () => {
  beforeEach(() => jest.clearAllMocks());

  it('removes session with matching id', async () => {
    const sessions = [sampleSession, { ...sampleSession, id: 'session-002' }];
    mockGetItem.mockResolvedValue(JSON.stringify(sessions));
    await resetService.deleteSession('session-001');
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('session-002');
  });

  it('does nothing when id not found', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleSession]));
    await resetService.deleteSession('nonexistent');
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved).toHaveLength(1);
  });
});

describe('resetService.updateSession', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates matching session', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([sampleSession]));
    await resetService.updateSession('session-001', { durationMinutes: 10 });
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved[0].durationMinutes).toBe(10);
  });
});

describe('resetService.clearSessions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('writes an empty array to storage', async () => {
    await resetService.clearSessions();
    const saved = JSON.parse((mockSetItem.mock.calls[0] as [string, string])[1]);
    expect(saved).toEqual([]);
  });
});
