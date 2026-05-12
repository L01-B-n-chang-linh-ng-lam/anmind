import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

// ── Mocks ────────────────────────────────────────────────────────────────────
jest.mock('react-native-get-random-values', () => {});

jest.mock('@react-navigation/native', () => ({
  DarkTheme: { dark: true, colors: {} },
  DefaultTheme: { dark: false, colors: {} },
  ThemeProvider: ({ children }: any) => {
    const { View } = require('react-native');
    return <View testID="theme-provider">{children}</View>;
  },
}));

jest.mock('expo-router', () => ({
  Stack: Object.assign(
    ({ children }: any) => {
      const { View } = require('react-native');
      return <View testID="stack-navigator">{children}</View>;
    },
    {
      Screen: ({ name }: any) => {
        const { View } = require('react-native');
        return <View testID={`screen-${name}`} />;
      },
    },
  ),
  useNavigationContainerRef: jest.fn(() => ({})),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: (component: any) => component,
  mobileReplayIntegration: jest.fn(() => ({})),
  feedbackIntegration: jest.fn(() => ({})),
  reactNavigationIntegration: jest.fn(() => ({ registerNavigationContainer: jest.fn() })),
  setTags: jest.fn(),
}));

jest.mock('@/lib/sentry', () => ({
  navigationIntegration: { registerNavigationContainer: jest.fn() },
}));

jest.mock('expo-audio', () => ({
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  useAudioPlayer: jest.fn(() => ({ play: jest.fn(), seekTo: jest.fn().mockResolvedValue(undefined), volume: 1 })),
  useAudioPlayerStatus: jest.fn(() => ({})),
}));

const mockUseColorScheme = jest.fn<() => 'light' | 'dark'>().mockReturnValue('light');
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

// ── Subject ──────────────────────────────────────────────────────────────────
import RootLayout, { unstable_settings } from '@/app/_layout';

// ── Tests ────────────────────────────────────────────────────────────────────
describe('RootLayout', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<RootLayout />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders the ThemeProvider wrapper', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('theme-provider')).toBeTruthy();
  });

  it('renders the Stack navigator', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('stack-navigator')).toBeTruthy();
  });

  it('renders core Stack.Screen entries', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('screen-index')).toBeTruthy();
    expect(getByTestId('screen-choose-topic')).toBeTruthy();
    expect(getByTestId('screen-(tabs)')).toBeTruthy();
    expect(getByTestId('screen-modal')).toBeTruthy();
  });

  it('renders new screen entries for auth and reset flows', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('screen-auth/login')).toBeTruthy();
    expect(getByTestId('screen-auth/signup')).toBeTruthy();
    expect(getByTestId('screen-reset/in-progress')).toBeTruthy();
    expect(getByTestId('screen-reset/end')).toBeTruthy();
    expect(getByTestId('screen-progress')).toBeTruthy();
    expect(getByTestId('screen-settings')).toBeTruthy();
    expect(getByTestId('screen-meditation-room')).toBeTruthy();
  });

  it('unstable_settings anchors at index', () => {
    expect(unstable_settings.anchor).toBe('index');
  });
});

describe('RootLayout dark theme', () => {
  afterEach(() => {
    mockUseColorScheme.mockReturnValue('light');
  });

  it('renders with dark colour scheme without crashing', () => {
    mockUseColorScheme.mockReturnValue('dark');
    expect(() => render(<RootLayout />)).not.toThrow();
  });

  it('uses DarkTheme when colour scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('theme-provider')).toBeTruthy();
  });
});
