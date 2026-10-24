import React from 'react';
import styles from './SkipNav.module.scss';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { BaseLink } from '~components/Link/BaseLink';
import type { StringChildrenType, TestID } from '~utils/types';

const fallbackId = 'klear360-skip-nav';
type SkipNavLinkProps = {
  id?: string;
  children?: StringChildrenType;
  /**
   * **Internal**
   *
   * Adds background to link. Used internally in SideNav
   */
  _hasBackground?: boolean;
};

const SkipNavLink = ({
  id = fallbackId,
  children = 'Skip to content',
  _hasBackground = false,
}: SkipNavLinkProps): React.ReactElement => {
  return (
    <BaseLink
      href={`#${id}`}
      // @ts-expect-error className is internal to BaseLink styled shell
      className={styles.skipNavLink}
      {...(_hasBackground ? { 'data-has-background': true } : {})}
    >
      {children}
    </BaseLink>
  );
};

type SkipNavContentProps = {
  id?: string;
} & TestID;

const SkipNavContent = ({
  id = fallbackId,
  testID = 'skipnav-content',
}: SkipNavContentProps): React.ReactElement => {
  return (
    <div
      tabIndex={-1}
      id={id}
      style={{ outline: 0 }}
      {...metaAttribute({ name: MetaConstants.SkipNav, testID })}
    />
  );
};

export { SkipNavLink, SkipNavContent };
