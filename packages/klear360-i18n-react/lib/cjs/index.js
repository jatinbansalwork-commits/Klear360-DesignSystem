'use strict';

var React = require('react');
var core = require('@klear/i18n/core');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              },
        );
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/ _interopNamespaceDefault(React);

const I18nContext = React.createContext({});
/**
 * A simple ReactContext Provider built for React apps that deals with i18n state APIs.
 * Include this Provider at the topmost level in your component tree.
 *
 * ========= USAGE =========
 * <I18nProvider>
 *  <YourComponent />
 * </I18nProvider>
 */
const I18nProvider = ({ children, initData = {} }) => {
  // initialising state by an initializer function so as to call setState method here.
  // This is required as we need to run setState method only once and useEffect doesn't run on SSR.
  const [i18nState, setI18nState] = React.useState(() => {
    const data = Object.assign(Object.assign({}, core.getState()), initData);
    core.setState(data);
    return data;
  });
  /**
   * This function sets new data into i18nState.
   * After setting context state, it triggers the setState API to update the global state
   * The logic here can be expanded to perform operations specific to i18n use case. For eg,
   * - finding locale and setting the initial state
   * - storing i18nState in localStorage to retain user preferences
   *
   * @param data: new i18nState to set in Context
   */
  const updateI18nState = (data) => {
    setI18nState((i18nState) => Object.assign(Object.assign({}, i18nState), data));
    core.setState(Object.assign(Object.assign({}, i18nState), data));
  };
  const contextValue = {
    i18nState,
    setI18nState: updateI18nState,
  };
  return React__namespace.createElement(I18nContext.Provider, { value: contextValue }, children);
};
/**
 *
 * React hook to get the value (i18nState, setI18nState) within I18nProvider Context
 *
 * ========= USAGE =========
 * const { i18nState, setI18nState } = useI18nContext()
 *
 */
const useI18nContext = () => {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within a I18nProvider');
  }
  return context;
};

exports.I18nProvider = I18nProvider;
exports.useI18nContext = useI18nContext;
