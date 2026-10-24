import React from 'react';
import type { CardRootProps } from './types';
import { CARD_SCALE_DOWN_VALUE } from './constants';
import { getCardRootClasses } from './getCardModuleClasses';
import styles from './Card.module.scss';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import type { Klear360ElementRef } from '~utils/types';

type WebCardRootProps = CardRootProps & {
  className?: string;
  style?: React.CSSProperties;
};

const _CardRoot: React.ForwardRefRenderFunction<Klear360ElementRef, WebCardRootProps> = (
  { as, accessibilityLabel, children, className, style, ...props },
  ref,
): React.ReactElement => {
  const isMobile = useIsMobile();
  const [isPressed, setIsPressed] = React.useState(false);
  const { isSelected, isFocused, shouldScaleOnHover, validationState, cursor } = props;

  return (
    <BaseBox
      ref={ref as never}
      as={as}
      {...props}
      className={[
        getCardRootClasses({ as }),
        shouldScaleOnHover && !isMobile ? styles.cardRootHoverScale : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-selected={isSelected ? 'true' : undefined}
      data-focused={isFocused ? 'true' : undefined}
      data-validation={validationState && validationState !== 'none' ? validationState : undefined}
      style={{
        cursor: cursor ?? (as === 'label' ? 'pointer' : 'initial'),
        ...(isMobile && isPressed && shouldScaleOnHover
          ? { transform: `scale(${CARD_SCALE_DOWN_VALUE})` }
          : {}),
        ...style,
      }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...makeAccessible({
        label: as === 'label' ? accessibilityLabel : undefined,
      })}
    >
      {children}
    </BaseBox>
  );
};

const CardRoot = React.forwardRef(_CardRoot);

export { CardRoot };
