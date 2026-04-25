import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@/components/ui/icon-symbol.ios', () => ({
  IconSymbol: () => null,
}));
const mockMaterialIcons = jest.fn((props: any) => {
  const { Text } = require('react-native');
  return <Text testID="material-icon">{props.name}</Text>;
});

jest.mock('@expo/vector-icons/MaterialIcons', () => (props: any) => mockMaterialIcons(props));

import { IconSymbol } from '@/components/ui/icon-symbol.tsx';
import { render, screen } from '@testing-library/react-native';

describe('IconSymbol (fallback)', () => {
  it('maps house.fill to home', () => {
    render(<IconSymbol name="house.fill" color="#000" />);
    expect(screen.getByTestId('material-icon')).toBeTruthy();
    expect(mockMaterialIcons).toHaveBeenCalledWith(expect.objectContaining({ name: 'home' }));
  });

  it('maps chevron.right to chevron-right with custom size', () => {
    render(<IconSymbol name="chevron.right" color="#111" size={18} />);
    expect(mockMaterialIcons).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'chevron-right', size: 18, color: '#111' })
    );
  });
});
