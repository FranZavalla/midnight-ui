import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { ContractData, UserRole } from '../App';
import { Button } from './Button';
import { JoinInstance } from './JoinInstance';

interface DoctorProps {
  data: ContractData;
  setData: Dispatch<SetStateAction<ContractData>>;
  setRole: Dispatch<SetStateAction<UserRole | undefined>>;
}

export const Doctor = ({ data, setData, setRole }: DoctorProps) => {
  const [textData, setTextData] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [money, setMoney] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const [clientPub, setClientPub] = useState<string>('');

  const randomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextData((prev) => !prev);
  };

  const handleUploadData = () => {
    setData((prev) => prev.set(clientPub, [0, textData]));
    setIndex((prev) => prev + 1);
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
      <>
        <h1>DOCTOR</h1>
        <Button onClick={() => setRole(undefined)}>BACK</Button>
        <JoinInstance setContract={setValue} />
      </>
    );

  return (
    <div>
      <h1>DOCTOR</h1>
      <Button onClick={() => setRole(undefined)}>BACK</Button>
      <Button onClick={handleUploadData}>Upload data</Button>
      <input
        type="string"
        placeholder="add your client's public"
        value={clientPub}
        onChange={(e) => setClientPub(e.target.value)}
      />

      <input type="checkbox" onChange={handleChange} checked={textData} />

      <Button onClick={handlePayMoney}>Add money</Button>
      <input type="number" placeholder="add money here" value={money} onChange={handleMoneyChange} />

      {randomBytes(32)}
    </div>
  );
};
