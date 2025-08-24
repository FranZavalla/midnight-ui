import React, { type PropsWithChildren, createContext } from 'react';
import { type DeployedContractAPIProvider, BrowserDeployedMedRecordManager } from './BrowserDeployedMedRecordManager';

export const DeployedMedRecordContext = createContext<DeployedContractAPIProvider | undefined>(undefined);

export type DeployedMedRecordProviderProps = PropsWithChildren<{}>;

export const DeployedMedRecordProvider: React.FC<Readonly<DeployedMedRecordProviderProps>> = ({ children }) => (
  <DeployedMedRecordContext.Provider value={new BrowserDeployedMedRecordManager()}>
    {children}
  </DeployedMedRecordContext.Provider>
);
