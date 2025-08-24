'use client';
import { DeployedMedRecordsAPI } from '@/api';
import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { CreateContract } from './CreateContract';
import { Input } from './Input';
import { JoinContract } from './JoinContract';

export const Gov = ({
  setData,
  setRole,
}: {
  setData: Dispatch<SetStateAction<ContractData>>;
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}) => {
  const [deployedMedRecordAPI, setDeployedMedRecordAPI] = useState<DeployedMedRecordsAPI>();
  const [contractHash, setContractHash] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  const [money, setMoney] = useState<number>(0);
  const [patient, setPatient] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMoney(Number(e.target.value));
  };

  const handlePayMoney = () => {
    setData((prev) => {
      const newData = new Map(prev);
      if (newData.has(patient)) {
        if (!money) {
          setError('Please enter a valid amount');
        } else {
          const [currentMoney, currentCondition] = newData.get(patient)!;
          newData.set(patient, [currentMoney + money, currentCondition]);
        }
      } else {
        setError('Patient does not exist');
      }

      return newData;
    });
  };

  const handleAddDoctor = async () => {
    if (!deployedMedRecordAPI) {
      console.log('NO API');
    }

    await deployedMedRecordAPI?.grantVerifier(doctor);
  };

  if (!deployedMedRecordAPI?.deployedContractAddress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-red-700">GOVERNMENT</h1>
        <h2 className="text-xl text-gray-600">Do your thing</h2>

        <div className="flex gap-5 w-full justify-center">
          <div className="flex flex-col items-center justify-center gap-2 p-4 border rounded shadow bg-white w-full max-w-md">
            <CreateContract
              deployedMedRecordAPI={deployedMedRecordAPI}
              setDeployedMedRecordAPI={setDeployedMedRecordAPI}
            />
          </div>

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
              hash={contractHash}
              setDeployedMedRecordAPI={setDeployedMedRecordAPI}
            />
          </div>
        </div>
        <Button color="error" onClick={() => setRole(undefined)}>
          BACK
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
      <div>Gov Address: {deployedMedRecordAPI?.deployedContractAddress} </div>

      <h1 className="text-4xl font-bold text-red-700">GOVERNMENT</h1>

      <div className="flex gap-5">
        <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-auto">
          <Input
            name="gov-doc"
            placeholder="Enter your new doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="mb-2"
          />
          <Button color="primary" onClick={handleAddDoctor}>
            Add doctor
          </Button>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-auto">
          <Input
            name="gov-pat"
            placeholder="Enter a patient to pay"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            className="mb-2"
            error={!patient ? error : ''}
          />
          <Input
            name="doc money"
            type="number"
            placeholder="Add money here"
            value={money}
            onChange={handleMoneyChange}
            className="mb-2"
            error={!money ? error : ''}
          />
          <Button color="secondary" onClick={handlePayMoney}>
            Add money
          </Button>
        </div>
      </div>
      <Button color="error" onClick={() => setRole(undefined)}>
        BACK
      </Button>
    </div>
  );
};
