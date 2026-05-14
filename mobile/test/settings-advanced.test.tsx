import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { Alert } from 'react-native';

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

jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ onChange, testID }: any) => (
      <View testID={testID ?? 'date-time-picker'} onChange={onChange} />
    ),
  };
});

jest.mock('@/services/storage.service', () => ({
  clearAll: jest.fn().mockResolvedValue(undefined),
  STORAGE_KEYS: {},
}));

const mockRequestPermissions = jest.fn().mockResolvedValue(true);
const mockScheduleReminder = jest.fn().mockResolvedValue('notif-id');
const mockCancelAllReminders = jest.fn().mockResolvedValue(undefined);

jest.mock('@/services/reminder.service', () => ({
  requestPermissions: (...args: any[]) => mockRequestPermissions(...args),
  scheduleReminder: (...args: any[]) => mockScheduleReminder(...args),
  cancelAllReminders: (...args: any[]) => mockCancelAllReminders(...args),
}));

jest.mock('@/services/tracking.service', () => ({
  trackSettingsOpened: jest.fn(),
  trackReminderEnabled: jest.fn(),
  trackReminderDisabled: jest.fn(),
}));

const mockSettingsState = {
  settings: {
    resetSoundEnabled: false,
    hapticFeedbackEnabled: true,
    reminderEnabled: false,
    reminderTime: '08:00',
    defaultResetDuration: 5,
    suggestUsualMood: true,
    darkMode: true,
    breathingSpeed: 'Normal',
    ambientSound: 'None',
  },
  loadSettings: jest.fn().mockResolvedValue(undefined),
  updateSetting: jest.fn().mockResolvedValue(undefined),
  resetToDefaults: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => sel ? sel(mockSettingsState) : mockSettingsState,
}));

import SettingsScreen from '@/app/settings';

describe('SettingsScreen advanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSettingsState.settings.reminderEnabled = false;
    mockSettingsState.settings.reminderTime = '08:00';
    mockRequestPermissions.mockResolvedValue(true);
  });

  it('renders without crashing', () => {
    render(<SettingsScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('enables reminder: requests permissions and schedules', async () => {
    render(<SettingsScreen />);
    await act(async () => {
      fireEvent(screen.getByTestId('toggle-reminder'), 'valueChange', true);
    });
    expect(mockRequestPermissions).toHaveBeenCalled();
    expect(mockScheduleReminder).toHaveBeenCalledWith('08:00');
  });

  it('enables reminder: shows alert when permission denied', async () => {
    mockRequestPermissions.mockResolvedValue(false);
    const alertSpy = jest.spyOn(Alert, 'alert');
    render(<SettingsScreen />);
    await act(async () => {
      fireEvent(screen.getByTestId('toggle-reminder'), 'valueChange', true);
    });
    expect(alertSpy).toHaveBeenCalledWith('Permission Required', expect.any(String));
    alertSpy.mockRestore();
  });

  it('disables reminder: cancels all reminders', async () => {
    mockSettingsState.settings.reminderEnabled = true;
    render(<SettingsScreen />);
    await act(async () => {
      fireEvent(screen.getByTestId('toggle-reminder'), 'valueChange', false);
    });
    expect(mockCancelAllReminders).toHaveBeenCalled();
  });

  it('shows reminder time picker when reminder enabled', () => {
    mockSettingsState.settings.reminderEnabled = true;
    render(<SettingsScreen />);
    expect(screen.getByText('Reminder Time')).toBeTruthy();
    expect(screen.getByText('08:00')).toBeTruthy();
  });

  it('toggles time picker when reminder time row pressed', () => {
    mockSettingsState.settings.reminderEnabled = true;
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText('Reminder Time'));
    expect(screen.getByTestId('date-time-picker')).toBeTruthy();
  });

  it('handleReminderTimeChange: skips if no date provided', async () => {
    mockSettingsState.settings.reminderEnabled = true;
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText('Reminder Time'));
    const picker = screen.getByTestId('date-time-picker');
    await act(async () => {
      fireEvent(picker, 'onChange', { type: 'set' }, undefined);
    });
    expect(mockSettingsState.updateSetting).not.toHaveBeenCalled();
  });

  it('handleReminderTimeChange: updates time and reschedules when reminder enabled', async () => {
    mockSettingsState.settings.reminderEnabled = true;
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText('Reminder Time'));
    const picker = screen.getByTestId('date-time-picker');
    const newDate = new Date();
    newDate.setHours(9, 30, 0, 0);
    await act(async () => {
      fireEvent(picker, 'onChange', { type: 'set' }, newDate);
    });
    expect(mockSettingsState.updateSetting).toHaveBeenCalledWith('reminderTime', '09:30');
    expect(mockCancelAllReminders).toHaveBeenCalled();
    expect(mockScheduleReminder).toHaveBeenCalledWith('09:30');
  });

  it('handleClearData: shows confirmation alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId('clear-data-btn'));
    expect(alertSpy).toHaveBeenCalledWith('Clear All Data', expect.any(String), expect.any(Array));
    alertSpy.mockRestore();
  });

  it('handleClearData: confirmed calls clearAll and resetToDefaults', async () => {
    const { clearAll } = require('@/services/storage.service');
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons: any) => {
      if (!Array.isArray(buttons)) return;
      const clearBtn = buttons.find((b: any) => b.text === 'Clear');
      if (clearBtn?.onPress) act(() => { clearBtn.onPress(); });
    });
    render(<SettingsScreen />);
    await act(async () => { fireEvent.press(screen.getByTestId('clear-data-btn')); });
    expect(clearAll).toHaveBeenCalled();
    expect(mockSettingsState.resetToDefaults).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('handleResetDefaults: shows confirmation alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    render(<SettingsScreen />);
    fireEvent.press(screen.getByText('Reset to Defaults'));
    expect(alertSpy).toHaveBeenCalledWith('Reset Settings', expect.any(String), expect.any(Array));
    alertSpy.mockRestore();
  });

  it('handleResetDefaults: confirmed calls resetToDefaults', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons: any) => {
      const resetBtn = buttons.find((b: any) => b.text === 'Reset');
      if (resetBtn?.onPress) act(() => { resetBtn.onPress(); });
    });
    render(<SettingsScreen />);
    await act(async () => { fireEvent.press(screen.getByText('Reset to Defaults')); });
    expect(mockSettingsState.resetToDefaults).toHaveBeenCalled();
    jest.restoreAllMocks();
  });

  it('segment row selects duration', async () => {
    render(<SettingsScreen />);
    await act(async () => { fireEvent.press(screen.getByText('10')); });
    expect(mockSettingsState.updateSetting).toHaveBeenCalledWith('defaultResetDuration', 10);
  });

  it('segment row selects breathing speed', async () => {
    render(<SettingsScreen />);
    await act(async () => { fireEvent.press(screen.getByText('Slow')); });
    expect(mockSettingsState.updateSetting).toHaveBeenCalledWith('breathingSpeed', 'Slow');
  });

  it('segment row selects ambient sound', async () => {
    render(<SettingsScreen />);
    await act(async () => { fireEvent.press(screen.getByText('Ocean')); });
    expect(mockSettingsState.updateSetting).toHaveBeenCalledWith('ambientSound', 'Ocean');
  });
});
