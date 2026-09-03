// eslint-disable-next-line import/no-cycle
import { generateKlear360Code } from '../../main';
import { convertStyleNameToKlear360Name, isBackgroundColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { klear360Imports, mergeImports } from '../../utils/imports';
import { getPaddingValue, getTokenFromSpacingValue } from '../../utils/spacing';
import { defaultValues, LAYOUT_MODES } from './constants';
import { getFlexAlignmentFromAxisAlignment } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360FrameNode, Klear360GroupNode, Klear360Props } from '~/code/types/Klear360';

export const transformFrameOrGroup = (
  klear360Frame: Klear360FrameNode | Klear360GroupNode,
): TransformFunctionReturnType => {
  const props: Klear360Props = {};

  // TODO groups can have item spacing as well
  // since item spacing figma property does not exist
  // for groups, use relative transform matrix to find the
  // distances between elements in a group
  if (klear360Frame.type === 'GROUP') {
    let children: TransformFunctionReturnType = { component: '', imports: {} };
    if (klear360Frame.children && klear360Frame.children.length > 0) {
      children = generateKlear360Code({
        klear360Nodes: klear360Frame.children,
      });
    }

    return {
      component: component('Box', {
        props,
        defaultValues,
        children: children.component,
      }),
      imports: mergeImports(children.imports ?? {}, klear360Imports(['Box'])),
    };
  }

  // --- Frame specific code below ---
  // --- Layout mode specific code below ---
  // TODO set alignItems and justifyContent when items don't fill the entire space
  if (
    klear360Frame.layoutMode === LAYOUT_MODES.VERTICAL ||
    klear360Frame.layoutMode === LAYOUT_MODES.HORIZONTAL
  ) {
    props.display = {
      value: 'flex',
      type: 'string',
    };

    props.flexDirection = {
      value: klear360Frame.layoutMode === 'VERTICAL' ? 'column' : 'row',
      type: 'string',
    };

    props.gap = {
      value: getTokenFromSpacingValue(klear360Frame.itemSpacing),
      type: 'string',
    };

    const justifyContent = getFlexAlignmentFromAxisAlignment(klear360Frame.primaryAxisAlignItems);
    const alignItems = getFlexAlignmentFromAxisAlignment(klear360Frame.counterAxisAlignItems);

    props.justifyContent = { value: justifyContent, type: 'string' };
    props.alignItems = { value: alignItems, type: 'string' };

    const paddingValue = getPaddingValue({
      top: klear360Frame.paddingTop,
      right: klear360Frame.paddingRight,
      bottom: klear360Frame.paddingBottom,
      left: klear360Frame.paddingLeft,
    });
    // always generate an array. easier to generate this syntax
    // since it works in all cases
    props.padding = {
      value:
        paddingValue.length > 1
          ? `[${paddingValue.map((value) => `"${value}"`).join(', ')}]`
          : paddingValue[0],
      type: paddingValue.length > 1 ? 'instance' : 'string',
    };

    if (klear360Frame.maxHeight) {
      props.maxHeight = {
        value: getTokenFromSpacingValue(klear360Frame.maxHeight),
        type: 'string',
      };
    }

    if (klear360Frame.maxWidth) {
      props.maxWidth = {
        value: getTokenFromSpacingValue(klear360Frame.maxWidth),
        type: 'string',
      };
    }

    if (klear360Frame.layoutSizingVertical === 'FIXED') {
      props.height = {
        value: getTokenFromSpacingValue(klear360Frame.height),
        type: 'string',
      };
    }

    if (klear360Frame.layoutSizingHorizontal === 'FIXED') {
      props.width = {
        value: getTokenFromSpacingValue(klear360Frame.width),
        type: 'string',
      };
    }

    if (
      (klear360Frame.layoutSizingVertical === 'FILL' &&
        klear360Frame.layoutMode === LAYOUT_MODES.VERTICAL) ||
      (klear360Frame.layoutSizingHorizontal === 'FILL' &&
        klear360Frame.layoutMode === LAYOUT_MODES.HORIZONTAL)
    ) {
      props.flex = {
        value: '1',
        type: 'string',
      };
    }
  }
  // --- Layout mode specific end ---

  // TODO add support for fills array
  // TODO handle figma.mixed
  // --- Background color ---
  if (klear360Frame.fillStyleId !== figma.mixed) {
    const fillStyle = figma.getStyleById(klear360Frame.fillStyleId);
    if (fillStyle) {
      const styleName = fillStyle.name;
      const klear360TokenName = convertStyleNameToKlear360Name(styleName);
      const isValidToken = isBackgroundColorToken(klear360TokenName);

      props.backgroundColor = {
        value: klear360TokenName,
        type: 'string',
        isCommented: !isValidToken,
        comment: isValidToken
          ? ''
          : 'Only surface.background tokens are supported by Box component',
      };
    }
  }

  let children: TransformFunctionReturnType = { component: '', imports: {} };
  if (klear360Frame.children && klear360Frame.children.length > 0) {
    children = generateKlear360Code({
      klear360Nodes: klear360Frame.children,
    });
  }

  return {
    component: component('Box', {
      props,
      defaultValues,
      children: children.component,
    }),
    imports: mergeImports(children.imports ?? {}, klear360Imports(['Box'])),
  };
};
