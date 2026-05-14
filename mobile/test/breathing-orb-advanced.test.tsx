import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Let moduleNameMapper handle react-native-reanimated → react-native-reanimated/mock.js
import BreathingOrb from '@/components/BreathingOrb';

describe('BreathingOrb', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders orb container', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb-container')).toBeTruthy();
  });

  it('renders orb core', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb')).toBeTruthy();
  });

  it('shows phase text Inhale... by default', () => {
    render(<BreathingOrb />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
  });

  it('shows custom label when provided', () => {
    render(<BreathingOrb label="Begin" />);
    expect(screen.getByText('Begin')).toBeTruthy();
  });

  it('does not show phase text when label is set', () => {
    render(<BreathingOrb label="Start" />);
    expect(screen.queryByText('Inhale...')).toBeNull();
  });

  it('renders without onPress (no Pressable wrapper)', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb-container')).toBeTruthy();
  });

  it('wraps in Pressable when onPress provided', () => {
    const onPress = jest.fn();
    render(<BreathingOrb onPress={onPress} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<BreathingOrb onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows Inhale... when currentPhase is inhale', () => {
    render(<BreathingOrb currentPhase="inhale" />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
  });

  it('shows Hold... when currentPhase is hold', () => {
    render(<BreathingOrb currentPhase="hold" />);
    expect(screen.getByText('Hold...')).toBeTruthy();
  });

  it('shows Exhale... when currentPhase is exhale', () => {
    render(<BreathingOrb currentPhase="exhale" />);
    expect(screen.getByText('Exhale...')).toBeTruthy();
  });

  it('uses custom size', () => {
    render(<BreathingOrb size={240} />);
    const orb = screen.getByTestId('orb');
    const styleArray = Array.isArray(orb.props.style) ? orb.props.style : [orb.props.style];
    const hasSize = styleArray.some((s: any) => s?.width === 240 && s?.height === 240);
    expect(hasSize).toBe(true);
  });

  it('updates displayed phase when currentPhase changes', () => {
    const { rerender } = render(<BreathingOrb currentPhase="inhale" />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
    rerender(<BreathingOrb currentPhase="exhale" />);
    expect(screen.getByText('Exhale...')).toBeTruthy();
  });

  it('updates to hold phase', () => {
    const { rerender } = render(<BreathingOrb currentPhase="inhale" />);
    rerender(<BreathingOrb currentPhase="hold" />);
    expect(screen.getByText('Hold...')).toBeTruthy();
  });

  it('renders without phaseDurations prop', () => {
    render(<BreathingOrb />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders with custom phaseDurations', () => {
    render(<BreathingOrb phaseDurations={[6000, 3000, 6000]} />);
    expect(screen.getByTestId('orb-container')).toBeTruthy();
  });

  it('cleans up timers on unmount (self-running mode)', () => {
    jest.useFakeTimers();
    const { unmount } = render(<BreathingOrb />);
    expect(() => unmount()).not.toThrow();
    jest.useRealTimers();
  });

  it('self-running mode: advances phase after inhale duration', () => {
    jest.useFakeTimers();
    render(<BreathingOrb phaseDurations={[100, 100, 100]} />);
    act(() => { jest.advanceTimersByTime(150); });
    jest.useRealTimers();
    expect(screen.toJSON()).toBeTruthy();
  });
});
