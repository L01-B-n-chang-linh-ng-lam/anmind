import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: mockBack }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View> };
});

jest.mock('@/services/storage.service', () => ({
  clearAll: jest.fn().mockResolvedValue(undefined),
  STORAGE_KEYS: { ONBOARDING: 'onboardingCompleted', TOKEN: 'authToken', USER: 'currentUser', SESSIONS: 'resetSessions', SETTINGS: 'appSettings', TOPICS: 'selectedTopics' },
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/services/reminder.service', () => ({
  requestPermissions: jest.fn().mockResolvedValue(true),
  scheduleReminder: jest.fn().mockResolvedValue('notif-123'),
  cancelAllReminders: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = {
      settings: { resetSoundEnabled: false, hapticFeedbackEnabled: true, reminderEnabled: false, reminderTime: '08:00', defaultResetDuration: 5, suggestUsualMood: true, darkMode: true, breathingSpeed: 'Normal', ambientSound: 'None' },
      loadSettings: jest.fn().mockResolvedValue(undefined),
      updateSetting: jest.fn().mockResolvedValue(undefined),
      resetToDefaults: jest.fn().mockResolvedValue(undefined),
    };
    return sel ? sel(s) : s;
  },
}));

import SettingsScreen from '@/app/settings';

describe('SettingsScreen interactions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('toggling Reset Sound does not throw', async () => {
    render(<SettingsScreen />);
    const toggle = screen.getByTestId('toggle-reset-sound');
    expect(() => act(() => { fireEvent(toggle, 'valueChange', true); })).not.toThrow();
  });

  it('toggling Haptic Feedback does not throw', async () => {
    render(<SettingsScreen />);
    const toggle = screen.getByTestId('toggle-haptic');
    expect(() => act(() => { fireEvent(toggle, 'valueChange', false); })).not.toThrow();
  });

  it('toggling Suggest Usual Mood does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent(screen.getByTestId('toggle-suggest-mood'), 'valueChange', false); })).not.toThrow();
  });

  it('toggling Dark Mode does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent(screen.getByTestId('toggle-dark-mode'), 'valueChange', false); })).not.toThrow();
  });

  it('enabling daily reminder fires without throwing', async () => {
    render(<SettingsScreen />);
    const toggle = screen.getByTestId('toggle-reminder');
    await act(async () => { fireEvent(toggle, 'valueChange', true); });
    expect(screen.toJSON()).toBeTruthy();
  });

  it('disabling daily reminder fires without throwing', async () => {
    render(<SettingsScreen />);
    const toggle = screen.getByTestId('toggle-reminder');
    await act(async () => { fireEvent(toggle, 'valueChange', false); });
    expect(screen.toJSON()).toBeTruthy();
  });

  it('pressing duration 10 segment does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('10')); })).not.toThrow();
  });

  it('pressing Slow breathing speed does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('Slow')); })).not.toThrow();
  });

  it('pressing Fast breathing speed does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('Fast')); })).not.toThrow();
  });

  it('pressing Rain ambient sound does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('Rain')); })).not.toThrow();
  });

  it('pressing Ocean ambient sound does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('Ocean')); })).not.toThrow();
  });

  it('pressing Forest ambient sound does not throw', async () => {
    render(<SettingsScreen />);
    expect(() => act(() => { fireEvent.press(screen.getByText('Forest')); })).not.toThrow();
  });

  it('Reset to Defaults button is pressable', async () => {
    render(<SettingsScreen />);
    expect(() => fireEvent.press(screen.getByText('Reset to Defaults'))).not.toThrow();
  });

  it('Export My Data button is pressable', async () => {
    render(<SettingsScreen />);
    expect(() => fireEvent.press(screen.getByText('Export My Data'))).not.toThrow();
  });

  it('Clear All Data button is pressable', async () => {
    render(<SettingsScreen />);
    expect(() => fireEvent.press(screen.getByTestId('clear-data-btn'))).not.toThrow();
  });

  it('Privacy Policy button is pressable', async () => {
    render(<SettingsScreen />);
    expect(() => fireEvent.press(screen.getByText('Privacy Policy'))).not.toThrow();
  });
});
