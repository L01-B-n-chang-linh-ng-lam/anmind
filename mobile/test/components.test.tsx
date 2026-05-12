import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: ({ children, style }: any) => <View style={style}>{children}</View> };
});

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

// ── BreathingOrb ──────────────────────────────────────────────────────────────
import BreathingOrb from '@/components/BreathingOrb';

describe('BreathingOrb', () => {
  it('renders without crashing', () => {
    render(<BreathingOrb />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders orb-container testID', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb-container')).toBeTruthy();
  });

  it('renders orb testID', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb')).toBeTruthy();
  });

  it('renders outer and inner glow rings', () => {
    render(<BreathingOrb />);
    expect(screen.getByTestId('orb-glow-outer')).toBeTruthy();
    expect(screen.getByTestId('orb-glow-inner')).toBeTruthy();
  });

  it('renders a custom label when provided', () => {
    render(<BreathingOrb label="Reset Now" />);
    expect(screen.getByText('Reset Now')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<BreathingOrb onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('accepts custom phaseDurations without crashing', () => {
    expect(() => render(<BreathingOrb phaseDurations={[2000, 1000, 2000]} />)).not.toThrow();
  });

  it('renders phase text initially', () => {
    render(<BreathingOrb />);
    expect(screen.getByText('Inhale...')).toBeTruthy();
  });
});

// ── MoodSelector ──────────────────────────────────────────────────────────────
import MoodSelector from '@/components/MoodSelector';
import type { MoodLabel } from '@/types';

describe('MoodSelector', () => {
  it('renders without crashing', () => {
    render(<MoodSelector selected={null} onSelect={jest.fn()} />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders all 5 mood options', () => {
    render(<MoodSelector selected={null} onSelect={jest.fn()} />);
    expect(screen.getByTestId('mood-stressed')).toBeTruthy();
    expect(screen.getByTestId('mood-overwhelmed')).toBeTruthy();
    expect(screen.getByTestId('mood-anxious')).toBeTruthy();
    expect(screen.getByTestId('mood-neutral')).toBeTruthy();
    expect(screen.getByTestId('mood-calm')).toBeTruthy();
  });

  it('calls onSelect with correct mood when pressed', () => {
    const onSelect = jest.fn();
    render(<MoodSelector selected={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('mood-calm'));
    expect(onSelect).toHaveBeenCalledWith('Calm');
  });

  it('calls onSelect with Stressed when pressed', () => {
    const onSelect = jest.fn();
    render(<MoodSelector selected={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('mood-stressed'));
    expect(onSelect).toHaveBeenCalledWith('Stressed');
  });

  it('renders emojis for each mood', () => {
    render(<MoodSelector selected={null} onSelect={jest.fn()} />);
    expect(screen.getByText('😊')).toBeTruthy(); // Calm
    expect(screen.getByText('😣')).toBeTruthy(); // Stressed
  });

  it('renders selected mood with different accessibility state', () => {
    render(<MoodSelector selected={'Calm' as MoodLabel} onSelect={jest.fn()} />);
    expect(screen.getByTestId('mood-calm')).toBeTruthy();
  });
});

// ── DurationSelector ──────────────────────────────────────────────────────────
import DurationSelector from '@/components/DurationSelector';

describe('DurationSelector', () => {
  it('renders without crashing', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders all 4 duration options', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    expect(screen.getByTestId('duration-3')).toBeTruthy();
    expect(screen.getByTestId('duration-5')).toBeTruthy();
    expect(screen.getByTestId('duration-7')).toBeTruthy();
    expect(screen.getByTestId('duration-10')).toBeTruthy();
  });

  it('calls onSelect with correct value when pressed', () => {
    const onSelect = jest.fn();
    render(<DurationSelector selected={5} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('duration-7'));
    expect(onSelect).toHaveBeenCalledWith(7);
  });

  it('renders labels for each duration', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    expect(screen.getByText('3 min')).toBeTruthy();
    expect(screen.getByText('5 min')).toBeTruthy();
    expect(screen.getByText('10 min')).toBeTruthy();
  });
});

// ── SessionCard ───────────────────────────────────────────────────────────────
import SessionCard from '@/components/SessionCard';
import type { ResetSession } from '@/types';

describe('SessionCard', () => {
  const session: ResetSession = {
    id: 'sess-1',
    durationMinutes: 5,
    startedAt: '2026-05-01T10:00:00Z',
    endedAt: '2026-05-01T10:05:00Z',
    completed: true,
    scoreBefore: 2,
    scoreAfter: 4,
  };

  it('renders without crashing', () => {
    render(<SessionCard session={session} />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders duration', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText('5 min')).toBeTruthy();
  });

  it('renders positive mood improvement', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText('+2 mood')).toBeTruthy();
  });

  it('renders negative mood improvement correctly', () => {
    const negSession = { ...session, scoreBefore: 4, scoreAfter: 2 };
    render(<SessionCard session={negSession} />);
    expect(screen.getByText('-2 mood')).toBeTruthy();
  });

  it('renders Done badge for completed session', () => {
    render(<SessionCard session={session} />);
    expect(screen.getByText('Done')).toBeTruthy();
  });

  it('renders Incomplete badge for incomplete session', () => {
    const incomplete = { ...session, completed: false };
    render(<SessionCard session={incomplete} />);
    expect(screen.getByText('Incomplete')).toBeTruthy();
  });

  it('does not render improvement when scores missing', () => {
    const noScores = { ...session, scoreBefore: undefined, scoreAfter: undefined };
    render(<SessionCard session={noScores} />);
    expect(() => screen.getByText('+0 mood')).toThrow();
  });
});

// ── GradientBackground ────────────────────────────────────────────────────────
import GradientBackground from '@/components/GradientBackground';
import { Text } from 'react-native';

describe('GradientBackground', () => {
  it('renders without crashing', () => {
    render(<GradientBackground><Text>Hello</Text></GradientBackground>);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders children', () => {
    render(<GradientBackground><Text>Child Content</Text></GradientBackground>);
    expect(screen.getByText('Child Content')).toBeTruthy();
  });
});
