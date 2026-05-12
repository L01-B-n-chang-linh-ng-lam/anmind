import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text>,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ── Subject ──────────────────────────────────────────────────────────────────
import HomeScreen, { ACTION_ITEMS, NAV_ITEMS } from '@/app/(tabs)/index';

// ── Tests ────────────────────────────────────────────────────────────────────
describe('HomeScreen', () => {
  it('renders without crashing', () => {
    render(<HomeScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders the root screen with correct testID', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('has a dark navy background', () => {
    const { toJSON } = render(<HomeScreen />);
    const root = toJSON() as any;
    expect(root.props.style).toEqual(
      expect.objectContaining({ backgroundColor: '#0B0F1A' }),
    );
  });

  describe('header', () => {
    it('renders the header container', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('home-header')).toBeTruthy();
    });

    it('renders the feeling question title', () => {
      render(<HomeScreen />);
      expect(screen.getByText(/how are you feeling/i)).toBeTruthy();
    });

    it('renders the check-in subtitle', () => {
      render(<HomeScreen />);
      expect(screen.getByText(/take a moment to check in with yourself/i)).toBeTruthy();
    });
  });

  describe('breathing orb', () => {
    it('renders the orb itself', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('orb')).toBeTruthy();
    });

    it('renders the outer glow ring', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('orb-glow-outer')).toBeTruthy();
    });

    it('renders the inner glow ring', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('orb-glow-inner')).toBeTruthy();
    });

    it('tapping orb navigates to reset tab', () => {
      render(<HomeScreen />);
      const orbPressable = screen.getByTestId('orb-container-pressable');
      fireEvent.press(orbPressable);
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/reset');
    });
  });

  describe('ambient side glows', () => {
    it('renders the left ambient glow', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('ambient-left')).toBeTruthy();
    });

    it('renders the right ambient glow', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('ambient-right')).toBeTruthy();
    });
  });

  describe('action cards', () => {
    it('renders the action-cards container', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('action-cards')).toBeTruthy();
    });

    it('renders exactly 2 action cards', () => {
      render(<HomeScreen />);
      const cards = screen.getAllByRole('button', { name: /join meditation|view progress/i });
      expect(cards).toHaveLength(2);
    });

    it('renders the "Join Meditation Station" card', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('action-meditation')).toBeTruthy();
      expect(screen.getByText('Join Meditation Station')).toBeTruthy();
      expect(screen.getByText('Join 4.2k others breathing now')).toBeTruthy();
    });

    it('renders the "View Progress" card', () => {
      render(<HomeScreen />);
      expect(screen.getByTestId('action-progress')).toBeTruthy();
      expect(screen.getByText('View Progress')).toBeTruthy();
      expect(screen.getByText('7-day streak continuing')).toBeTruthy();
    });

    it('pressing meditation card navigates to community tab', () => {
      render(<HomeScreen />);
      fireEvent.press(screen.getByTestId('action-meditation'));
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/community');
    });

    it('pressing progress card navigates to progress screen', () => {
      render(<HomeScreen />);
      fireEvent.press(screen.getByTestId('action-progress'));
      expect(mockPush).toHaveBeenCalledWith('/progress');
    });

    it.each(ACTION_ITEMS)('$title has correct accessibilityLabel', ({ title }) => {
      render(<HomeScreen />);
      expect(screen.getByRole('button', { name: title })).toBeTruthy();
    });
  });

  describe('NAV_ITEMS constant', () => {
    it('has exactly 4 items', () => {
      expect(NAV_ITEMS).toHaveLength(4);
    });

    it('Home is the only active item', () => {
      const activeItems = NAV_ITEMS.filter((i) => i.active);
      expect(activeItems).toHaveLength(1);
      expect(activeItems[0].label).toBe('Home');
    });
  });

  describe('ACTION_ITEMS constant', () => {
    it('has exactly 2 items', () => {
      expect(ACTION_ITEMS).toHaveLength(2);
    });

    it('each item has required fields', () => {
      ACTION_ITEMS.forEach(({ testID, title, subtitle, icon }) => {
        expect(testID).toBeTruthy();
        expect(title).toBeTruthy();
        expect(subtitle).toBeTruthy();
        expect(icon).toBeTruthy();
      });
    });
  });

  describe('animation setup', () => {
    it('mounts without animation errors', () => {
      expect(() => render(<HomeScreen />)).not.toThrow();
    });
  });
});
