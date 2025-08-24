import './globals';

import '@midnight-ntwrk/dapp-connector-api';
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DeployedMedRecordProvider } from './contexts';
import './index.css';

const networkId = import.meta.env.VITE_NETWORK_ID as NetworkId;
setNetworkId(networkId);

export const logger = pino.pino({
  level: import.meta.env.VITE_LOGGING_LEVEL as string,
});

logger.trace(`networkId = ${networkId}`);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <DeployedMedRecordProvider>
        <App />
      </DeployedMedRecordProvider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found in index.html');
}
