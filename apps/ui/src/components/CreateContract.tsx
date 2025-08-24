import { DeployedCounterAPI } from '@/api';
import { BoardDeployment } from '@/contexts';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { useDeployedContractContext } from '../hooks/useDeployedBoardContext';
import { Button } from './Button';
import { ShowAddress } from './ShowAddress';

export const CreateContract = ({
  deployedBoardAPI,
  setDeployedBoardAPI,
}: {
  deployedBoardAPI: DeployedCounterAPI | undefined;
  setDeployedBoardAPI: Dispatch<SetStateAction<DeployedCounterAPI | undefined>>;
}) => {
  const [showButton, setShowButton] = useState(true);
  const counterApiProvider = useDeployedContractContext();
  const onCreateContract = useCallback(() => {
    counterApiProvider.resolve();
    setShowButton(false);
  }, [counterApiProvider]);

  const [boardDeployments, setBoardDeployments] = useState<Array<Observable<BoardDeployment>>>([]);

  useEffect(() => {
    const subscription = counterApiProvider.boardDeployments$.subscribe(setBoardDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [counterApiProvider]);

  return (
    <div>
      {showButton && <Button onClick={onCreateContract}>CREATE</Button>}
      <div>
        {boardDeployments.map((deploy, id) => (
          <div data-testid={`board-${id}`} key={`board-${id}`}>
            <ShowAddress
              deployedBoardAPI={deployedBoardAPI}
              setDeployedBoardAPI={setDeployedBoardAPI}
              deploy={deploy}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
