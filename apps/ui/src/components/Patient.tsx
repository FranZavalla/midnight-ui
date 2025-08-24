'use client';
import { useState } from 'react';
import { Data } from '../App';
import { Button } from './Button';
import { Input } from './Input';

export const Patient = ({ data, setData }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>> }) => {
  const [value, setValue] = useState<string>('');
  const [seeState, setSeeState] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
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
