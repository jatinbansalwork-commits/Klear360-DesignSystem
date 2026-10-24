import React from 'react';
import type { ListViewProps } from './types';
import { ListViewProvider } from './ListViewContext';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import useTheme from '~components/Klear360Provider/useTheme';

const ListView = ({ testID, children, ...rest }: ListViewProps): React.ReactElement => {
  const { colorScheme, theme } = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const { elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
  const borderColor = theme.colors.interactive.border.gray.disabled;
  const { boxShadow: _surfaceBoxShadow, ...surfaceDecoration } = getSurfaceStyles(
    theme,
    colorScheme,
  ) as React.CSSProperties;

  const surfaceStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxSizing: 'border-box',
    ...surfaceDecoration,
    boxShadow: `${elevation}, ${top}`,
    borderLeft: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    borderBottom: `1px solid ${borderColor}`,
    ...(!isDarkMode ? { borderTop: `1px solid ${borderColor}` } : {}),
  };

  return (
    <ListViewProvider value={{ isInsideListView: true }}>
      <BaseBox
        borderRadius="medium"
        overflow="hidden"
        backgroundColor="surface.background.gray.intense"
        style={surfaceStyle}
        {...metaAttribute({ name: MetaConstants.ListView, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseBox>
    </ListViewProvider>
  );
};

export { ListView };
