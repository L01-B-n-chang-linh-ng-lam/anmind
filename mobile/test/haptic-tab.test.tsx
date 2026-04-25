import { describe, expect, it, jest } from '@jest/globals';

const mockImpactAsync = jest.fn(async () => undefined);
const mockPlatformPressable = jest.fn(({ onPressIn, ...props }: any) => {
  const { Pressable } = require('react-native');
  return <Pressable testID="platform-pressable" onPressIn={onPressIn} {...props} />;
});

jest.mock('expo-haptics', () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),
  ImpactFeedbackStyle: { Light: 'light' },
}));

jest.mock('@react-navigation/elements', () => ({
  PlatformPressable: (props: any) => mockPlatformPressable(props),
}));

import { HapticTab } from '@/components/haptic-tab';
import { fireEvent, render, screen } from '@testing-library/react-native';

describe('HapticTab', () => {
  it('triggers haptic feedback on ios and forwards onPressIn', () => {
    process.env.EXPO_OS = 'ios';
    mockImpactAsync.mockClear();
    const onPressIn = jest.fn();

    render(<HapticTab onPressIn={onPressIn} /> as any);
    fireEvent(screen.getByTestId('platform-pressable'), 'pressIn', { nativeEvent: {} });

    expect(mockImpactAsync).toHaveBeenCalledWith('light');
    expect(onPressIn).toHaveBeenCalledTimes(1);
  });

  it('forwards onPressIn callback', () => {
    process.env.EXPO_OS = 'android';
    mockImpactAsync.mockClear();
    const onPressIn = jest.fn();

    render(<HapticTab onPressIn={onPressIn} /> as any);
    fireEvent(screen.getByTestId('platform-pressable'), 'pressIn', { nativeEvent: {} });

    expect(onPressIn).toHaveBeenCalledTimes(1);
  });
});
