import { Dispatch, SetStateAction, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export const JoinInstance = ({ setContract }: { setContract: Dispatch<SetStateAction<string>> }) => {
  const [value, setValue] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Input
        placeholder="Enter your hash"
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
