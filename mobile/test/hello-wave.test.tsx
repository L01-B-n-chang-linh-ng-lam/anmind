import { describe, expect, it, jest } from '@jest/globals';

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: {
      Text: React.forwardRef((props: any, ref: any) => <Text ref={ref} {...props} />),
    },
  };
});

import { HelloWave } from '@/components/hello-wave';
import { render, screen } from '@testing-library/react-native';

describe('HelloWave', () => {
  it('renders the wave glyph', () => {
    render(<HelloWave />);
    expect(screen.getByText('👋')).toBeTruthy();
  });

  it('applies animation styles', () => {
    const { toJSON } = render(<HelloWave />);
    const tree = toJSON() as any;
    const style = tree.props.style;
    expect(style.fontSize).toBe(28);
    expect(style.animationDuration).toBe('300ms');
    expect(style.animationIterationCount).toBe(4);
  });
});
