import { describe, expect, it, jest } from '@jest/globals';

describe('use-color-scheme', () => {
  it('re-exports react-native useColorScheme', () => {
    jest.isolateModules(() => {
      jest.doMock('react-native', () => ({
        useColorScheme: () => 'dark',
      }));

      const { useColorScheme } = require('@/hooks/use-color-scheme.ts');
      expect(useColorScheme()).toBe('dark');
    });
  });
});

describe('use-color-scheme.web', () => {
  it('returns light before hydration', () => {
    jest.isolateModules(() => {
      const setHasHydrated = jest.fn();

      jest.doMock('react', () => ({
        useState: () => [false, setHasHydrated],
        useEffect: (cb: () => void) => cb(),
      }));

      jest.doMock('react-native', () => ({
        useColorScheme: () => 'dark',
      }));

      const { useColorScheme } = require('@/hooks/use-color-scheme.web');
      expect(useColorScheme()).toBe('light');
      expect(setHasHydrated).toHaveBeenCalledWith(true);
    });
  });

  it('returns react-native color scheme after hydration', () => {
    jest.isolateModules(() => {
      jest.doMock('react', () => ({
        useState: () => [true, jest.fn()],
        useEffect: () => undefined,
      }));

      jest.doMock('react-native', () => ({
        useColorScheme: () => 'dark',
      }));

      const { useColorScheme } = require('@/hooks/use-color-scheme.web');
      expect(useColorScheme()).toBe('dark');
    });
  });
});

describe('use-theme-color', () => {
  it('prefers prop override', () => {
    jest.isolateModules(() => {
      jest.doMock('@/hooks/use-color-scheme', () => ({
        useColorScheme: () => 'light',
      }));
      jest.doMock('@/constants/theme', () => ({
        Colors: {
          light: { background: '#fff', text: '#111' },
          dark: { background: '#000', text: '#eee' },
        },
      }));

      const { useThemeColor } = require('@/hooks/use-theme-color.ts');
      expect(useThemeColor({ light: '#abc' }, 'background')).toBe('#abc');
    });
  });

  it('falls back to palette color for theme', () => {
    jest.isolateModules(() => {
      jest.doMock('@/hooks/use-color-scheme', () => ({
        useColorScheme: () => 'dark',
      }));
      jest.doMock('@/constants/theme', () => ({
        Colors: {
          light: { background: '#fff', text: '#111' },
          dark: { background: '#000', text: '#eee' },
        },
      }));

      const { useThemeColor } = require('@/hooks/use-theme-color.ts');
      const { Colors } = require('@/constants/theme');
      expect(useThemeColor({}, 'text')).toBe(Colors.dark.text);
    });
  });
});
