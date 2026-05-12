import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

const mockReplace = jest.fn();
const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, back: jest.fn() }),
  Link: ({ children }: any) => children,
}));

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View> };
});

const mockLogin = jest.fn().mockResolvedValue(undefined);

jest.mock('@/store/authStore', () => ({
  useAuthStore: (sel?: any) => {
    const s = { login: mockLogin, logout: jest.fn(), isAuthenticated: false, user: null };
    return sel ? sel(s) : s;
  },
}));

import LoginScreen from '@/app/auth/login';

describe('LoginScreen flow', () => {
  beforeEach(() => { mockReplace.mockClear(); mockLogin.mockClear(); });

  it('successful login with credentials navigates to tabs', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'password123');
    await act(async () => {
      fireEvent.press(screen.getByTestId('login-btn'));
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/(tabs)'));
  });

  it('failed login shows error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Auth failed'));
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'wrong');
    await act(async () => {
      fireEvent.press(screen.getByTestId('login-btn'));
    });
    await waitFor(() => expect(screen.getByText(/Login failed/i)).toBeTruthy());
  });

  it('can toggle password visibility', () => {
    render(<LoginScreen />);
    // Eye icon button is the 3rd button (after email icon placeholder and password icon)
    const eyeBtn = screen.getAllByRole('button');
    // Just verify toggling doesn't throw
    expect(() => fireEvent.press(eyeBtn[eyeBtn.length - 1])).not.toThrow();
  });
});

import SignupScreen from '@/app/auth/signup';

describe('SignupScreen flow', () => {
  beforeEach(() => { mockReplace.mockClear(); mockLogin.mockClear(); });

  it('successful signup navigates to tabs', async () => {
    render(<SignupScreen />);
    fireEvent.changeText(screen.getByTestId('username-input'), 'newuser');
    fireEvent.changeText(screen.getByTestId('email-input'), 'new@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'password123');
    await act(async () => {
      fireEvent.press(screen.getByTestId('signup-btn'));
    });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/(tabs)'));
  });

  it('shows error when signup fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Signup failed'));
    render(<SignupScreen />);
    fireEvent.changeText(screen.getByTestId('username-input'), 'u');
    fireEvent.changeText(screen.getByTestId('email-input'), 'e@e.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'p');
    await act(async () => {
      fireEvent.press(screen.getByTestId('signup-btn'));
    });
    await waitFor(() => expect(screen.getByText(/Sign up failed/i)).toBeTruthy());
  });
});
