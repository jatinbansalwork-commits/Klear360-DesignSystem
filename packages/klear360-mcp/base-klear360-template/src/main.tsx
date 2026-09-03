import ReactDOM from 'react-dom/client';
import { LazyMotion } from 'framer-motion';
import { createGlobalStyle } from 'styled-components';
import { Klear360Provider } from '@klear/klear360/components';
import { ErrorBoundary } from 'react-error-boundary';
import { klear360Theme } from '@klear/klear360/tokens';
import '@klear/klear360/fonts.css';

import { ErrorFallback } from './ErrorFallback';
import App from './App';

const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: ${(props) => props.theme.typography.fonts.family.text}
}

h1, h2, h3, h4, h5, h6 {
  font-family: ${(props) => props.theme.typography.fonts.family.heading};
}
`;

const loadFeatures = () => import('./features.ts').then((res) => res.default);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Klear360Provider themeTokens={klear360Theme} colorScheme="light">
    <LazyMotion strict features={loadFeatures}>
      <GlobalStyles />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, info) => {
          console.error(`[ErrorBoundary]: ${error.message}\nError Stack: ${info.componentStack}`);
        }}
      >
        <App />
      </ErrorBoundary>
    </LazyMotion>
  </Klear360Provider>,
);
