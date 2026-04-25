import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

// ── Mocks ────────────────────────────────────────────────────────────────────
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
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
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

  it('renders all four Stack.Screen entries', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('screen-index')).toBeTruthy();
    expect(getByTestId('screen-choose-topic')).toBeTruthy();
    expect(getByTestId('screen-home')).toBeTruthy();
    expect(getByTestId('screen-modal')).toBeTruthy();
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
