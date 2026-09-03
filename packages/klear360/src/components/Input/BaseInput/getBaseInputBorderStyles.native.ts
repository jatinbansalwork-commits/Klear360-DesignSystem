import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/Klear360Provider';

const getBaseInputBorderStyles = ({
  borderColor,
}: {
  theme: Theme;
  borderWidth: number;
  borderColor: string;
  isFocused?: boolean;
}): CSSObject => ({
  borderColor,
});

export { getBaseInputBorderStyles };
