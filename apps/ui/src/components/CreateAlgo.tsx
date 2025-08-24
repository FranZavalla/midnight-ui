'use client';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { BoardDeployment } from '../contexts';
import { useDeployedContractContext } from '../hooks';
import { Button } from './Button';
import { Show } from './Show';

export const CreateAlgo = () => {
  const counterApiProvider = useDeployedContractContext();
  const onCreateContract = useCallback(() => counterApiProvider.resolve(), [counterApiProvider]);
  const onJoinContract = useCallback(
    (contractAddress: ContractAddress) => counterApiProvider.resolve(contractAddress),
    [counterApiProvider],
  );

  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

  useEffect(() => {
    const subscription = counterApiProvider.boardDeployments$.subscribe(setBoardDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [counterApiProvider]);

  useEffect(() => {
    console.log(boardDeployments);
  }, [boardDeployments]);

  return (
    <div>
      <Button onClick={onCreateContract}>CREATE ALGO</Button>
      <div>
        {boardDeployments.map((deploy, id) => (
          <div data-testid={`board-${id}`} key={`board-${id}`}>
            <Show deploy={deploy} />
          </div>
        ))}
      </div>
    </div>
  );
};
