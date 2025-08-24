import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import React, { useState } from 'react';
import { Button } from './components/Button';
import { ConnectWallet } from './components/ConnectWallet';
import { Doctor } from './components/Doctor';
import { Gov } from './components/Gov';
import { Patient } from './components/Patient';

type Money = number;
type Condition = boolean;
type Key = string;
export type ContractData = Map<Key, [Money, Condition]>;

export enum UserRole {
  GOV,
  DOC,
  PAT,
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [wallet, setWallet] = useState<DAppConnectorWalletAPI | undefined>(undefined);
  const [hover, setHover] = useState<UserRole | undefined>(undefined);

  const handleGovClick = () => setRole(UserRole.GOV);
  const handleDoctorClick = () => setRole(UserRole.DOC);
  const handlePatientClick = () => setRole(UserRole.PAT);

  return (
    <>
      {role === UserRole.GOV && <Gov setRole={setRole} />}
      {role === UserRole.DOC && <Doctor setRole={setRole} />}
      {role === UserRole.PAT && <Patient setRole={setRole} wallet={wallet!} />}
      {role === undefined && (
        <div className="h-screen text-center flex flex-col items-center justify-center gap-10">
          <div className="flex flex-col gap-0">
            <div className="text-5xl font-bold">Select your role</div>&nbsp;
            {!wallet && <div className="text-2xl">or connect your wallet</div>}
          </div>
          <div className="flex flex-col gap-5 justify-center items-center">
            {!wallet && <ConnectWallet setWallet={setWallet} />}
            <div className="flex gap-3 justify-center">
              <Button
                className={'w-80 ' + (wallet && 'hover:text-red-700 hover:border-red-700')}
                onClick={handleGovClick}
                disabled={hover === UserRole.GOV && !wallet}
                onMouseEnter={() => setHover(UserRole.GOV)}
                onMouseLeave={() => setHover(undefined)}
              >
                {hover === UserRole.GOV && !wallet ? 'Connect your wallet first' : "I'm a government official"}
              </Button>
              <Button
                className={'w-80 ' + (wallet && 'hover:text-green-700 hover:border-green-700')}
                onClick={handleDoctorClick}
                disabled={hover === UserRole.DOC && !wallet}
                onMouseEnter={() => setHover(UserRole.DOC)}
                onMouseLeave={() => setHover(undefined)}
              >
                {hover === UserRole.DOC && !wallet ? 'Connect your wallet first' : "I'm a doctor"}
              </Button>
              <Button
                className={'w-80 ' + (wallet && 'hover:text-blue-700 hover:border-blue-700')}
                onClick={handlePatientClick}
                disabled={hover === UserRole.PAT && !wallet}
                onMouseEnter={() => setHover(UserRole.PAT)}
                onMouseLeave={() => setHover(undefined)}
              >
                {hover === UserRole.PAT && !wallet ? 'Connect your wallet first' : "I'm a patient"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
