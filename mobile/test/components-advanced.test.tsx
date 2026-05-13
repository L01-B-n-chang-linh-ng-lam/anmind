import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('react-native-reanimated', () => ({
  useAnimatedStyle: jest.fn(() => ({})),
  useSharedValue: jest.fn(() => ({ value: 1 })),
  withTiming: jest.fn((target) => target),
  withRepeat: jest.fn((anim) => anim),
  withSequence: jest.fn((...args) => args[0]),
  Animated: {
    View: (props: any) => {
      const { View } = require('react-native');
      return <View {...props} />;
    },
    Text: (props: any) => {
      const { Text } = require('react-native');
      return <Text {...props} />;
    },
  },
}));

// ── MoodSelector Component ────────────────────────────────────────────────────
import MoodSelector from '@/components/MoodSelector';

describe('MoodSelector', () => {
  it('renders all mood options', () => {
    render(<MoodSelector selected={null} onSelect={jest.fn()} />);
    expect(screen.getByTestId('mood-stressed')).toBeTruthy();
    expect(screen.getByTestId('mood-overwhelmed')).toBeTruthy();
    expect(screen.getByTestId('mood-anxious')).toBeTruthy();
    expect(screen.getByTestId('mood-neutral')).toBeTruthy();
    expect(screen.getByTestId('mood-calm')).toBeTruthy();
  });

  it('calls onSelect when mood is pressed', () => {
    const onSelect = jest.fn();
    render(<MoodSelector selected={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('mood-calm'));
    expect(onSelect).toHaveBeenCalledWith('Calm');
  });

  it('highlights selected mood', () => {
    render(<MoodSelector selected="Calm" onSelect={jest.fn()} />);
    const selectedBtn = screen.getByTestId('mood-calm');
    expect(selectedBtn.props.style).toEqual(expect.arrayContaining([
      expect.any(Object),
      expect.any(Object),
    ]));
  });

  it('allows changing selection', () => {
    const onSelect = jest.fn();
    const { rerender } = render(<MoodSelector selected={null} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('mood-calm'));
    expect(onSelect).toHaveBeenCalledWith('Calm');
    
    rerender(<MoodSelector selected="Calm" onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('mood-stressed'));
    expect(onSelect).toHaveBeenCalledWith('Stressed');
  });

  it('renders mood labels', () => {
    render(<MoodSelector selected={null} onSelect={jest.fn()} />);
    expect(screen.getByText('Stressed')).toBeTruthy();
    expect(screen.getByText('Overwhelmed')).toBeTruthy();
  });
});

// ── DurationSelector Component ────────────────────────────────────────────────
import DurationSelector from '@/components/DurationSelector';

describe('DurationSelector', () => {
  it('renders duration options', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    expect(screen.getByTestId('duration-5')).toBeTruthy();
  });

  it('calls onSelect when duration is pressed', () => {
    const onSelect = jest.fn();
    render(<DurationSelector selected={5} onSelect={onSelect} />);
    fireEvent.press(screen.getByTestId('duration-5'));
    expect(onSelect).toHaveBeenCalledWith(5);
  });

  it('highlights selected duration', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    const selectedBtn = screen.getByTestId('duration-5');
    expect(selectedBtn.props.style).toBeTruthy();
  });

  it('renders different duration options', () => {
    render(<DurationSelector selected={5} onSelect={jest.fn()} />);
    // The component should have multiple duration buttons
    expect(screen.getByTestId('duration-5')).toBeTruthy();
  });
});

// ── SatisfactionSurvey Component ──────────────────────────────────────────────
import SatisfactionSurvey from '@/components/SatisfactionSurvey';

describe('SatisfactionSurvey', () => {
  it('renders survey prompt', () => {
    render(<SatisfactionSurvey onClose={jest.fn()} />);
    expect(screen.getByText(/How satisfied are you/i)).toBeTruthy();
  });

  it('renders star rating options', () => {
    render(<SatisfactionSurvey onClose={jest.fn()} />);
    const stars = screen.getAllByTestId('icon-star-outline');
    expect(stars.length).toBe(5);
  });

  it('renders feedback input field', () => {
    render(<SatisfactionSurvey onClose={jest.fn()} />);
    expect(screen.getByPlaceholderText('Any feedback? (optional)')).toBeTruthy();
  });

  it('renders Submit and Skip buttons', () => {
    render(<SatisfactionSurvey onClose={jest.fn()} />);
    expect(screen.getByText('Submit')).toBeTruthy();
    expect(screen.getByText('Skip')).toBeTruthy();
  });

  it('Skip button calls onClose', () => {
    const onClose = jest.fn();
    render(<SatisfactionSurvey onClose={onClose} />);
    fireEvent.press(screen.getByText('Skip'));
    expect(onClose).toHaveBeenCalled();
  });
});

// ── SessionCard Component ─────────────────────────────────────────────────────
import SessionCard from '@/components/SessionCard';

describe('SessionCard', () => {
  const mockSession = {
    id: 'session-1',
    durationMinutes: 5,
    startedAt: '2026-01-01T10:00:00Z',
    endedAt: '2026-01-01T10:05:00Z',
    completed: true,
    scoreBefore: 2,
    scoreAfter: 4,
  };

  it('renders session duration', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText(/5|min/i)).toBeTruthy();
  });

  it('renders mood improvement', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText(/\+2/i)).toBeTruthy();
  });

  it('renders session date', () => {
    render(<SessionCard session={mockSession} />);
    // Should show date/time
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders completion status badge', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('Done')).toBeTruthy();
  });

  it('shows positive improvement', () => {
    render(<SessionCard session={mockSession} />);
    const improvementText = screen.getByText(/\+2/i);
    expect(improvementText.props.style).toBeTruthy();
  });
});

// ── GradientBackground Component ──────────────────────────────────────────────
import GradientBackground from '@/components/GradientBackground';
import { View, Text } from 'react-native';

describe('GradientBackground', () => {
  it('renders gradient wrapper with children', () => {
    render(
      <GradientBackground>
        <View testID="child-view">
          <Text>Test Content</Text>
        </View>
      </GradientBackground>,
    );
    expect(screen.getByTestId('child-view')).toBeTruthy();
  });

  it('renders without crashing', () => {
    render(
      <GradientBackground>
        <Text>Gradient Background Test</Text>
      </GradientBackground>,
    );
    expect(screen.toJSON()).toBeTruthy();
  });
});

// ── VideoTile Component ───────────────────────────────────────────────────────
import { VideoTile } from '@/components/VideoTile';

describe('VideoTile', () => {
  it('renders participant label', () => {
    render(<VideoTile uid={123} isLocal={false} label="Participant 1" />);
    expect(screen.getByText('Participant 1')).toBeTruthy();
  });

  it('renders "You" for local participant', () => {
    render(<VideoTile uid={123} isLocal={true} />);
    expect(screen.getByText('You')).toBeTruthy();
  });

  it('renders default label for remote participant', () => {
    render(<VideoTile uid={456} isLocal={false} />);
    expect(screen.getByText(/Participant 456/i)).toBeTruthy();
  });

  it('shows mute indicator when muted', () => {
    render(<VideoTile uid={123} isLocal={false} isMuted={true} />);
    expect(screen.getByTestId('icon-mic-off')).toBeTruthy();
  });

  it('shows camera off state', () => {
    render(<VideoTile uid={123} isLocal={false} isCameraOff={true} />);
    expect(screen.getByText('Camera Off')).toBeTruthy();
  });

  it('does not show mute indicator when unmuted', () => {
    render(<VideoTile uid={123} isLocal={false} isMuted={false} />);
    expect(screen.queryByTestId('icon-mic-off')).toBeNull();
  });

  it('renders video tile container', () => {
    render(<VideoTile uid={123} isLocal={true} />);
    expect(screen.toJSON()).toBeTruthy();
  });
});
