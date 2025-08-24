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

import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import React, { useState } from 'react';
import { Button } from './components/Button';
import { ConnectWallet } from './components/ConnectWallet';
import { Doctor } from './components/Doctor';
import { Gov } from './components/Gov';
import { Patient } from './components/Patient';

type Money = number;
type Condition = boolean;
type Key = string; // esto cambiará?
export type ContractData = Map<Key, [Money, Condition]>;

/**
 * The root bulletin board application component.
 *
 * @remarks
 * The {@link App} component requires a `<DeployedBoardProvider />` parent in order to retrieve
 * information about current bulletin board deployments.
 *
 * @internal
 */

const initData: ContractData = new Map<Key, [Money, Condition]>([
  ['alice', [1200, true]],
  ['bob', [500, false]],
  ['carol', [3000, true]],
  ['dave', [50, false]],
]);

export enum UserRole {
  GOV,
  DOC,
  PAT,
}

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | undefined>(undefined);
  const [data, setData] = useState<ContractData>(initData);
  const [wallet, setWallet] = useState<DAppConnectorWalletAPI | undefined>(undefined);
  const [hover, setHover] = useState(false);

  const handleGovClick = () => setRole(UserRole.GOV);
  const handleDoctorClick = () => setRole(UserRole.DOC);
  const handlePatientClick = () => setRole(UserRole.PAT);

  return (
    <>
      {role === UserRole.GOV && <Gov setData={setData} setRole={setRole} />}
      {role === UserRole.DOC && <Doctor data={data} setData={setData} setRole={setRole} />}
      {role === UserRole.PAT && <Patient data={data} setData={setData} setRole={setRole} />}
      {role === undefined && (
        <div className="h-screen text-center flex flex-col items-center justify-center gap-10">
          <div className="text-5xl font-bold">Select your role</div>
          <div className="flex gap-3 justify-center">
            {!wallet && <ConnectWallet setWallet={setWallet} />}
            <Button
              className={wallet && 'hover:text-red-700 hover:border-red-700'}
              onClick={handleGovClick}
              disabled={!wallet}
            >
              {wallet ? "I'm a government official" : 'Connect wallet first'}
            </Button>
            <Button
              className={wallet && 'hover:text-green-700 hover:border-green-700'}
              onClick={handleDoctorClick}
              disabled={!wallet}
            >
              {wallet ? "I'm a doctor" : 'Connect wallet first'}
            </Button>
            <Button
              className={wallet && 'hover:text-blue-700 hover:border-blue-700'}
              onClick={handlePatientClick}
              disabled={!wallet}
            >
              {wallet ? "I'm a patient" : 'Connect wallet first'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
