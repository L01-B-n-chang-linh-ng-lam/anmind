import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

// ── Mocks ────────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: mockReplace }),
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
import ChooseTopicScreen, { CARDS } from '@/app/choose-topic';

// ── Tests ────────────────────────────────────────────────────────────────────
describe('ChooseTopicScreen', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('renders without crashing', () => {
    render(<ChooseTopicScreen />);
    expect(screen.toJSON()).toBeTruthy();
  });

  it('renders the ScrollView wrapper', () => {
    render(<ChooseTopicScreen />);
    expect(screen.getByTestId('choose-topic-scroll')).toBeTruthy();
  });

  it('renders exactly 6 topic card pressables', () => {
    render(<ChooseTopicScreen />);
    expect(screen.getAllByRole('button')).toHaveLength(CARDS.length);
  });

  it.each(CARDS)('renders "$label" card with correct accessibilityLabel', ({ label }) => {
    render(<ChooseTopicScreen />);
    expect(screen.getByRole('button', { name: label })).toBeTruthy();
  });

  it.each(CARDS)('pressing "$label" navigates to /home', ({ label }) => {
    render(<ChooseTopicScreen />);
    fireEvent.press(screen.getByRole('button', { name: label }));
    expect(mockReplace).toHaveBeenCalledWith('/home');
    mockReplace.mockClear();
  });

  it('has a white background on the scroll container', () => {
    const { toJSON } = render(<ChooseTopicScreen />);
    const tree = toJSON() as any;
    const style = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style)
      : tree.props.style;
    expect(style.backgroundColor).toBe('#ffffff');
  });

  it('card testIDs are derived from the label', () => {
    render(<ChooseTopicScreen />);
    expect(screen.getByTestId('card-reduce-stress')).toBeTruthy();
    expect(screen.getByTestId('card-improve-performance')).toBeTruthy();
    expect(screen.getByTestId('card-increase-happiness')).toBeTruthy();
    expect(screen.getByTestId('card-reduce-anxiety')).toBeTruthy();
    expect(screen.getByTestId('card-personal-growth')).toBeTruthy();
    expect(screen.getByTestId('card-better-sleep')).toBeTruthy();
  });

  it('CARDS constant has exactly 6 entries', () => {
    expect(CARDS).toHaveLength(6);
  });

  it('CARDS constant contains all expected labels', () => {
    const labels = CARDS.map((c) => c.label);
    expect(labels).toContain('Reduce Stress');
    expect(labels).toContain('Improve Performance');
    expect(labels).toContain('Increase Happiness');
    expect(labels).toContain('Reduce Anxiety');
    expect(labels).toContain('Personal Growth');
    expect(labels).toContain('Better Sleep');
  });
});
