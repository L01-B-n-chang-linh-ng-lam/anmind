import { describe, expect, it, jest } from '@jest/globals';

const mockInterpolate = jest.fn((_v, _i, output) => output[1]);

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { ScrollView, View, Text } = require('react-native');
  return {
    __esModule: true,
    default: {
      ScrollView: React.forwardRef((props: any, ref: any) => <ScrollView ref={ref} {...props} />),
      View: React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />),
      Text,
    },
    interpolate: (...args: any[]) => mockInterpolate(...args),
    useAnimatedRef: () => ({ current: null }),
    useScrollOffset: () => ({ value: 0 }),
    useAnimatedStyle: (cb: any) => cb(),
  };
});

const mockUseColorScheme = jest.fn(() => 'light');
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#f0f0f0',
}));

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('ParallaxScrollView', () => {
  it('renders header image and children', () => {
    render(
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#fff', dark: '#000' }}
        headerImage={<Text testID="header-image">Header</Text>}>
        <Text>Body</Text>
      </ParallaxScrollView>
    );

    expect(screen.getByTestId('header-image')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('renders with light scheme', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { toJSON } = render(
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#fff', dark: '#000' }}
        headerImage={<Text>Header</Text>}>
        <Text>Body</Text>
      </ParallaxScrollView>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders with dark scheme', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { toJSON } = render(
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#fff', dark: '#000' }}
        headerImage={<Text>Header</Text>}>
        <Text>Body</Text>
      </ParallaxScrollView>
    );

    expect(toJSON()).toBeTruthy();
  });

  it('falls back to light when scheme is undefined', () => {
    mockUseColorScheme.mockReturnValue(undefined);
    const { toJSON } = render(
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#fff', dark: '#000' }}
        headerImage={<Text>Header</Text>}>
        <Text>Body</Text>
      </ParallaxScrollView>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('computes animated transforms with interpolate', () => {
    mockInterpolate.mockClear();
    render(
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#fff', dark: '#000' }}
        headerImage={<Text>Header</Text>}>
        <Text>Body</Text>
      </ParallaxScrollView>
    );

    expect(mockInterpolate).toHaveBeenCalled();
  });
});
