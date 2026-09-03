import { isIconInstance } from '../utils/iconUtils';
import { transformAlert } from './alert';
import { transformBadge } from './badge';
// eslint-disable-next-line import/no-cycle
import { transformFrameOrGroup } from './box';
import { transformButton } from './button';
import { transformCheckbox, transformCheckboxGroup } from './checkbox';
import { transformCounter } from './counter';
import { transformIcon } from './icon';
import { transformIconButton } from './iconButton';
import { transformIndicator } from './indicator';
import {
  transformOtpInput,
  transformPasswordInput,
  transformSelectInput,
  transformTextArea,
  transformTextInput,
} from './input';
import { transformLink } from './link';
import { transformProgressBar } from './progressBar';
import { transformRadio, transformRadioGroup } from './radio';
import { transformSpinner } from './spinner';
import {
  transformTitle,
  transformHeading,
  transformText,
  transformCode,
  transformTextNode,
} from './typography';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  Klear360ComponentInstanceNode,
  Klear360FrameNode,
  Klear360GroupNode,
  Klear360TextNode,
} from '~/code/types/Klear360';

const getUnknownComponentOutput = (
  component: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  return {
    component: `
  {/*
    ${component.name} is either not supported yet or not a part of Klear360.
    <${component.name} />
  */}`,
    imports: {},
  };
};

export const generateKlear360ComponentInstanceCode = (
  klear360ComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  // check if component instance is an icon
  const isIcon = isIconInstance(klear360ComponentInstance);
  if (isIcon) return transformIcon(klear360ComponentInstance);

  // handle all other components
  switch (klear360ComponentInstance.name) {
    case 'Button':
      return transformButton(klear360ComponentInstance);
    case 'Text Input':
      return transformTextInput(klear360ComponentInstance);
    case 'Badge':
      return transformBadge(klear360ComponentInstance);
    case 'Link':
      return transformLink(klear360ComponentInstance);
    case 'Checkbox':
      return transformCheckbox(klear360ComponentInstance);
    case 'Title':
      return transformTitle(klear360ComponentInstance);
    case 'Heading':
      return transformHeading(klear360ComponentInstance);
    case 'Text':
      return transformText(klear360ComponentInstance);
    case 'Code':
      return transformCode(klear360ComponentInstance);
    case 'Radio-Button':
      return transformRadio(klear360ComponentInstance);
    case 'Checkbox-Group':
      return transformCheckboxGroup(klear360ComponentInstance);
    case 'Radio-Group':
      return transformRadioGroup(klear360ComponentInstance);
    case 'Alert':
      return transformAlert(klear360ComponentInstance);
    case 'Spinner':
      return transformSpinner(klear360ComponentInstance);
    case 'TextArea Input':
      return transformTextArea(klear360ComponentInstance);
    case 'Password Input':
      return transformPasswordInput(klear360ComponentInstance);
    case 'OTP Input':
      return transformOtpInput(klear360ComponentInstance);
    case 'Counter':
      return transformCounter(klear360ComponentInstance);
    case 'IconButton':
      return transformIconButton(klear360ComponentInstance);
    case 'Indicators':
      return transformIndicator(klear360ComponentInstance);
    case 'ProgressBar':
      return transformProgressBar(klear360ComponentInstance);
    case 'Select Input':
      return transformSelectInput(klear360ComponentInstance);
    default:
      return getUnknownComponentOutput(klear360ComponentInstance);
  }
};

export const generateKlear360FrameCode = (
  klear360Node: Klear360FrameNode,
): TransformFunctionReturnType => {
  return transformFrameOrGroup(klear360Node);
};

export const generateTextNodeCode = (
  klear360Node: Klear360TextNode,
): TransformFunctionReturnType => {
  return transformTextNode(klear360Node);
};

export const generateGroupNodeCode = (
  klear360Node: Klear360GroupNode,
): TransformFunctionReturnType => {
  return transformFrameOrGroup(klear360Node);
};
