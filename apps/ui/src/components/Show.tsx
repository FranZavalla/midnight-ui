import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { CounterDerivedState, DeployedCounterAPI } from '../api';
import { BoardDeployment } from '../contexts';

export const Show = ({ deploy }: { deploy: Observable<BoardDeployment> }) => {
  const [boardDeployment, setBoardDeployment] = useState<BoardDeployment>();
  const [deployedBoardAPI, setDeployedBoardAPI] = useState<DeployedCounterAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [boardState, setBoardState] = useState<CounterDerivedState>();
  const [messagePrompt, setMessagePrompt] = useState<string>();
  const [isWorking, setIsWorking] = useState(!!deploy);

  useEffect(() => {
    if (!deploy) {
      return;
    }

    const subscription = deploy.subscribe(setBoardDeployment);

    console.log('USE EFFECT 1', deploy, subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [deploy]);

  useEffect(() => {
    if (!boardDeployment) {
      console.log('NO BOARD DEPLOYMENT');
      return;
    }
    if (boardDeployment.status === 'in-progress') {
      console.log('BOARD DEPLOYMENT IN PROGRESS');
      return;
    }

    console.log('USE EFFECT 2', boardDeployment);

    setIsWorking(false);

    if (boardDeployment.status === 'failed') {
      console.log('FAILED!!');
      setErrorMessage(
        boardDeployment.error.message.length ? boardDeployment.error.message : 'Encountered an unexpected error.',
      );
      return;
    }

    // We need the board API as well as subscribing to its `state$` observable, so that we can invoke
    // the `post` and `takeDown` methods later.
    setDeployedBoardAPI(boardDeployment.api);
    const subscription = boardDeployment.api.state$.subscribe(setBoardState);

    console.log('USE EFFECT 3', subscription);
    return () => {
      subscription.unsubscribe();
    };
  }, [boardDeployment, setIsWorking, setErrorMessage, setDeployedBoardAPI]);

  return (
    <div>
      {!deploy && <p>No deploy</p>}

      {deploy && <div>{deployedBoardAPI?.deployedContractAddress ?? 'loading...'}</div>}
    </div>
  );
};
