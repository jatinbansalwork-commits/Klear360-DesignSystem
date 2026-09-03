import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues, helpers } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformTextInput = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helpText?.value);

  // TODO handle icon
  // const isIconPresent = isPresent(componentProperties.icon?.value);

  const isMaxCharactersPresent = isPresent(componentProperties.maxCharacters?.value);
  const isPrefixPresent = isPresent(componentProperties.prefix?.value);
  const isSuffixPresent = isPresent(componentProperties.prefix?.value);

  const props: Klear360Props = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
    showClearButton: {
      value: jsxValue(componentProperties.showClearButton?.value),
      type: 'boolean',
    },
  };

  props.label = {
    value: findTextByLayerName(klear360ComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  props.placeholder = {
    value: findTextByLayerName(klear360ComponentInstance, 'Placeholder') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(klear360ComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  if (isMaxCharactersPresent) {
    const maxCharactersCountSplit = (
      findTextByLayerName(klear360ComponentInstance, 'Char Count') ?? ''
    ).split('/');

    props.maxCharacters = {
      value: maxCharactersCountSplit.length > 1 ? maxCharactersCountSplit[1] : '',
      type: 'number',
    };
  }

  if (isSuffixPresent) {
    props.suffix = {
      value: findTextByLayerName(klear360ComponentInstance, 'Trailing Label') ?? '',
      type: 'string',
    };
  }

  if (isPrefixPresent) {
    props.prefix = {
      value: findTextByLayerName(klear360ComponentInstance, 'Leading Label') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('TextInput', { props, defaultValues, helpers }),
    imports: klear360Imports(['TextInput']),
  };
};
