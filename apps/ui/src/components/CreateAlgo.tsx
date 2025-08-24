'use client';

import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { useCallback } from 'react';
import { useDeployedContractContext } from '../hooks';
import { Button } from './Button';

export const CreateAlgo = () => {
  const counterApiProvider = useDeployedContractContext();
  const onCreateContract = useCallback(() => counterApiProvider.resolve(), [counterApiProvider]);
  const onJoinContract = useCallback(
    (contractAddress: ContractAddress) => counterApiProvider.resolve(contractAddress),
    [counterApiProvider],
  );

  return <Button onClick={onCreateContract}>CREATE ALGO</Button>;
};
