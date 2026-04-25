import { describe, expect, it, jest } from '@jest/globals';

const mockSymbolView = jest.fn((props: any) => {
  const { View } = require('react-native');
  return <View testID="symbol-view" {...props} />;
});

jest.mock('expo-symbols', () => ({
  SymbolView: (props: any) => mockSymbolView(props),
}));

import { IconSymbol } from '@/components/ui/icon-symbol.ios';
import { render, screen } from '@testing-library/react-native';

describe('IconSymbol iOS', () => {
  it('renders SymbolView with size-based style and defaults', () => {
    render(<IconSymbol name="house.fill" color="#fff" size={30} />);
    expect(screen.getByTestId('symbol-view')).toBeTruthy();
    expect(mockSymbolView).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'house.fill',
        tintColor: '#fff',
        weight: 'regular',
      })
    );
  });

  it('applies custom weight and style', () => {
    render(<IconSymbol name="paperplane.fill" color="#123" weight="bold" style={{ opacity: 0.5 }} />);
    expect(mockSymbolView).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'paperplane.fill',
        weight: 'bold',
      })
    );
  });
});
