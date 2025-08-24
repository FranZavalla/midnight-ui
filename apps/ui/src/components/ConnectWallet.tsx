'use client';
import { DAppConnectorWalletAPI } from '@midnight-ntwrk/dapp-connector-api';
import { Button } from './Button';

export const ConnectWallet = () => {
  return (
    <Button
      onClick={async () => {
        const midnight = (window as any).midnight;
        const wallet: DAppConnectorWalletAPI = await midnight?.mnLace?.enable();
        console.log(await midnight.mnLace.isEnabled());
        console.log(wallet.state());
      }}
    >
      Connect Wallet
    </Button>
  );
};
