import { render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

// ── Mocks ────────────────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  Link: ({ children, href }: any) => {
    const { Pressable } = require('react-native');
    return <Pressable accessibilityRole="link" accessibilityLabel={href}>{children}</Pressable>;
  },
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: (_props: any, colorName: string) =>
    colorName === 'text' ? '#000000' : '#ffffff',
}));

// ── Subject ──────────────────────────────────────────────────────────────────
import ModalScreen from '@/app/modal';

// ── Tests ────────────────────────────────────────────────────────────────────
describe('ModalScreen', () => {
  it('renders without crashing', () => {
    render(<ModalScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders the modal title text', () => {
    render(<ModalScreen />);
    expect(screen.getByText('This is a modal')).toBeTruthy();
  });

  it('renders a link to go to the home screen', () => {
    render(<ModalScreen />);
    expect(screen.getByText('Go to home screen')).toBeTruthy();
  });

  it('link points to the root route', () => {
    render(<ModalScreen />);
    const link = screen.getByRole('link', { name: '/' });
    expect(link).toBeTruthy();
  });
});
