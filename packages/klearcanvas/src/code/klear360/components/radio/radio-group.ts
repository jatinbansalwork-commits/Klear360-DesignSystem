import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { klear360Imports, mergeImports } from '../../utils/imports';
import { transformRadio } from './radio';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360Props,
  Klear360TextNode,
} from '~/code/types/Klear360';

export const transformRadioGroup = (
  klear360Instance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const labelTextNode = findNode(
    klear360Instance,
    (node) =>
      node.layerName === 'Label' &&
      node.type === 'TEXT' &&
      node.parent?.layerName === 'Label Holder',
  );
  const label = (labelTextNode as Klear360TextNode)?.characters;

  const isHelpTextPresent = isPresent(klear360Instance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    const helpTextNode = findNode(
      klear360Instance,
      (node) =>
        node.layerName === 'Help Text' &&
        node.type === 'TEXT' &&
        node.parent?.layerName === 'Help Group',
    );
    helpText = (helpTextNode as Klear360TextNode)?.characters;
  }

  const size = jsxValue(klear360Instance.componentProperties.size?.value).toLowerCase();

  const props: Klear360Props = {
    label: {
      value: label,
      type: 'string',
    },
    helpText: {
      value: helpText,
      type: 'string',
    },
    size: {
      type: 'string',
      value: size,
    },
  };

  const childrenWrapper = findNode(
    klear360Instance,
    (node) => node.layerName === 'Radio Button Group' && node.type === 'FRAME',
  ) as Klear360FrameNode;

  const { component: children, imports } = childrenWrapper.children.map(transformRadio).reduce(
    (acc, val) => {
      acc.component = `${acc.component}${val.component}`;
      acc.imports = mergeImports(acc.imports ?? {}, val.imports ?? {});
      return acc;
    },
    {
      component: '',
      imports: {},
    },
  );

  return {
    component: component('RadioGroup', {
      props,
      defaultValues,
      children,
    }),
    imports: mergeImports(imports ?? {}, klear360Imports(['RadioGroup'])),
  };
};
