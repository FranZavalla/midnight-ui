import React, { type PropsWithChildren, createContext } from 'react';
import { type DeployedContractAPIProvider, BrowserDeployedBoardManager } from './BrowserDeployedBoardManager';

export const DeployedBoardContext = createContext<DeployedContractAPIProvider | undefined>(undefined);

export type DeployedBoardProviderProps = PropsWithChildren<{}>;

export const DeployedBoardProvider: React.FC<Readonly<DeployedBoardProviderProps>> = ({ children }) => (
  <DeployedBoardContext.Provider value={new BrowserDeployedBoardManager()}>{children}</DeployedBoardContext.Provider>
);
