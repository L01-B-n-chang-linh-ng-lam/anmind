import { describe, expect, it, jest } from '@jest/globals';

const mockUseColorScheme = jest.fn(() => 'light');

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children }: any) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, style, testID }: any) => {
    const { View } = require('react-native');
    return (
      <View style={style} testID={testID}>
        {children}
      </View>
    );
  },
}));

const mockIconSymbol = jest.fn(({ style }: any) => {
  const { View } = require('react-native');
  return <View testID="icon-symbol" style={style} />;
});

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: (props: any) => mockIconSymbol(props),
}));

import { Collapsible } from '@/components/ui/collapsible';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Collapsible', () => {
  it('renders title and starts closed', () => {
    render(
      <Collapsible title="Details">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    expect(screen.getByText('Details')).toBeTruthy();
    expect(screen.queryByText('Hidden Content')).toBeNull();
  });

  it('opens and closes content when pressed', () => {
    render(
      <Collapsible title="Details">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    fireEvent.press(screen.getByText('Details'));
    expect(screen.getByText('Hidden Content')).toBeTruthy();

    fireEvent.press(screen.getByText('Details'));
    expect(screen.queryByText('Hidden Content')).toBeNull();
  });

  it('rotates chevron when expanded', () => {
    render(
      <Collapsible title="Details">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    const beforeStyle = mockIconSymbol.mock.calls[0][0].style;
    expect(beforeStyle.transform).toEqual([{ rotate: '0deg' }]);

    fireEvent.press(screen.getByText('Details'));

    const afterStyle = mockIconSymbol.mock.calls[mockIconSymbol.mock.calls.length - 1][0].style;
    expect(afterStyle.transform).toEqual([{ rotate: '90deg' }]);
  });

  it('uses dark icon color in dark mode', () => {
    mockUseColorScheme.mockReturnValue('dark');
    render(
      <Collapsible title="Details">
        <Text>Hidden Content</Text>
      </Collapsible>
    );

    const props = mockIconSymbol.mock.calls[mockIconSymbol.mock.calls.length - 1][0];
    expect(props.color).toBeTruthy();
  });
});
