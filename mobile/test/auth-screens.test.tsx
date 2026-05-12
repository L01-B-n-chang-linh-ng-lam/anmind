import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: mockBack }),
  Link: ({ children, href, asChild }: any) => children,
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel?: any) => {
    const s = {
      login: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
      isAuthenticated: false,
      user: null,
    };
    return sel ? sel(s) : s;
  },
}));

// ── Login Screen ──────────────────────────────────────────────────────────────
import LoginScreen from '@/app/auth/login';

describe('LoginScreen', () => {
  beforeEach(() => { mockReplace.mockClear(); mockPush.mockClear(); });

  it('renders without crashing', () => {
    render(<LoginScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders title', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/Welcome/i)).toBeTruthy();
  });

  it('renders email input', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('email-input')).toBeTruthy();
  });

  it('renders password input', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('password-input')).toBeTruthy();
  });

  it('renders Log In button', () => {
    render(<LoginScreen />);
    expect(screen.getByTestId('login-btn')).toBeTruthy();
  });

  it('shows error when submitting empty fields', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByTestId('login-btn'));
    expect(screen.getByText(/Please enter your email and password/i)).toBeTruthy();
  });

  it('allows typing into email field', () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    expect(screen.getByDisplayValue('test@example.com')).toBeTruthy();
  });

  it('allows typing into password field', () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId('password-input'), 'secret');
    expect(screen.getByDisplayValue('secret')).toBeTruthy();
  });
});

// ── Signup Screen ─────────────────────────────────────────────────────────────
import SignupScreen from '@/app/auth/signup';

describe('SignupScreen', () => {
  beforeEach(() => { mockReplace.mockClear(); });

  it('renders without crashing', () => {
    render(<SignupScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Create Account title', () => {
    render(<SignupScreen />);
    expect(screen.getByText(/Create/i)).toBeTruthy();
  });

  it('renders username input', () => {
    render(<SignupScreen />);
    expect(screen.getByTestId('username-input')).toBeTruthy();
  });

  it('renders email input', () => {
    render(<SignupScreen />);
    expect(screen.getByTestId('email-input')).toBeTruthy();
  });

  it('renders Sign Up button', () => {
    render(<SignupScreen />);
    expect(screen.getByTestId('signup-btn')).toBeTruthy();
  });

  it('shows error when submitting empty fields', () => {
    render(<SignupScreen />);
    fireEvent.press(screen.getByTestId('signup-btn'));
    expect(screen.getByText(/Please fill in all fields/i)).toBeTruthy();
  });
});

// ── Forgot Password Screen ────────────────────────────────────────────────────
import ForgotPasswordScreen from '@/app/auth/forgot-password';

describe('ForgotPasswordScreen', () => {
  beforeEach(() => { mockBack.mockClear(); });

  it('renders without crashing', () => {
    render(<ForgotPasswordScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders Forgot Password title', () => {
    render(<ForgotPasswordScreen />);
    expect(screen.getByText(/Forgot/i)).toBeTruthy();
  });

  it('renders email input', () => {
    render(<ForgotPasswordScreen />);
    expect(screen.getByTestId('email-input')).toBeTruthy();
  });

  it('renders Send Reset Link button', () => {
    render(<ForgotPasswordScreen />);
    expect(screen.getByTestId('send-reset-btn')).toBeTruthy();
  });

  it('button is disabled when email is empty', () => {
    render(<ForgotPasswordScreen />);
    const btn = screen.getByTestId('send-reset-btn');
    expect(btn.props.accessibilityState?.disabled).toBeTruthy();
  });

  it('shows success message after submission', () => {
    render(<ForgotPasswordScreen />);
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    fireEvent.press(screen.getByTestId('send-reset-btn'));
    expect(screen.getByText(/Reset link sent/i)).toBeTruthy();
  });
});
