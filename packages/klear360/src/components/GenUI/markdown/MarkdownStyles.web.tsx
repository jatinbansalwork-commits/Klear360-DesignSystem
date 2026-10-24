import React from 'react';
import './MarkdownStyles.global.scss';
import styles from './MarkdownStyles.module.scss';
import { useTheme } from '~components/Klear360Provider';
import { ScopedRuntimeStyles, useStableScopeClass } from '~utils/web/scopedCssFromObject';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
const TextAnimationStyles = (): null => null;

const MarkdownUnorderedList = ({
  style,
  ...props
}: React.ComponentProps<'ul'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: theme.spacing[3] + theme.spacing[1],
        listStyle: 'none',
        margin: `0 0 ${theme.spacing[2]}px 0`,
        padding: 0,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownOrderedList = ({
  style,
  ...props
}: React.ComponentProps<'ol'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <ol
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: theme.spacing[3] + theme.spacing[1],
        counterReset: 'markdown-ordered-list',
        listStyle: 'none',
        margin: `0 0 ${theme.spacing[2]}px 0`,
        padding: 0,
        ...style,
      }}
      {...props}
    />
  );
};

type MarkdownHeadingContainerProps = React.ComponentProps<'div'> & {
  $level: 1 | 2 | 3 | 4 | 5 | 6;
};

const getPreviousHeadingContainer = (element: HTMLElement): HTMLElement | null => {
  let previousSibling = element.previousElementSibling;
  while (previousSibling) {
    if (previousSibling instanceof HTMLElement && previousSibling.dataset.markdownHeadingContainer) {
      return previousSibling;
    }
    previousSibling = previousSibling.previousElementSibling;
  }
  return null;
};

const MarkdownHeadingContainer = ({
  $level,
  className,
  style,
  children,
  ...rest
}: MarkdownHeadingContainerProps): React.ReactElement => {
  const { theme } = useTheme();
  /** Must match `jest/cssModuleMock.js` pass-through class name for `.headingContainer`. */
  const scopeClass = 'headingContainer';
  const spacing = {
    1: { marginTop: 0, marginBottom: theme.spacing[4] },
    2: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
    3: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
    4: { marginTop: theme.spacing[7], marginBottom: theme.spacing[2] },
    5: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
    6: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
  }[$level];

  const styleObject = React.useMemo(() => {
    if ($level !== 6) {
      return { [`& + &`]: { marginTop: 0 } };
    }
    return {
      [`& + &`]: { marginTop: 0 },
      [`& > h6`]: {
        fontFamily: theme.typography.fonts.family.text,
        fontSize: `${theme.typography.fonts.size[100]}px`,
        lineHeight: `${theme.typography.lineHeights[300]}px`,
        letterSpacing: '0.03em',
      },
    };
  }, [theme, $level]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [marginTop, setMarginTop] = React.useState(spacing.marginTop);

  useIsomorphicLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    setMarginTop(getPreviousHeadingContainer(element) ? 0 : spacing.marginTop);
  }, [spacing.marginTop]);

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <div
        ref={containerRef}
        data-markdown-heading-container=""
        className={[styles.headingContainer, scopeClass, className].filter(Boolean).join(' ')}
        style={{
          marginTop,
          marginBottom: spacing.marginBottom,
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    </>
  );
};

type MarkdownListItemProps = React.ComponentProps<'li'> & { $ordered: boolean };

const MarkdownListItem = ({
  $ordered,
  style,
  ...props
}: MarkdownListItemProps): React.ReactElement => {
  const { theme } = useTheme();
  const scopeClass = useStableScopeClass('md-li');
  const styleObject = React.useMemo(
    () => ({
      [`& > ul, & > ol`]: {
        marginTop: `${theme.spacing[2]}px`,
        marginBottom: 0,
        rowGap: `${theme.spacing[2]}px`,
      },
      [`&:last-child`]: { marginBottom: 0 },
      ...($ordered ? { counterIncrement: 'markdown-ordered-list' } : {}),
    }),
    [theme, $ordered],
  );

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <li
        className={scopeClass}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: theme.spacing[$ordered ? 3 : 4],
          marginBottom: 0,
          color: theme.colors.surface.text.gray.subtle,
          fontFamily: theme.typography.fonts.family.text,
          fontSize: `${theme.typography.fonts.size[100]}px`,
          lineHeight: `${theme.typography.lineHeights[100]}px`,
          listStyle: 'none',
          ...style,
        }}
        {...props}
      />
    </>
  );
};

const MarkdownListMarker = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <span
      style={{
        flexShrink: 0,
        color: theme.colors.surface.text.gray.muted,
        height: theme.typography.lineHeights[100],
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownUnorderedListMarker = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <MarkdownListMarker
      className={styles.unorderedMarker}
      style={
        {
          width: theme.spacing[4],
          minWidth: theme.spacing[4],
          height: theme.typography.lineHeights[100],
          '--md-marker-size': `${theme.spacing[2]}px`,
          '--md-marker-radius': `${theme.border.radius.max}px`,
          '--md-marker-bg': theme.colors.surface.text.gray.subtle,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const MarkdownOrderedListMarker = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <MarkdownListMarker
      className={styles.orderedMarker}
      style={
        {
          minWidth: theme.spacing[5],
          '--md-ordered-marker-min-width': `${theme.spacing[5]}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const MarkdownListItemBody = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  const scopeClass = useStableScopeClass('md-lib');
  const styleObject = React.useMemo(
    () => ({
      [`& > ul, & > ol`]: {
        marginTop: `${theme.spacing[2]}px`,
        marginBottom: 0,
        rowGap: `${theme.spacing[2]}px`,
      },
    }),
    [theme],
  );

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <span
        className={scopeClass}
        style={{ flex: 1, minWidth: 0, ...style }}
        {...props}
      />
    </>
  );
};

const MarkdownListContext = React.createContext({ ordered: false });

const MarkdownInlineCode = ({
  style,
  ...props
}: React.ComponentProps<'code'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <code
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        verticalAlign: '1.5px',
        color: theme.colors.interactive.text.information.normal,
        fontFamily: theme.typography.fonts.family.code,
        fontSize: `${theme.typography.fonts.size[50]}px`,
        fontStyle: 'normal',
        fontWeight: theme.typography.fonts.weight.regular,
        lineHeight: `${theme.typography.lineHeights[50]}px`,
        letterSpacing: 0,
        background: theme.colors.surface.background.gray.intense,
        borderRadius: theme.border.radius.xsmall,
        boxShadow: `inset 0 0 0 ${theme.border.width.thin}px ${theme.colors.surface.border.gray.subtle}`,
        margin: `0 ${theme.spacing[1]}px`,
        padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownItalic = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <span
      style={{
        color: theme.colors.surface.text.gray.subtle,
        fontFamily: theme.typography.fonts.family.text,
        fontSize: `${theme.typography.fonts.size[100]}px`,
        fontStyle: 'italic',
        fontWeight: 'inherit',
        lineHeight: `${theme.typography.lineHeights[100]}px`,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownBlockquote = ({
  style,
  ...props
}: React.ComponentProps<'blockquote'>): React.ReactElement => {
  const { theme } = useTheme();
  const scopeClass = useStableScopeClass('md-bq');
  const styleObject = React.useMemo(
    () => ({
      [`& p`]: {
        margin: 0,
        color: theme.colors.surface.text.gray.muted,
        fontStyle: 'italic',
      },
    }),
    [theme],
  );

  return (
    <>
      <ScopedRuntimeStyles scopeClass={scopeClass} styleObject={styleObject} />
      <blockquote
        className={scopeClass}
        style={{
          borderLeft: `${theme.border.width.thicker}px solid ${theme.colors.surface.border.gray.normal}`,
          margin: `0 0 ${theme.spacing[5]}px 0`,
          padding: `0 0 0 ${theme.spacing[5]}px`,
          ...style,
        }}
        {...props}
      />
    </>
  );
};

const MarkdownCodeBlock = ({
  style,
  ...props
}: React.ComponentProps<'pre'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <pre
      style={{
        display: 'inline-block',
        maxWidth: 660,
        width: 'fit-content',
        margin: `${theme.spacing[1]}px 0 ${theme.spacing[0]}px`,
        overflow: 'hidden',
        padding: 0,
        background: theme.colors.interactive.background.gray.faded,
        border: `${theme.border.width.thin}px solid ${theme.colors.feedback.border.neutral.subtle}`,
        borderRadius: theme.border.radius.medium,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownCodeBlockHeader = ({
  style,
  ...props
}: React.ComponentProps<'div'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        padding: `${theme.spacing[3]}px ${theme.spacing[4]}px`,
        borderBottom: `${theme.border.width.thin}px solid ${theme.colors.surface.border.gray.muted}`,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownCodeBlockActions = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      marginLeft: 'auto',
      ...style,
    }}
    {...props}
  />
);

type MarkdownCodeBlockCopyAnimationProps = React.ComponentProps<'span'> & { $copied: boolean };

const MarkdownCodeBlockCopyAnimation = ({
  $copied,
  className,
  style,
  ...props
}: MarkdownCodeBlockCopyAnimationProps): React.ReactElement => (
  <span
    className={[$copied ? 'markdown-code-copy-success' : 'markdown-code-copy-reset', className]
      .filter(Boolean)
      .join(' ')}
    style={{ display: 'inline-flex', alignItems: 'center', ...style }}
    {...props}
  />
);

const MarkdownCodeBlockLanguage = ({
  style,
  ...props
}: React.ComponentProps<'span'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: theme.colors.surface.text.gray.muted,
        fontFamily: theme.typography.fonts.family.code,
        fontSize: `${theme.typography.fonts.size[50]}px`,
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
        lineHeight: `${theme.typography.lineHeights[50]}px`,
        ...style,
      }}
      {...props}
    />
  );
};

const MarkdownCodeBlockCode = ({
  style,
  ...props
}: React.ComponentProps<'code'>): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <code
      style={{
        display: 'block',
        overflowX: 'auto',
        padding: theme.spacing[4],
        color: theme.colors.surface.text.gray.normal,
        fontFamily: theme.typography.fonts.family.code,
        fontSize: `${theme.typography.fonts.size[75]}px`,
        fontWeight: theme.typography.fonts.weight.regular,
        lineHeight: `${theme.typography.lineHeights[100]}px`,
        whiteSpace: 'pre',
        background: 'none',
        border: 'none',
        ...style,
      }}
      {...props}
    />
  );
};

export {
  TextAnimationStyles,
  MarkdownUnorderedList,
  MarkdownOrderedList,
  MarkdownHeadingContainer,
  MarkdownListItem,
  MarkdownListMarker,
  MarkdownUnorderedListMarker,
  MarkdownOrderedListMarker,
  MarkdownListItemBody,
  MarkdownListContext,
  MarkdownInlineCode,
  MarkdownItalic,
  MarkdownBlockquote,
  MarkdownCodeBlock,
  MarkdownCodeBlockHeader,
  MarkdownCodeBlockActions,
  MarkdownCodeBlockCopyAnimation,
  MarkdownCodeBlockLanguage,
  MarkdownCodeBlockCode,
};
