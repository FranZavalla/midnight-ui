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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1>GOVERNMENT</h1>
        <Button onClick={() => setRole(undefined)}>BACK</Button>
        <div>Do your thing</div>
        <JoinInstance setContract={setValue} />
        <Button>Create</Button>
        Address: {value}
      </div>
    );
  }
  return (
    <div>
      <h1>GOVERNMENT</h1>
      <Button onClick={() => setRole(undefined)}>BACK</Button>
      <Input
        placeholder="Enter your new doctor"
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        name="hash"
        className="mb-4 mt-4"
      />
      <Button onClick={() => {}}>ADD DOCTOR</Button>
    </div>
  );
};
