import { getDividerMarginTokens } from '../tokens';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import { Divider } from '~components/Divider';
import { useTheme } from '~utils';

const MenuDivider = (styledProps: StyledPropsKlear360): React.ReactElement => {
  const { theme } = useTheme();
  return <Divider {...getDividerMarginTokens(theme)} {...styledProps} />;
};

export { MenuDivider };
