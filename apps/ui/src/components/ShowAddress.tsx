import { CounterDerivedState, DeployedCounterAPI } from '@/api';
import { BoardDeployment } from '@/contexts';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export const ShowAddress = ({
  deploy,
  deployedBoardAPI,
  setDeployedBoardAPI,
}: {
  deploy: Observable<BoardDeployment>;
  deployedBoardAPI: DeployedCounterAPI | undefined;
  setDeployedBoardAPI: Dispatch<SetStateAction<DeployedCounterAPI | undefined>>;
}) => {
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  // const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedCounterAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<CounterDerivedState>();
  const [isWorking, setIsWorking] = useState(!!deploy);

  useEffect(() => {
    if (!deploy) {
      return;
    }

    const subscription = deploy.subscribe(setBoardDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [deploy]);

  useEffect(() => {
    if (!boardDeployment) {
      return;
    }
    if (boardDeployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (boardDeployment.status === 'failed') {
      setErrorMessage(
        boardDeployment.error.message.length ? boardDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }

    // We need the board API as well as subscribing to its `state$` observable, so that we can invoke
    // the `post` and `takeDown` methods later.
    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);

    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment, setIsWorking, setErrorMessage, setDeployedBoardAPI]);

  return (
    <div>
      <h2>Address: </h2>
      {deploy && <div>{deployedBoardAPI?.deployedContractAddress ?? 'loading...'}</div>}
    </div>
  );
};
