import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/constants/theme', () => ({
  Colors: {
    light: { text: '#11181C', background: '#fff' },
    dark: { text: '#ECEDEE', background: '#151718' },
  },
}));

import { ThemedText } from '@/components/themed-text';

describe('ThemedText types', () => {
  it('renders with default type', () => {
    render(<ThemedText testID="text">Hello</ThemedText>);
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('renders with title type', () => {
    render(<ThemedText type="title" testID="text">Title</ThemedText>);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('renders with defaultSemiBold type', () => {
    render(<ThemedText type="defaultSemiBold" testID="text">Bold</ThemedText>);
    expect(screen.getByText('Bold')).toBeTruthy();
  });

  it('renders with subtitle type', () => {
    render(<ThemedText type="subtitle" testID="text">Subtitle</ThemedText>);
    expect(screen.getByText('Subtitle')).toBeTruthy();
  });

  it('renders with link type', () => {
    render(<ThemedText type="link" testID="text">Link</ThemedText>);
    expect(screen.getByText('Link')).toBeTruthy();
  });

  it('accepts custom lightColor and darkColor', () => {
    render(
      <ThemedText lightColor="#ff0000" darkColor="#00ff00" testID="text">
        Colored
      </ThemedText>,
    );
    expect(screen.getByText('Colored')).toBeTruthy();
  });
});
