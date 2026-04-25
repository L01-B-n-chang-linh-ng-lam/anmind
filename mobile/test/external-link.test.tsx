import { describe, expect, it, jest } from '@jest/globals';

const mockOpenBrowserAsync = jest.fn(async () => undefined);
const mockLink = jest.fn(({ onPress, ...props }: any) => {
  const { Pressable } = require('react-native');
  return <Pressable testID="external-link" onPress={onPress} {...props} />;
});

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: (...args: any[]) => mockOpenBrowserAsync(...args),
  WebBrowserPresentationStyle: {
    AUTOMATIC: 'automatic',
  },
}));

jest.mock('expo-router', () => ({
  Link: (props: any) => mockLink(props),
}));

import { ExternalLink } from '@/components/external-link';
import { render, screen } from '@testing-library/react-native';

describe('ExternalLink', () => {
  it('renders a Link with target blank', () => {
    process.env.EXPO_OS = 'web';
    render(<ExternalLink href="https://example.com">Open</ExternalLink>);
    expect(screen.getByTestId('external-link')).toBeTruthy();
    expect(mockLink).toHaveBeenCalledWith(
      expect.objectContaining({
        href: 'https://example.com',
        target: '_blank',
      })
    );
  });

  it('prevents default and opens in-app browser on native', async () => {
    process.env.EXPO_OS = 'ios';
    mockOpenBrowserAsync.mockClear();
    render(<ExternalLink href="https://example.com">Open</ExternalLink>);

    const event = { preventDefault: jest.fn() } as any;
    const onPress = mockLink.mock.calls[mockLink.mock.calls.length - 1][0].onPress;
    await onPress(event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockOpenBrowserAsync).toHaveBeenCalledWith('https://example.com', {
      presentationStyle: 'automatic',
    });
  });
});
