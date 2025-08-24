// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import {
  type DAppConnectorAPI,
  type DAppConnectorWalletAPI,
  type ServiceUriConfig,
} from '@midnight-ntwrk/dapp-connector-api';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { pipe as fnPipe } from 'fp-ts/function';
import {
  BehaviorSubject,
  type Observable,
  catchError,
  concatMap,
  filter,
  firstValueFrom,
  interval,
  map,
  of,
  take,
  throwError,
  timeout,
} from 'rxjs';
// import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { type CoinInfo, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  type BalancedTransaction,
  type UnbalancedTransaction,
  createBalancedTx,
} from '@midnight-ntwrk/midnight-js-types';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import semver from 'semver';
import { CounterAPI, CounterCircuitKeys, CounterProviders, DeployedCounterAPI } from '../api';

/**
 * An in-progress bulletin board deployment.
 */
export interface InProgressBoardDeployment {
  readonly status: 'in-progress';
}

/**
 * A deployed bulletin board deployment.
 */
export interface DeployedBoardDeployment {
  readonly status: 'deployed';

  /**
   */
  readonly api: DeployedCounterAPI;
}

/**
 * A failed bulletin board deployment.
 */
export interface FailedBoardDeployment {
  readonly status: 'failed';

  /**
   * The error that caused the deployment to fail.
   */
  readonly error: Error;
}

/**
 * A bulletin board deployment.
 */
export type BoardDeployment = InProgressBoardDeployment | DeployedBoardDeployment | FailedBoardDeployment;

/**
 * Provides access to bulletin board deployments.
 */
export interface DeployedContractAPIProvider {
  /**
   * Gets the observable set of board deployments.
   *
   * @remarks
   * This property represents an observable array of {@link BoardDeployment}, each also an
   * observable. Changes to the array will be emitted as boards are resolved (deployed or joined),
   * while changes to each underlying board can be observed via each item in the array.
   */
  readonly boardDeployments$: Observable<Array<Observable<BoardDeployment>>>;

  /**
   * Joins or deploys a bulletin board contract.
   *
   * @param contractAddress An optional contract address to use when resolving.
   * @returns An observable board deployment.
   *
   * @remarks
   * For a given `contractAddress`, the method will attempt to find and join the identified bulletin board
   * contract; otherwise it will attempt to deploy a new one.
   */
  readonly resolve: (contractAddress?: ContractAddress) => Observable<BoardDeployment>;
}

/**
 * A {@link DeployedContractAPIProvider} that manages bulletin board deployments in a browser setting.
 *
 * @remarks
 * {@link BrowserDeployedBoardManager} configures and manages a connection to the Midnight Lace
 * wallet, along with a collection of additional providers that work in a web-browser setting.
 */
export class BrowserDeployedBoardManager implements DeployedContractAPIProvider {
  readonly #boardDeploymentsSubject: BehaviorSubject<Array<BehaviorSubject<BoardDeployment>>>;
  #initializedProviders: Promise<CounterProviders> | undefined;

  /**
   * Initializes a new {@link BrowserDeployedBoardManager} instance.
   *
   * @param logger The `pino` logger to for logging.
   */
  constructor() {
    this.#boardDeploymentsSubject = new BehaviorSubject<Array<BehaviorSubject<BoardDeployment>>>([]);
    this.boardDeployments$ = this.#boardDeploymentsSubject;
  }

  /** @inheritdoc */
  readonly boardDeployments$: Observable<Array<Observable<BoardDeployment>>>;

  /** @inheritdoc */
  resolve(contractAddress?: ContractAddress): Observable<BoardDeployment> {
    const deployments = this.#boardDeploymentsSubject.value;
    let deployment = deployments.find(
      (deployment) =>
        deployment.value.status === 'deployed' && deployment.value.api.deployedContractAddress === contractAddress,
    );

    if (deployment) {
      return deployment;
    }

    deployment = new BehaviorSubject<BoardDeployment>({
      status: 'in-progress',
    });

    if (contractAddress) {
      void this.joinDeployment(deployment, contractAddress);
    } else {
      void this.deployDeployment(deployment);
    }

    this.#boardDeploymentsSubject.next([...deployments, deployment]);

    return deployment;
  }

  private getProviders(): Promise<CounterProviders> {
    // We use a cached `Promise` to hold the providers. This will:
    //
    // 1. Cache and re-use the providers (including the configured connector API), and
    // 2. Act as a synchronization point if multiple contract deploys or joins run concurrently.
    //    Concurrent calls to `getProviders()` will receive, and ultimately await, the same
    //    `Promise`.
    return this.#initializedProviders ?? (this.#initializedProviders = initializeProviders());
  }

  private async deployDeployment(deployment: BehaviorSubject<BoardDeployment>): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await CounterAPI.deploy(providers);

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private async joinDeployment(
    deployment: BehaviorSubject<BoardDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await CounterAPI.join(providers, contractAddress);

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

/** @internal */
const initializeProviders = async (): Promise<CounterProviders> => {
  const { wallet, uris } = await connectToWallet();
  const walletState = await wallet.state();
  const zkConfigPath = window.location.origin; // '../../../contract/src/managed/bboard';

  console.log(`Connecting to wallet with network ID: ${getLedgerNetworkId()}`);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'bboard-private-state',
    }),
    zkConfigProvider: new FetchZkConfigProvider<CounterCircuitKeys>(zkConfigPath, fetch.bind(window)),
    proofProvider: httpClientProofProvider(uris.proverServerUri),
    publicDataProvider: indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
    walletProvider: {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
        return wallet
          .balanceAndProveTransaction(
            ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
            newCoins,
          )
          .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
          .then(createBalancedTx);
      },
    },
    midnightProvider: {
      submitTx(tx: BalancedTransaction): Promise<TransactionId> {
        return wallet.submitTransaction(tx);
      },
    },
  };
};

/** @internal */
const connectToWallet = (): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
  const COMPATIBLE_CONNECTOR_API_VERSION = '1.x';

  return firstValueFrom(
    fnPipe(
      interval(100),
      map(() => window.midnight?.mnLace),
      filter((connectorAPI): connectorAPI is DAppConnectorAPI => !!connectorAPI),
      concatMap((connectorAPI) =>
        semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
          ? of(connectorAPI)
          : throwError(() => {
              return new Error(
                `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}', got '${connectorAPI.apiVersion}'.`,
              );
            }),
      ),
      take(1),
      timeout({
        first: 1_000,
        with: () =>
          throwError(() => {
            return new Error('Could not find Midnight Lace wallet. Extension installed?');
          }),
      }),
      concatMap(async (connectorAPI) => {
        const isEnabled = await connectorAPI.isEnabled();

        return connectorAPI;
      }),
      timeout({
        first: 5_000,
        with: () =>
          throwError(() => {
            return new Error('Midnight Lace wallet has failed to respond. Extension enabled?');
          }),
      }),
      concatMap(async (connectorAPI) => ({ walletConnectorAPI: await connectorAPI.enable(), connectorAPI })),
      catchError((error, apis) =>
        error
          ? throwError(() => {
              return new Error('Application is not authorized');
            })
          : apis,
      ),
      concatMap(async ({ walletConnectorAPI, connectorAPI }) => {
        const uris = await connectorAPI.serviceUriConfig();

        return { wallet: walletConnectorAPI, uris };
      }),
    ),
  );
};
