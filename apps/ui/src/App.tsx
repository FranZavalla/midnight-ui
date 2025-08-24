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

import { Box } from '@mui/material';
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

  const handleGovClick = () => setRole(UserRole.GOV);
  const handleDoctorClick = () => setRole(UserRole.DOC);
  const handlePatientClick = () => setRole(UserRole.PAT);

  if (role === UserRole.GOV) {
    return (
      <Box sx={{ background: '#fff', minHeight: '100vh' }}>
        <Gov data={data} setData={setData} setRole={setRole} />
      </Box>
    );
  } else if (role === UserRole.DOC) {
    return (
      <Box sx={{ background: '#fff', minHeight: '100vh' }}>
        <Doctor data={data} setData={setData} setRole={setRole} />
      </Box>
    );
  } else if (role === UserRole.PAT) {
    return (
      <Box sx={{ background: '#fff', minHeight: '100vh' }}>
        <Patient data={data} setData={setData} setRole={setRole} />
      </Box>
    );
  }

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      <div className="w-5 h-5 bg-cyan-500" />
      <ConnectWallet />
      <Button onClick={handleGovClick}>I'm a government official</Button>
      <Button onClick={handleDoctorClick}>I'm a doctor</Button>
      <Button onClick={handlePatientClick}>I'm a patient</Button>
    </Box>
  );
};

export default App;
