import { DeployedMedRecordsAPI } from '@/api';
import { MedRecordDeployment } from '@/contexts';
import { ContractAddress } from '@midnight-ntwrk/zswap';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { useDeployedContractContext } from '../hooks/useDeployedMedRecordContext';
import { Button } from './Button';
import { ShowAddress } from './ShowAddress';

export const JoinContract = ({
  hash,
  setLoading,
  deployedMedRecordAPI,
  setDeployedMedRecordAPI,
}: {
  hash: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  deployedMedRecordAPI: DeployedMedRecordsAPI | undefined;
  setDeployedMedRecordAPI: Dispatch<SetStateAction<DeployedMedRecordsAPI | undefined>>;
}) => {
  const counterApiProvider = useDeployedContractContext();
  const onJoinContract = useCallback(
    (contractAddress: ContractAddress) => {
      counterApiProvider.resolve(contractAddress);
    },
    [counterApiProvider],
  );

  const [medRecordDeployments, setMedRecordDeployments] = useState<Array<Observable<MedRecordDeployment>>>([]);

  useEffect(() => {
    const subscription = counterApiProvider.medRecordDeployments$.subscribe(setMedRecordDeployments);

    return () => {
      subscription.unsubscribe();
    };
  }, [counterApiProvider]);

  return (
    <div>
      <Button
        onClick={() => {
          onJoinContract(hash);
          setLoading(true);
        }}
      >
        JOIN
      </Button>
      <div>
        {medRecordDeployments.map((deploy, id) => (
          <div data-testid={`rec-${id}`} key={`rec-${id}`}>
            <ShowAddress
              deploy={deploy}
              deployedMedRecordAPI={deployedMedRecordAPI}
              setDeployedMedRecordAPI={setDeployedMedRecordAPI}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
