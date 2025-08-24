import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { Input } from './Input';
import { JoinInstance } from './JoinInstance';

interface DoctorProps {
  data: ContractData;
  setData: Dispatch<SetStateAction<ContractData>>;
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}

export const Doctor = ({ data, setData, setRole }: DoctorProps) => {
  const [textData, setTextData] = useState<boolean>(false);
  const [money, setMoney] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const [clientPub, setClientPub] = useState<string>('');

  const randomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  };

  const handleChange = () => {
    setTextData((prev) => !prev);
  };

  const handleUploadData = () => {
    setData((prev) => prev.set(clientPub, [0, textData]));
  };

  const handleMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMoney(Number(e.target.value));
  };

  const handlePayMoney = () => {
    setData((prev) => {
      const newMap = new Map();

      prev.forEach((elem, index) => {
        newMap.set(index, [elem[0] + money, elem[1]]);
      });

      return newMap;
    });
  };

  console.log(data);
  if (!value)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50 p-4">
        <h1 className="text-4xl font-bold text-blue-600">DOCTOR</h1>
        <div className="w-full max-w-md">
          <JoinInstance setContract={setValue} />
        </div>
        <Button color="error" onClick={() => setRole(undefined)}>
          BACK
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600">DOCTOR</h1>
      <div>Do your thing</div>

      <div className="flex w-full gap-3 justify-center ">
        <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-full max-w-md">
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
                checked={textData}
                onChange={handleChange}
                className="w-10 h-10 text-blue-600 border-gray-300 rounded focus:ring-4 focus:ring-blue-400"
              />
              <span className="text-gray-700 font-medium">Has condition</span>
            </label>
          </div>
          <Button onClick={handleUploadData}>Upload data</Button>
        </div>

        <div className="flex flex-col items-center gap-2 p-4 border rounded shadow bg-white w-full max-w-md">
          <Input
            name="doc money"
            type="number"
            placeholder="Add money here"
            value={money}
            onChange={handleMoneyChange}
          />
          <Button color="secondary" onClick={handlePayMoney}>
            Add money
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-600 mt-2">Random Bytes: {randomBytes(32).toString()}</div>
      <Button color="error" onClick={() => setRole(undefined)}>
        BACK
      </Button>
    </div>
  );
};
