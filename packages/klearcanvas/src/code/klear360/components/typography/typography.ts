import { component } from '../../utils/component';
import { klear360Imports } from '../../utils/imports';
import {
  getComponentName,
  getComponentVariant,
  getDefaultValues,
  getSize,
  getWeight,
} from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360Props, Klear360TextNode } from '~/code/types/Klear360';

export const transformTextNode = (
  klear360TextNode: Klear360TextNode,
): TransformFunctionReturnType => {
  let styleName = '';

  if (typeof klear360TextNode.textStyleId === 'string') {
    const style = figma.getStyleById(klear360TextNode.textStyleId);
    // "Desktop/TitleMedium"
    styleName = style?.name ?? '';
  }

  if (styleName.length === 0) {
    return {
      component: component('Text', {
        props: {},
        defaultValues: {},
        children: klear360TextNode.characters,
      }),
      imports: klear360Imports(['Text']),
    };
  }

  const variant = getComponentVariant(styleName) || '';
  const weight = getWeight(styleName) || '';
  const name = getComponentName(variant);
  const defaultValues = getDefaultValues(name);
  const size = getSize(styleName);

  const props: Klear360Props = {
    variant: { value: variant, type: 'string' },
    weight: { value: weight, type: 'string' },
    size: { value: size, type: 'string' },
  };

  return {
    component: component(name, {
      props,
      defaultValues,
      children: klear360TextNode.characters,
    }),
    imports: klear360Imports([name]),
  };
};
