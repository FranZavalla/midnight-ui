import { DeployedCounterAPI } from '@/api';
import { BoardDeployment } from '@/contexts';
import { ContractAddress } from '@midnight-ntwrk/zswap';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { useDeployedContractContext } from '../hooks/useDeployedBoardContext';
import { Button } from './Button';
import { ShowAddress } from './ShowAddress';

export const JoinContract = ({
  hash,
  deployedBoardAPI,
  setDeployedBoardAPI,
}: {
  hash: string;
  deployedBoardAPI: DeployedCounterAPI | undefined;
  setDeployedBoardAPI: Dispatch<SetStateAction<DeployedCounterAPI | undefined>>;
}) => {
  const counterApiProvider = useDeployedContractContext();
  const onJoinContract = useCallback(
    (contractAddress: ContractAddress) => {
      counterApiProvider.resolve(contractAddress);
    },
    [counterApiProvider],
  );

  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

  useEffect(() => {
    const subscription = counterApiProvider.boardDeployments$.subscribe(setBoardDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [counterApiProvider]);

  return (
    <div>
      <Button onClick={() => onJoinContract(hash)}>JOIN</Button>
      <div>
        {boardDeployments.map((deploy, id) => (
          <div data-testid={`board-${id}`} key={`board-${id}`}>
            <ShowAddress
              deploy={deploy}
              deployedBoardAPI={deployedBoardAPI}
              setDeployedBoardAPI={setDeployedBoardAPI}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
