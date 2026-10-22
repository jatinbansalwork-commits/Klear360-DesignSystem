/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { TextAnimationStyles } from '../markdown/MarkdownStyles';
import { markdownComponents } from '../markdown/MarkdownRenderers';
import { useGenUIAnimation } from '../GenUIContext';
import { createRehypeAnimate } from '../rehypeAnimate';
import type { TextComponent } from '../GenUIComponentTypes';

const RenderTextComponent = memo(({ content }: TextComponent) => {
  const { isAnimating, animateOptions } = useGenUIAnimation();

  const rehypePlugins = useMemo(() => {
    if (!isAnimating) return [];
    return [createRehypeAnimate(animateOptions)];
  }, [isAnimating, animateOptions]);

  if (!content) return null;

  return (
    <>
      {isAnimating ? <TextAnimationStyles /> : null}
      <ReactMarkdown skipHtml rehypePlugins={rehypePlugins} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </>
  );
});

export { RenderTextComponent };
