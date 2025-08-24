import { DeployedMedRecordsAPI } from '@/api';
import { MedRecordDeployment } from '@/contexts';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { useDeployedContractContext } from '../hooks/useDeployedMedRecordContext';
import { Button } from './Button';
import { ShowAddress } from './ShowAddress';

export const CreateContract = ({
  setLoading,
  deployedMedRecordAPI,
  setDeployedMedRecordAPI,
}: {
  setLoading: Dispatch<SetStateAction<boolean>>;
  deployedMedRecordAPI: DeployedMedRecordsAPI | undefined;
  setDeployedMedRecordAPI: Dispatch<SetStateAction<DeployedMedRecordsAPI | undefined>>;
}) => {
  const counterApiProvider = useDeployedContractContext();
  const onCreateContract = useCallback(() => {
    setLoading(true);
    counterApiProvider.resolve();
  }, [counterApiProvider]);

  const [MedRecordDeployments, setMedRecordDeployments] = useState<Array<Observable<MedRecordDeployment>>>([]);

  useEffect(() => {
    const subscription = counterApiProvider.medRecordDeployments$.subscribe(setMedRecordDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [counterApiProvider]);

  return (
    <div>
      <Button onClick={onCreateContract}>CREATE</Button>
      <div>
        {MedRecordDeployments.map((deploy, id) => (
          <div data-testid={`MedRecord-${id}`} key={`MedRecord-${id}`}>
            <ShowAddress
              deployedMedRecordAPI={deployedMedRecordAPI}
              setDeployedMedRecordAPI={setDeployedMedRecordAPI}
              deploy={deploy}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
