'use client';
import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import { Dispatch, SetStateAction } from 'react';
import { Button } from './Button';

export const ConnectWallet = ({
  setWallet,
}: {
  setWallet: Dispatch<SetStateAction<DAppConnectorWalletAPI | undefined>>;
}) => {
  return (
    <Button
      onClick={async () => {
        try {
          const midnight = window.midnight;
          if (!midnight) throw new Error('Midnight not found');
          const wallet: DAppConnectorWalletAPI = await midnight?.mnLace?.enable();
          console.log(await midnight.mnLace.isEnabled());
          console.log(wallet.state());
          setWallet(wallet);
        } catch (error) {
          console.error(error);
        }
      }}
      className=" font-bold py-3 px-6 rounded-lg bg-white
             shadow-md transition-all duration-300
             hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.7)]
             hover:scale-705 hover:flex hover:justify-center hover:translate-x-92"
    >
      Connect Wallet
    </Button>
  );
};
