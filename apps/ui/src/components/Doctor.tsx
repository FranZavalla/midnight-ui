import { Counter } from 'medical-contract';
import { Dispatch, SetStateAction, useState } from 'react';
import { DeployedMedRecordsAPI, MedRecordsAPI } from '../api';
import { UserRole } from '../App';
import { initializeProviders } from '../contexts/BrowserDeployedMedRecordManager';
import { Button } from './Button';
import { Input } from './Input';
import { JoinContract } from './JoinContract';

interface DoctorProps {
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}

export const Doctor = ({ setRole }: DoctorProps) => {
  const [deployedMedRecordAPI, setDeployedMedRecordAPI] = useState<DeployedMedRecordsAPI>();
  const [condition, setCondition] = useState<boolean>(false);
  const [clientPub, setClientPub] = useState<string>('');
  const [contractHash, setContractHash] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = () => {
    setCondition((prev) => !prev);
  };

  const handleUploadData = async () => {
    if (!deployedMedRecordAPI) {
      console.log('NO API');
      return;
    }

    const providers = await initializeProviders();
    const privState = await MedRecordsAPI.getPrivateState(providers);
    deployedMedRecordAPI.addBeneficiary(Counter.pureCircuits.publicKey(privState.secretKey), condition);
  };

  if (!deployedMedRecordAPI?.deployedContractAddress)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-green-600">DOCTOR</h1>
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
            deployedMedRecordAPI={deployedMedRecordAPI}
            setLoading={setLoading}
            setDeployedMedRecordAPI={setDeployedMedRecordAPI}
            hash={contractHash}
          />
        </div>
        <Button color="error" onClick={() => setRole(undefined)}>
          BACK
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50">
      <div>Gov Address: {deployedMedRecordAPI?.deployedContractAddress} </div>
      <h1 className="text-4xl font-bold text-green-600">DOCTOR</h1>

      <div>Do your thing</div>

      <div className="flex gap-3 justify-center items-center p-4 border rounded shadow bg-white w-auto ">
        <div className="flex gap-3">
          <Input
            name="doc"
            placeholder="Add your client's public"
            value={clientPub}
            onChange={(e) => setClientPub(e.target.value)}
            className="w-full"
          />
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={condition}
              onChange={handleChange}
              className="w-10 h-10 text-green-600 border-gray-300 rounded focus:ring-4 focus:ring-green-400"
            />
            <span className="text-gray-700 font-medium">Has condition</span>
          </label>
          <Button onClick={handleUploadData} className="w-20">
            Upload
          </Button>
        </div>
      </div>
      <Button color="error" onClick={() => setRole(undefined)}>
        BACK
      </Button>
    </div>
  );
};
