import { Colors } from '@/constants/theme';
import { describe, expect, it } from '@jest/globals';

describe('theme colors', () => {
  it('provides light and dark palettes', () => {
    expect(Colors.light.background).toBeDefined();
    expect(Colors.dark.background).toBeDefined();
    expect(Colors.light.text).not.toEqual(Colors.dark.text);
  });
});
