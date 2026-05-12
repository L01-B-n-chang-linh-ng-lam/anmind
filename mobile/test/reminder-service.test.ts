import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id-123'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

import * as Notifications from 'expo-notifications';
import * as reminderService from '@/services/reminder.service';

const mockReq = Notifications.requestPermissionsAsync as jest.MockedFunction<
  typeof Notifications.requestPermissionsAsync
>;
const mockSchedule = Notifications.scheduleNotificationAsync as jest.MockedFunction<
  typeof Notifications.scheduleNotificationAsync
>;
const mockCancel = Notifications.cancelScheduledNotificationAsync as jest.MockedFunction<
  typeof Notifications.cancelScheduledNotificationAsync
>;
const mockCancelAll =
  Notifications.cancelAllScheduledNotificationsAsync as jest.MockedFunction<
    typeof Notifications.cancelAllScheduledNotificationsAsync
  >;

describe('reminderService.requestPermissions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns true when permission is granted', async () => {
    (mockReq as any).mockResolvedValue({ status: 'granted' });
    const result = await reminderService.requestPermissions();
    expect(result).toBe(true);
  });

  it('returns false when permission is denied', async () => {
    (mockReq as any).mockResolvedValue({ status: 'denied' });
    const result = await reminderService.requestPermissions();
    expect(result).toBe(false);
  });
});

describe('reminderService.scheduleReminder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls scheduleNotificationAsync with daily trigger', async () => {
    (mockSchedule as any).mockResolvedValue('notif-id-123');
    await reminderService.scheduleReminder('08:30');
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 8, minute: 30 }),
      }),
    );
  });

  it('returns the notification identifier', async () => {
    (mockSchedule as any).mockResolvedValue('notif-id-123');
    const id = await reminderService.scheduleReminder('20:00');
    expect(id).toBe('notif-id-123');
  });

  it('parses time string correctly for midnight', async () => {
    (mockSchedule as any).mockResolvedValue('notif-id-123');
    await reminderService.scheduleReminder('00:00');
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 0, minute: 0 }),
      }),
    );
  });
});

describe('reminderService.cancelReminder', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls cancelScheduledNotificationAsync with the identifier', async () => {
    await reminderService.cancelReminder('some-id');
    expect(mockCancel).toHaveBeenCalledWith('some-id');
  });
});

describe('reminderService.cancelAllReminders', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls cancelAllScheduledNotificationsAsync', async () => {
    await reminderService.cancelAllReminders();
    expect(mockCancelAll).toHaveBeenCalled();
  });
});
