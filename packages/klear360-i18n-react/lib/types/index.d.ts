import * as React from 'react';
import { getState } from '@klear/i18n/core';

interface ContextValueType {
  i18nState?: ReturnType<typeof getState>;
  setI18nState?: (data: Record<string, unknown>) => void;
}
/**
 * A simple ReactContext Provider built for React apps that deals with i18n state APIs.
 * Include this Provider at the topmost level in your component tree.
 *
 * ========= USAGE =========
 * <I18nProvider>
 *  <YourComponent />
 * </I18nProvider>
 */
declare const I18nProvider: ({
  children,
  initData,
}: {
  children: JSX.Element;
  initData?: Record<string, unknown> | undefined;
}) => React.JSX.Element;
/**
 *
 * React hook to get the value (i18nState, setI18nState) within I18nProvider Context
 *
 * ========= USAGE =========
 * const { i18nState, setI18nState } = useI18nContext()
 *
 */
declare const useI18nContext: () => ContextValueType;

export { I18nProvider, useI18nContext };
