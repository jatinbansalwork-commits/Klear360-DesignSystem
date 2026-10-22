/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { genUISpacingContract } from '../GenUISpacing';
import { Heading, Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import {
  MarkdownOrderedList,
  MarkdownUnorderedList,
  MarkdownHeadingContainer,
  MarkdownListItem,
  MarkdownUnorderedListMarker,
  MarkdownOrderedListMarker,
  MarkdownListItemBody,
  MarkdownListContext,
  MarkdownInlineCode,
  MarkdownItalic,
  MarkdownBlockquote,
  MarkdownCodeBlock,
  MarkdownCodeBlockHeader,
  MarkdownCodeBlockCode,
  MarkdownCodeBlockLanguage,
} from './MarkdownStyles';
import { MarkdownCodeBlockCopyButton } from './MarkdownCodeBlockCopyButton';

const MarkdownListItemRenderer = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  const { ordered } = React.useContext(MarkdownListContext);
  return (
    <MarkdownListItem $ordered={ordered}>
      {ordered ? <MarkdownOrderedListMarker /> : <MarkdownUnorderedListMarker />}
      <MarkdownListItemBody>{children}</MarkdownListItemBody>
    </MarkdownListItem>
  );
};

const markdownHeadingStyles = {
  h1: { level: 1, size: 'large', color: 'surface.text.gray.normal', as: 'h1' },
  h2: { level: 2, size: 'medium', color: 'surface.text.gray.normal', as: 'h2' },
  h3: { level: 3, size: 'medium', color: 'surface.text.gray.subtle', as: 'h3' },
  h4: { level: 4, size: 'small', color: 'surface.text.gray.subtle', as: 'h4' },
  h5: { level: 5, size: 'small', color: 'surface.text.gray.muted', as: 'h5' },
  h6: { level: 6, size: 'small', color: 'surface.text.gray.muted', as: 'h6' },
} as const;

type MarkdownHeadingTag = keyof typeof markdownHeadingStyles;

const MarkdownHeadingRenderer = ({
  tag,
  children,
}: {
  tag: MarkdownHeadingTag;
  children?: React.ReactNode;
}): JSX.Element => {
  const { level, size, color, as } = markdownHeadingStyles[tag];

  return (
    <MarkdownHeadingContainer $level={level}>
      <Heading
        as={as}
        size={size}
        weight="medium"
        color={color}
        textTransform={level === 6 ? 'uppercase' : undefined}
      >
        {children}
      </Heading>
    </MarkdownHeadingContainer>
  );
};

const getMarkdownCodeBlockDetails = (
  children?: React.ReactNode,
): { code: React.ReactNode; language?: string } => {
  const child = React.Children.toArray(children)[0];

  if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(child)) {
    const language = child.props.className?.replace(/^language-/, '');
    return { code: child.props.children, language };
  }

  return { code: children };
};

/**
 * Stable components object for ReactMarkdown to prevent re-renders during streaming.
 * Defined outside the component to maintain referential equality.
 */
const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h1">{children}</MarkdownHeadingRenderer>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h2">{children}</MarkdownHeadingRenderer>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h3">{children}</MarkdownHeadingRenderer>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h4">{children}</MarkdownHeadingRenderer>
  ),
  h5: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h5">{children}</MarkdownHeadingRenderer>
  ),
  h6: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownHeadingRenderer tag="h6">{children}</MarkdownHeadingRenderer>
  ),
  b: ({ children }: { children?: React.ReactNode }) => (
    <Text as="span" size="medium" weight="semibold" color="surface.text.gray.subtle">
      {children}
    </Text>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <Text as="span" size="medium" weight="semibold" color="surface.text.gray.subtle">
      {children}
    </Text>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <Link
      href={href}
      size="medium"
      variant="anchor"
      color="primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {(children as unknown) as string}
    </Link>
  ),
  li: MarkdownListItemRenderer,
  ol: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownListContext.Provider value={{ ordered: true }}>
      <MarkdownOrderedList>{children}</MarkdownOrderedList>
    </MarkdownListContext.Provider>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownListContext.Provider value={{ ordered: false }}>
      <MarkdownUnorderedList>{children}</MarkdownUnorderedList>
    </MarkdownListContext.Provider>
  ),
  hr: () => <Divider marginY="spacing.7" />,
  code: ({
    inline,
    className,
    children,
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) =>
    inline || !className ? (
      <MarkdownInlineCode>{children}</MarkdownInlineCode>
    ) : (
      <code className={className}>{children}</code>
    ),
  pre: ({ children }: { children?: React.ReactNode }) => {
    const { code, language } = getMarkdownCodeBlockDetails(children);

    return (
      <MarkdownCodeBlock>
        <MarkdownCodeBlockHeader>
          {language ? <MarkdownCodeBlockLanguage>{language}</MarkdownCodeBlockLanguage> : null}
          <MarkdownCodeBlockCopyButton code={code} />
        </MarkdownCodeBlockHeader>
        <MarkdownCodeBlockCode>{code}</MarkdownCodeBlockCode>
      </MarkdownCodeBlock>
    );
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <MarkdownBlockquote>{children}</MarkdownBlockquote>
  ),
  em: ({ children }: { children?: React.ReactNode }) => <MarkdownItalic>{children}</MarkdownItalic>,
  i: ({ children }: { children?: React.ReactNode }) => <MarkdownItalic>{children}</MarkdownItalic>,
  p: ({ children }: { children?: React.ReactNode }) => (
    <Text
      marginBottom={genUISpacingContract.textParagraphGap}
      size="medium"
      color="surface.text.gray.subtle"
    >
      {children}
    </Text>
  ),
};

export { MarkdownListItemRenderer, MarkdownHeadingRenderer, markdownComponents };
export type { MarkdownHeadingTag };
