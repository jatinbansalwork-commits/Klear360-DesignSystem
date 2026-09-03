import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { klear360Imports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

// TODO klear360 password component has a prop called
// "showRevealButton" but toggle doesn't exist in Figma

export const transformPasswordInput = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = klear360ComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helperText?.value);

  const isMaxCharactersPresent = isPresent(componentProperties.maxCharacters?.value);

  const props: Klear360Props = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
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

  return {
    component: component('PasswordInput', { props, defaultValues }),
    imports: klear360Imports(['PasswordInput']),
  };
};
