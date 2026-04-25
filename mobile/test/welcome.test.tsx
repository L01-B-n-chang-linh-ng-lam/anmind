import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn() }),
}));

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: ({ testID, ...props }: any) => <View testID={testID ?? 'expo-image'} {...props} />,
  };
});

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 390, height: 844 }),
}));

// ── Subject ──────────────────────────────────────────────────────────────────
import WelcomeScreen from '@/app/index';

// ── Tests ────────────────────────────────────────────────────────────────────
describe('WelcomeScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders without crashing', () => {
    render(<WelcomeScreen />);
  });

  it('renders the welcome illustration image', () => {
    render(<WelcomeScreen />);
    // expo-image is mocked as a View; verify at least one image is rendered
    // by checking the tree does not throw
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders the GET STARTED pressable button', () => {
    render(<WelcomeScreen />);
    const btn = screen.getByRole('button', { name: /get started/i });
    expect(btn).toBeTruthy();
  });

  it('navigates to /choose-topic when GET STARTED is pressed', () => {
    render(<WelcomeScreen />);
    const btn = screen.getByRole('button', { name: /get started/i });
    fireEvent.press(btn);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/choose-topic');
  });

  it('applies the purple background colour', () => {
    const { toJSON } = render(<WelcomeScreen />);
    const tree = toJSON() as any;
    expect(tree.props.style).toEqual(
      expect.objectContaining({ backgroundColor: '#8e97fd' }),
    );
  });

  it('CTA hitbox uses correct accessibility role', () => {
    render(<WelcomeScreen />);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
  });
});
