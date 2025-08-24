'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { Input } from './Input';
import { JoinInstance } from './JoinInstance';

export const Gov = ({
  setRole,
}: {
  data: ContractData;
  setData: Dispatch<SetStateAction<ContractData>>;
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}) => {
  const [value, setValue] = useState<string>('');
  const [doctor, setDoctor] = useState<string>('');
  if (!value) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-blue-700">GOVERNMENT</h1>
        <h2 className="text-xl text-gray-600">Do your thing</h2>

        <div className="flex gap-5 w-full justify-center">
          <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-full max-w-md">
            <Button className="mb-2">CREATE</Button>
            <div className="text-lg text-gray-700">Address: {value}</div>
          </div>

          <JoinInstance setContract={setValue} />
        </div>
        <Button color="error" onClick={() => setRole(undefined)}>
          BACK
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-blue-700">GOVERNMENT</h1>

      <div className="flex flex-col w-full max-w-md gap-2">
        <Input
          name="gov"
          placeholder="Enter your new doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="mb-2"
        />
        <Button color="primary">ADD DOCTOR</Button>
      </div>
      <Button color="error" onClick={() => setRole(undefined)}>
        BACK
      </Button>
    </div>
  );
};
