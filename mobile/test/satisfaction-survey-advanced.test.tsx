import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return { Ionicons: ({ name, testID }: any) => <Text testID={testID ?? `icon-${name}`}>{name}</Text> };
});

jest.mock('@/services/tracking.service', () => ({
  trackSatisfactionSubmitted: jest.fn(),
}));

import SatisfactionSurvey from '@/components/SatisfactionSurvey';

describe('SatisfactionSurvey advanced', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders with visible=true', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    expect(screen.getByText(/How satisfied are you/i)).toBeTruthy();
  });

  it('renders submit button', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('submit does nothing when score is 0', () => {
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    fireEvent.press(screen.getByText('Submit'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('selecting a star updates score', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    const stars = screen.getAllByRole('button');
    fireEvent.press(stars[0]);
    expect(screen.queryAllByTestId('icon-star').length).toBeGreaterThan(0);
  });

  it('selecting star 3 shows 3 filled stars', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[2]);
    expect(screen.getAllByTestId('icon-star').length).toBe(3);
  });

  it('submit with score calls trackSatisfactionSubmitted', () => {
    const { trackSatisfactionSubmitted } = require('@/services/tracking.service');
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[4]);
    fireEvent.press(screen.getByText('Submit'));
    expect(trackSatisfactionSubmitted).toHaveBeenCalledWith(5, undefined);
    expect(onClose).toHaveBeenCalled();
  });

  it('submit with feedback passes trimmed feedback', () => {
    const { trackSatisfactionSubmitted } = require('@/services/tracking.service');
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[2]);
    fireEvent.changeText(screen.getByPlaceholderText('Any feedback? (optional)'), '  Great app!  ');
    fireEvent.press(screen.getByText('Submit'));
    expect(trackSatisfactionSubmitted).toHaveBeenCalledWith(3, 'Great app!');
    expect(onClose).toHaveBeenCalled();
  });

  it('submit resets score and feedback', () => {
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[1]);
    fireEvent.changeText(screen.getByPlaceholderText('Any feedback? (optional)'), 'Nice');
    fireEvent.press(screen.getByText('Submit'));
    expect(onClose).toHaveBeenCalled();
  });

  it('skip button calls onClose', () => {
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    const skipButtons = screen.getAllByRole('button');
    const skipBtn = skipButtons[skipButtons.length - 1];
    fireEvent.press(skipBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('skip resets score and feedback', () => {
    const onClose = jest.fn();
    render(<SatisfactionSurvey visible={true} onClose={onClose} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    const skipBtn = buttons[buttons.length - 1];
    fireEvent.press(skipBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('selecting star 1 fills only 1 star', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(screen.getAllByTestId('icon-star').length).toBe(1);
    expect(screen.getAllByTestId('icon-star-outline').length).toBe(4);
  });

  it('can change star selection', () => {
    render(<SatisfactionSurvey visible={true} onClose={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[1]);
    expect(screen.getAllByTestId('icon-star').length).toBe(2);
    fireEvent.press(buttons[4]);
    expect(screen.getAllByTestId('icon-star').length).toBe(5);
  });
});
