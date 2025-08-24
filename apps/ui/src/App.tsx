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

/**
 * The root bulletin board application component.
 *
 * @remarks
 * The {@link App} component requires a `<DeployedBoardProvider />` parent in order to retrieve
 * information about current bulletin board deployments.
 *
 * @internal
 */
const App: React.FC = () => {
  const [isDoctor, setIsDoctor] = useState<boolean | undefined>(undefined);
  // const boardApiProvider = useDeployedBoardContext();
  // const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

  // useEffect(() => {
  //   const subscription = boardApiProvider.boardDeployments$.subscribe(setBoardDeployments);

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [boardApiProvider]);

  const handleDoctorClick = () => {
    setIsDoctor(true);
  };

  const handlePatientClick = () => {
    setIsDoctor(false);
  };

  if (isDoctor) {
    return <div>DOGTOR!</div>;
  } else if (isDoctor === false) {
    return <div>NO DOGTOR</div>;
  }

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      {/* <MainLayout> */}
      <ConnectWallet />
      <Button onClick={handleDoctorClick}>I'm a doctor</Button>
      <Button onClick={handlePatientClick}>I'm a patient</Button>
      {/* {boardDeployments.map((boardDeployment, idx) => (
          <div data-testid={`board-${idx}`} key={`board-${idx}`}>
            <Board boardDeployment$={boardDeployment} />
          </div>
        ))}
        <div data-testid="board-start">
          <Board />
        </div> */}
      {/* </MainLayout> */}
    </Box>
  );
};

export default App;
