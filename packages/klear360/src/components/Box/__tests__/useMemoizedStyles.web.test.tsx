import { renderHook } from '@testing-library/react-hooks';
import { getMemoDependency, useMemoizedStyles } from '../BaseBox/useMemoizedStyles';
import klear360LightTheme from '~components/Klear360Provider/__tests__/klear360LightTheme/klear360LightTheme.web';
import { Klear360Provider } from '~components/Klear360Provider';
import { klear360Theme } from '~tokens/theme';

const Klear360ThemeProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
      {children}
    </Klear360Provider>
  );
};

describe('getDependencyProp', () => {
  it('should return react usememo dependency prop', () => {
    expect(
      getMemoDependency({
        paddingLeft: '12px',
        display: 'block',
        id: 'yo',
        className: 'hi',
        children: 'wuuhuuu',
        // @ts-expect-error: we don't have to care about actual theme object. It is ignored in this function
        theme: { name: 'klear360Theme', something: 'something' },
        colorScheme: 'light',
      }),
    ).toMatchInlineSnapshot(`"{"paddingLeft":"12px","display":"block"}-klear360Theme-light"`);
  });
});

describe('useMemoizedStyles', () => {
  it('should return correct CSS styles', () => {
    const { result } = renderHook(
      () =>
        useMemoizedStyles({
          padding: 'spacing.10',
          margin: ['spacing.1', 'spacing.2'],
          theme: klear360LightTheme,
        }),
      {
        wrapper: Klear360ThemeProvider,
      },
    );

    expect(JSON.stringify(result.current)).toMatchInlineSnapshot(
      `"{"padding":"48px","margin":"2px 4px"}"`,
    );
  });
});
