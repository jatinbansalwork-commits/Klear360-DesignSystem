import React from 'react';
import overlayStyles from './MenuOverlay.module.scss';
import { MENU_MIN_WIDTH, overlayPaddingX, overlayPaddingTop, overlayPaddingBottom } from './tokens';
import type { MenuOverlayProps } from './types';
import { getPopupBoxShadowString, isReactNative, useTheme } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { Klear360ElementRef } from '~utils/types';
import { componentZIndices } from '~utils/componentZIndices';
import BaseBox from '~components/Box/BaseBox';

const _MenuOverlay: React.ForwardRefRenderFunction<Klear360ElementRef, MenuOverlayProps> = (
  {
    children,
    zIndex = componentZIndices.dropdownOverlay,
    _transitionStyle,
    minWidth,
    maxWidth,
    width,
    offset,
    testID,
    ...props
  },
  ref,
): React.ReactElement => {
  const { colorScheme, theme } = useTheme();
  void offset;

  return (
    <BaseBox
      ref={ref as never}
      {...props}
      zIndex={zIndex}
      className={overlayStyles.overlay}
      {...metaAttribute({ name: MetaConstants.Menu, testID })}
      minWidth={minWidth ?? MENU_MIN_WIDTH}
      width={width}
      maxWidth={maxWidth}
    >
      {/*
        Requires another nested div since floatingStyles clash with floatingTransitionStyles

        https://floating-ui.com/docs/usetransition#usetransitionstyles
      */}
      <BaseBox
        className={overlayStyles.overlayContent}
        backgroundColor="popup.background.gray.moderate"
        paddingX={overlayPaddingX}
        paddingTop={overlayPaddingTop}
        paddingBottom={overlayPaddingBottom}
        borderWidth="none"
        borderRadius="medium"
        style={{
          ..._transitionStyle,
          backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
          boxShadow: isReactNative() ? undefined : getPopupBoxShadowString(theme, colorScheme),
        }}
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};

const MenuOverlay = React.forwardRef(_MenuOverlay);

export { MenuOverlay };
