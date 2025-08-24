import { DeployedMedRecordsAPI, MedRecordDerivedState } from '@/api';
import { MedRecordDeployment } from '@/contexts';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export const ShowAddress = ({
  deploy,
  setDeployedMedRecordAPI,
}: {
  deploy: Observable<MedRecordDeployment>;
  deployedMedRecordAPI: DeployedMedRecordsAPI | undefined;
  setDeployedMedRecordAPI: Dispatch<SetStateAction<DeployedMedRecordsAPI | undefined>>;
}) => {
  const [medRecordDeployment, setMedRecordDeployment] = useState<MedRecordDeployment>();
  const [_, setErrorMessage] = useState<string>();
  const [__, setMedRecordState] = useState<MedRecordDerivedState>();
  const [___, setIsWorking] = useState(!!deploy);

  useEffect(() => {
    if (!deploy) {
      return;
    }

    const subscription = deploy.subscribe(setMedRecordDeployment);

    return () => {
      subscription.unsubscribe();
    };
  }, [deploy]);

  useEffect(() => {
    if (!medRecordDeployment) {
      return;
    }
    if (medRecordDeployment.status === 'in-progress') {
      return;
    }

    setIsWorking(false);

    if (medRecordDeployment.status === 'failed') {
      setErrorMessage(
        medRecordDeployment.error.message.length
          ? medRecordDeployment.error.message
          : 'Encountered an unexpected error.',
      );
      return;
    }

    // We need the MedRecord API as well as subscribing to its `state$` observable, so that we can invoke
    // the `post` and `takeDown` methods later.
    setDeployedMedRecordAPI(medRecordDeployment.api);
    const subscription = medRecordDeployment.api.state$.subscribe(setMedRecordState);

    return () => {
      subscription.unsubscribe();
    };
  }, [medRecordDeployment, setIsWorking, setErrorMessage, setDeployedMedRecordAPI]);

  return <div></div>;
};
