import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockLoadSettings = jest.fn();
const mockLoadSessions = jest.fn();
const mockLoadAuth = jest.fn();

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name }: any) => <Text>{name}</Text> };
});

jest.mock('@/store/settingsStore', () => ({
  useSettingsStore: (sel?: any) => {
    const s = { loadSettings: mockLoadSettings };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/resetStore', () => ({
  useResetStore: (sel?: any) => {
    const s = { loadSessions: mockLoadSessions };
    return sel ? sel(s) : s;
  },
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel?: any) => {
    const s = { loadAuth: mockLoadAuth };
    return sel ? sel(s) : s;
  },
}));

jest.mock('expo-router', () => {
  const { View } = require('react-native');
  const TabsMock = ({ children }: any) => <View testID="tabs-navigator">{children}</View>;
  TabsMock.Screen = ({ name }: any) => <View testID={`tab-screen-${name}`} />;
  return { Tabs: TabsMock };
});

import TabsLayout from '@/app/(tabs)/_layout';

describe('TabsLayout', () => {
  beforeEach(() => {
    mockLoadSettings.mockClear();
    mockLoadSessions.mockClear();
    mockLoadAuth.mockClear();
  });

  it('renders without crashing', () => {
    render(<TabsLayout />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders the Tabs navigator', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('tabs-navigator')).toBeTruthy();
  });

  it('renders all four tab screens', () => {
    render(<TabsLayout />);
    expect(screen.getByTestId('tab-screen-index')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-reset')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-community')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-profile')).toBeTruthy();
  });

  it('calls loadSettings on mount', () => {
    render(<TabsLayout />);
    expect(mockLoadSettings).toHaveBeenCalled();
  });

  it('calls loadSessions on mount', () => {
    render(<TabsLayout />);
    expect(mockLoadSessions).toHaveBeenCalled();
  });

  it('calls loadAuth on mount', () => {
    render(<TabsLayout />);
    expect(mockLoadAuth).toHaveBeenCalled();
  });
});
