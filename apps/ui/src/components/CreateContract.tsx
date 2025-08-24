import { useCallback } from 'react';
import { useDeployedContractContext } from '../hooks/useDeployedMedRecordContext';
import { Button } from './Button';

export const CreateContract = () => {
  const counterApiProvider = useDeployedContractContext();
  const onCreateContract = useCallback(() => {
    counterApiProvider.resolve();
  }, [counterApiProvider]);

  return <Button onClick={onCreateContract}>CREATE</Button>;
};
