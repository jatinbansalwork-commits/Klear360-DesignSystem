import { attributes, generateHelperCode } from './attributes';
import { indent } from './indent';
import { isJSXValueEmpty } from './isJSXValueEmpty';
import { newLine } from './newLine';
import type { Klear360HelperProps, Klear360Props } from '~/code/types/Klear360';

const filterPropsWithDefaultValues = (
  props: Klear360Props,
  defaultValues: Klear360Props,
): Klear360Props => {
  const filteredProps: Klear360Props = {};
  Object.entries(props).forEach(([key, jsxValue]) => {
    if (!key || isJSXValueEmpty(jsxValue)) {
      return;
    }

    if (
      isJSXValueEmpty(defaultValues[key]) ||
      jsxValue.type !== defaultValues[key].type ||
      jsxValue.value !== defaultValues[key].value
    ) {
      filteredProps[key] = jsxValue;
    }
  });

  return filteredProps;
};

type Options = {
  props: Klear360Props;
  helpers?: Klear360HelperProps;
  defaultValues: Klear360Props;
  children?: string;
};

export const component = (
  componentName: string,
  options: Options = {
    props: {},
    defaultValues: {},
    children: '',
    helpers: {},
  },
): string => {
  const { props, defaultValues, children = '', helpers } = options;

  let code = newLine(`<${componentName}`);

  const filteredProps = filterPropsWithDefaultValues(props, defaultValues);
  const propsLength = Object.keys(filteredProps).length;

  code += attributes(filteredProps);

  const helperCodeEnabled = figma.codegen.preferences.customSettings.helperCodeEnabled;
  if (helperCodeEnabled) code += generateHelperCode(helpers || {});

  const shouldUseNewLine = propsLength > 0;

  if (!children || children.length === 0) {
    code += shouldUseNewLine ? newLine('/>') : '/>';
  } else {
    code += shouldUseNewLine ? newLine('>') : '>';
    code += indent(children.startsWith('\n') ? children : newLine(children));
    code += newLine(`</${componentName}>`);
  }

  return code;
};
