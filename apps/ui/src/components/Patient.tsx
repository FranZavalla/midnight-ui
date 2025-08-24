'use client';
import { DeployedMedRecordsAPI } from '@/api';
import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import { Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { Input } from './Input';
import { JoinContract } from './JoinContract';

export const Patient = ({
  setRole,
  wallet,
}: {
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
  wallet: DAppConnectorWalletAPI;
}) => {
  const [value, setValue] = useState<string>('');
  const [contractHash, setContractHash] = useState<string>('');
  const [deployedMedRecordAPI, setDeployedMedRecordAPI] = useState<DeployedMedRecordsAPI>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ContractData>();
  const [error, setError] = useState<string>('');

  const handleLookup = async () => {
    const state = await wallet.state();
    const asd = await deployedMedRecordAPI?.lookupData(state.address);
    if (asd) {
      console.log(asd);
    }
    // setData(asd);
    else setError('Data not found');
  };

  if (!deployedMedRecordAPI?.deployedContractAddress)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-blue-600">PATIENT</h1>
        <div className="w-full max-w-md">
          <Input
            placeholder="Enter your gov hash"
            value={contractHash}
            onChange={(e) => setContractHash(e.target.value)}
            name="hash"
            className="mb-4 mt-4"
            loading={loading}
          />
          <JoinContract
            setLoading={setLoading}
            deployedMedRecordAPI={deployedMedRecordAPI}
            setDeployedMedRecordAPI={setDeployedMedRecordAPI}
            hash={contractHash}
          />
        </div>
        <Button onClick={() => setRole(undefined)}>BACK</Button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center gap-4 p-6 bg-gray-50">
      <div>Gov Address: {deployedMedRecordAPI?.deployedContractAddress} </div>

      <h1 className="text-4xl font-bold text-blue-600">PATIENT</h1>
      <div>Do your thing</div>
      <div className="flex items-center gap-2 p-4 border rounded shadow bg-white w-auto">
        <Input
          placeholder="Enter your hash"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="hash"
          className="mb-4 mt-4"
        />
        <Button
          onClick={() => {
            setData((prev) => {
              const newData = new Map(prev);
              newData.set(value, [0, true]);
              return newData;
            });
          }}
        >
          Claim
        </Button>
        <Button onClick={handleLookup}>{'See balance'}</Button>
      </div>
      {data ? (
        <div className="flex gap-2">
          <div className="font-bold">Hash:</div>
          {value}&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="font-bold">Amount:</div>
          {data.get(value)?.[0]}&nbsp;&nbsp;&nbsp;&nbsp;
          <div className="font-bold">Condition:</div>
          {data.get(value)?.[1] ? 'True' : 'False'}
        </div>
      ) : (
        <div>Hash not found</div>
      )}
      <Button onClick={() => setRole(undefined)}>BACK</Button>
    </div>
  );
};
