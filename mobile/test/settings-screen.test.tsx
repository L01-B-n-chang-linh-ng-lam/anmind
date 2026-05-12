import { fireEvent, render, screen } from '@testing-library/react-native';
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
  scheduleReminder: jest.fn().mockResolvedValue('notif-id'),
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

describe('SettingsScreen', () => {
  beforeEach(() => { mockBack.mockClear(); mockPush.mockClear(); });

  it('renders without crashing', () => {
    render(<SettingsScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Settings heading', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders Meditation section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Meditation')).toBeTruthy();
  });

  it('renders toggle rows for Reset Sound and Haptic Feedback', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Reset Sound')).toBeTruthy();
    expect(screen.getByText('Haptic Feedback')).toBeTruthy();
  });

  it('renders Default Duration segment', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Default Duration')).toBeTruthy();
  });

  it('renders Breathing Speed segment', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Breathing Speed')).toBeTruthy();
    expect(screen.getByText('Normal')).toBeTruthy();
  });

  it('renders Daily Reminder toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Daily Reminder')).toBeTruthy();
  });

  it('renders Personalization section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Personalization')).toBeTruthy();
    expect(screen.getByText('Dark Mode')).toBeTruthy();
  });

  it('renders Data management options', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Export My Data')).toBeTruthy();
    expect(screen.getByTestId('clear-data-btn')).toBeTruthy();
    expect(screen.getByText('Reset to Defaults')).toBeTruthy();
  });

  it('renders About section with version', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('App Version')).toBeTruthy();
    expect(screen.getByText('1.0.0')).toBeTruthy();
  });

  it('back button calls router.back()', () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(mockBack).toHaveBeenCalled();
  });

  it('renders Ambient Sound segment', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Ambient Sound')).toBeTruthy();
  });

  it('renders Privacy Policy link', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });
});
