'use client';
import { Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { Input } from './Input';
import { JoinInstance } from './JoinInstance';

export const Patient = ({
  data,
  setData,
  setRole,
}: {
  data: ContractData;
  setData: Dispatch<SetStateAction<ContractData>>;
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}) => {
  const [value, setValue] = useState<string>('');
  const [seeState, setSeeState] = useState<boolean>(false);
  const [contract, setContract] = useState<string>('');

  if (!contract)
    return (
      <>
        <h1>PATIENT</h1>
        <Button onClick={() => setRole(undefined)}>BACK</Button>
        <JoinInstance setContract={setContract} />
      </>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1>PATIENT</h1>
      <Button onClick={() => setRole(undefined)}>BACK</Button>
      <div>Do your thing</div>
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
      <Button
        onClick={() => {
          setSeeState((prev) => !prev);
        }}
      >
        {!seeState ? 'See balance' : 'Hide balance'}
      </Button>
      {seeState &&
        (data.has(value) ? (
          <div>
            <div>Hash: {value}</div>
            <div>Amount: {data.get(value)?.[0]}</div>
            <div>Condition: {data.get(value)?.[1] ? 'True' : 'False'}</div>
          </div>
        ) : (
          <div>Hash not found</div>
        ))}
    </div>
  );
};
