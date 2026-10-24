import React from 'react';
import styles from './StepGroup.module.scss';

type StepInteractiveItemHeaderProps = React.HTMLAttributes<HTMLElement> & {
  href?: string;
  target?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

const StepInteractiveItemHeader = ({
  href,
  target,
  isSelected,
  isDisabled,
  onClick,
  children,
  ...rest
}: StepInteractiveItemHeaderProps): React.ReactElement => {
  const className = [styles.interactiveHeader, rest.className].filter(Boolean).join(' ');
  const dataSelected = isSelected ? true : undefined;

  if (href) {
    const { className: _c, ...anchorRest } = rest;
    return (
      <a
        href={href}
        target={target}
        className={className}
        data-selected={dataSelected}
        onClick={onClick}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  const { className: _c, ...buttonRest } = rest;
  return (
    <button
      type="button"
      className={className}
      data-selected={dataSelected}
      disabled={isDisabled}
      onClick={onClick}
      {...buttonRest}
    >
      {children}
    </button>
  );
};

export { StepInteractiveItemHeader };
