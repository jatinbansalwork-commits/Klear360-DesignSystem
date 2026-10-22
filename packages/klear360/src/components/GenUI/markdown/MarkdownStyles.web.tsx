import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

/**
 * Global styles for text streaming animations
 * Applied to [data-animate-word] spans created by rehypeAnimate
 */
const TextAnimationStyles = createGlobalStyle`
  @keyframes animate-fadeIn {
    from {
      opacity: 0;
      color: #48D08C;
      filter: blur(2px);
    }
    to {
      opacity: 1;
      color: inherit;
      filter: blur(0px);
    }
  }

  [data-animate-word] {
    display: inline-block;
    animation: animate-fadeIn
      var(--animate-duration, 400ms)
      var(--animate-easing, ease) both;
  }
`;

const MarkdownUnorderedList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing[3] + theme.spacing[1]}px;
  list-style: none;
  margin: 0 0 ${({ theme }) => theme.spacing[2]}px 0;
  padding: 0;
`;

const MarkdownOrderedList = styled.ol`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spacing[3] + theme.spacing[1]}px;
  counter-reset: markdown-ordered-list;
  list-style: none;
  margin: 0 0 ${({ theme }) => theme.spacing[2]}px 0;
  padding: 0;
`;

const MarkdownHeadingContainer = styled.div<{ $level: 1 | 2 | 3 | 4 | 5 | 6 }>`
  ${({ theme, $level }) => {
    const spacing = {
      1: { marginTop: 0, marginBottom: theme.spacing[4] },
      2: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
      3: { marginTop: theme.spacing[7], marginBottom: theme.spacing[3] },
      4: { marginTop: theme.spacing[7], marginBottom: theme.spacing[2] },
      5: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
      6: { marginTop: theme.spacing[5], marginBottom: theme.spacing[2] },
    }[$level];

    return `
      margin: ${spacing.marginTop}px 0 ${spacing.marginBottom}px;
    `;
  }}

  & + & {
    margin-top: 0;
  }

  ${({ theme, $level }) =>
    $level === 6
      ? `
        > h6 {
          font-family: ${theme.typography.fonts.family.text};
          font-size: ${theme.typography.fonts.size[100]}px;
          line-height: ${theme.typography.lineHeights[300]}px;
          letter-spacing: 0.03em;
        }
      `
      : ''}
`;

const MarkdownListItem = styled.li<{ $ordered: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme, $ordered }) => theme.spacing[$ordered ? 3 : 4]}px;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
  font-size: ${({ theme }) => theme.typography.fonts.size[100]}px;
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
  list-style: none;

  ${({ $ordered }) => ($ordered ? 'counter-increment: markdown-ordered-list;' : '')}

  > ul,
  > ol {
    margin-top: ${({ theme }) => theme.spacing[2]}px;
    margin-bottom: 0;
    row-gap: ${({ theme }) => theme.spacing[2]}px;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const MarkdownListMarker = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.surface.text.gray.muted};
  height: ${({ theme }) => theme.typography.lineHeights[100]}px;
`;

const MarkdownUnorderedListMarker = styled(MarkdownListMarker)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: ${({ theme }) => theme.spacing[4]}px;
  min-width: ${({ theme }) => theme.spacing[4]}px;

  &::before {
    content: '';
    width: ${({ theme }) => theme.spacing[2]}px;
    height: ${({ theme }) => theme.spacing[2]}px;
    border-radius: ${({ theme }) => theme.border.radius.max}px;
    background: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  }
`;

const MarkdownOrderedListMarker = styled(MarkdownListMarker)`
  display: inline-block;
  min-width: ${({ theme }) => theme.spacing[5]}px;
  text-align: right;

  &::before {
    content: counter(markdown-ordered-list) '.';
  }
`;

const MarkdownListItemBody = styled.span`
  flex: 1;
  min-width: 0;

  > ul,
  > ol {
    margin-top: ${({ theme }) => theme.spacing[2]}px;
    margin-bottom: 0;
    row-gap: ${({ theme }) => theme.spacing[2]}px;
  }
`;

const MarkdownListContext = React.createContext({ ordered: false });

const MarkdownInlineCode = styled.code`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  vertical-align: 1.5px;
  color: ${({ theme }) => theme.colors.interactive.text.information.normal};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[50]}px;
  font-style: normal;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights[50]}px;
  letter-spacing: 0;
  background: ${({ theme }) => theme.colors.surface.background.gray.intense};
  border-radius: ${({ theme }) => theme.border.radius.xsmall}px;
  box-shadow: inset 0 0 0 ${({ theme }) => theme.border.width.thin}px
    ${({ theme }) => theme.colors.surface.border.gray.subtle};
  margin: 0 ${({ theme }) => theme.spacing[1]}px;
  padding: ${({ theme }) => theme.spacing[1]}px ${({ theme }) => theme.spacing[2]}px;
`;

const MarkdownItalic = styled.span`
  color: ${({ theme }) => theme.colors.surface.text.gray.subtle};
  font-family: ${({ theme }) => theme.typography.fonts.family.text};
  font-size: ${({ theme }) => theme.typography.fonts.size[100]}px;
  font-style: italic;
  font-weight: inherit;
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
`;

const MarkdownBlockquote = styled.blockquote`
  border-left: ${({ theme }) => theme.border.width.thicker}px solid
    ${({ theme }) => theme.colors.surface.border.gray.normal};
  margin: 0 0 ${({ theme }) => theme.spacing[5]}px 0;
  padding: 0 0 0 ${({ theme }) => theme.spacing[5]}px;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.surface.text.gray.muted};
    font-style: italic;
  }
`;

const MarkdownCodeBlock = styled.pre`
  display: inline-block;
  max-width: 660px;
  width: fit-content;
  margin: ${({ theme }) => theme.spacing[1]}px 0 ${({ theme }) => theme.spacing[0]}px;
  overflow: hidden;
  padding: 0;
  background: ${({ theme }) => theme.colors.interactive.background.gray.faded};
  border: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.feedback.border.neutral.subtle};
  border-radius: ${({ theme }) => theme.border.radius.medium}px;
`;

const MarkdownCodeBlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[3]}px ${({ theme }) => theme.spacing[4]}px;
  border-bottom: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.surface.border.gray.muted};
`;

const MarkdownCodeBlockActions = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
`;

const MarkdownCodeBlockCopyAnimation = styled.span<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  animation: ${({ $copied }) =>
      $copied ? 'markdown-code-copy-success' : 'markdown-code-copy-reset'}
    180ms cubic-bezier(0.2, 0.8, 0.2, 1);

  @keyframes markdown-code-copy-success {
    0% {
      opacity: 0;
      transform: scale(0.72) rotate(-12deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes markdown-code-copy-reset {
    0% {
      opacity: 0;
      transform: scale(0.88);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MarkdownCodeBlockLanguage = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.surface.text.gray.muted};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[50]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings[100]}px;
  line-height: ${({ theme }) => theme.typography.lineHeights[50]}px;
`;

const MarkdownCodeBlockCode = styled.code`
  display: block;
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing[4]}px;
  color: ${({ theme }) => theme.colors.surface.text.gray.normal};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[75]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
  white-space: pre;
  background: none;
  border: none;
`;

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
