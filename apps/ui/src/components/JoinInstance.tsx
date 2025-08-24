import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export const JoinInstance = ({ setContract }: { setContract: Dispatch<SetStateAction<string>> }) => {
  const [value, setValue] = useState<string>('');

  return (
    <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-full max-w-md">
      <Input
        placeholder="Enter your gov hash"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        name="hash"
        className="mb-4 mt-4"
      />
      <Button
        onClick={() => {
          setContract(value);
        }}
      >
        Join
      </Button>
    </div>
  );
};
