import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { baseInputBorderRadius } from '~components/Input/BaseInput/baseInputTokens';

type ColorInputSize = keyof typeof baseInputBorderRadius;
import { useTheme } from '~components/Klear360Provider';
import { makeBorderSize, makeSpace } from '~utils';
import styles from './ColorInput.module.scss';

const CLASSNAME = '__klear360-color-input-row';

type StyledColorInputProps = React.PropsWithChildren<{
  $size: ColorInputSize;
}>;

const StyledColorInput = ({
  $size,
  children,
  ...rest
}: StyledColorInputProps): React.ReactElement => {
  const { theme } = useTheme();
  const radius = makeBorderSize(theme.border.radius[baseInputBorderRadius[$size]]);

  return (
    <BaseBox
      className={styles.colorInputRoot}
      style={
        {
          ['--color-input-radius' as string]: radius,
          ['--color-input-value-padding-left' as string]: makeSpace(theme.spacing[3]),
        } as React.CSSProperties
      }
      {...rest}
    >
      {children}
    </BaseBox>
  );
};

export { StyledColorInput, CLASSNAME as COLOR_INPUT_ROW_CLASSNAME };
