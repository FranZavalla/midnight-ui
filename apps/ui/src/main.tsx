// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * A Single Page Application (SPA) for connecting to and managing deployed
 * bulletin boards.
 *
 * @packageDocumentation
 */
import './globals';

import '@midnight-ntwrk/dapp-connector-api';
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import * as pino from 'pino';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DeployedBoardProvider } from './contexts';
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
      <DeployedBoardProvider>
        <App />
      </DeployedBoardProvider>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found in index.html');
}
