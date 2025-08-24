'use client';
import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import { Button } from './Button';

export const ConnectWallet = () => {
  return (
    <Button
      onClick={async () => {
        try {
          const midnight = window.midnight;
          if (!midnight) throw new Error('Midnight not found');
          const wallet: DAppConnectorWalletAPI = await midnight?.mnLace?.enable();
          console.log(await midnight.mnLace.isEnabled());
          console.log(wallet.state());
        } catch (error) {
          console.error(error);
        }
      }}
    >
      Connect Wallet
    </Button>
  );
};
