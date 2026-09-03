import type { WrapperComponent } from '@testing-library/react-hooks';
import { renderHook, act } from '@testing-library/react-hooks';
import klear360LightTheme from './klear360LightTheme';
import { klear360Theme } from '~tokens/theme';
import { colorSchemeNamesInput } from '~tokens/theme/theme';
import type { Klear360ProviderProps } from '~components/Klear360Provider';
import { Klear360Provider, useTheme } from '~components/Klear360Provider';
import { setupMatchMediaMock } from '~utils/mocks';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Klear360Provider/>', () => {
  // mock matchMedia
  setupMatchMediaMock({ matches: true });
  const wrapper: WrapperComponent<Klear360ProviderProps> = ({
    themeTokens,
    colorScheme,
    children,
  }) => (
    <Klear360Provider themeTokens={themeTokens} colorScheme={colorScheme}>
      {children}
    </Klear360Provider>
  );

  it('should render with provided theme and colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: klear360Theme,
        colorScheme: 'light',
        children: null,
      },
    });

    expect(result.current.theme).toEqual(klear360LightTheme);
    expect(result.current.colorScheme).toBe('light');
  });

  it('should select colorscheme as "light" when colorscheme not provided', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: klear360Theme,
        children: null,
      },
    });

    expect(result.current.colorScheme).toBe('light');
  });

  it('should change colorscheme', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: klear360Theme,
        colorScheme: 'light',
        children: null,
      },
    });

    act(() => {
      result.current.setColorScheme('dark');
    });

    expect(result.current.colorScheme).toBe('dark');
  });

  it('should throw error when theme is not passed', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      // @ts-expect-error testing the error case when theme is not passed
      initialProps: {
        colorScheme: 'light',
        children: null,
      },
    });

    expect(result.error?.message).toBe(
      `[Klear360: Klear360Provider]: Expected valid themeTokens of type ThemeTokens to be passed but found undefined`,
    );
  });

  it(`should throw error when colorscheme is not one of [${colorSchemeNamesInput.toString()}]`, () => {
    const initialColorScheme = 'random';
    const { result } = renderHook(() => useTheme(), {
      wrapper,
      initialProps: {
        themeTokens: klear360Theme,
        // @ts-expect-error testing the error case when colorscheme is not one of [light, dark, system]
        colorScheme: initialColorScheme,
        children: null,
      },
    });

    expect(result.error?.message).toBe(
      `[Klear360: Klear360Provider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${initialColorScheme}`,
    );
  });
});
