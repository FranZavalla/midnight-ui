import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Counter, CounterPrivateState, witnesses } from 'medical-contract';
import { type Logger } from 'pino';
import { combineLatest, from, map, type Observable } from 'rxjs';
import {
  CounterContract,
  CounterDerivedState,
  counterPrivateStateKey,
  CounterProviders,
  DeployedCounterContract,
  UserInfo,
} from './common-types.js';

/** @internal */
const medicalContractInstance: CounterContract = new Counter.Contract(witnesses);

/**
 * An API for a deployed bulletin board.
 */
export interface DeployedCounterAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<CounterDerivedState>;

  increment: () => Promise<void>;
  increment2: () => Promise<void>;
  addBeneficiary: (address: Uint8Array, condition: boolean) => Promise<void>;
  lookupData: (key: string) => Promise<string | undefined>;
  grantVerifier: (address: string) => Promise<void>;
}

/**
 * Provides an implementation of {@link DeployedCounterAPI} by adapting a deployed bulletin board
 * contract.
 *
 * @remarks
 * The `BBoardPrivateState` is managed at the DApp level by a private state provider. As such, this
 * private state is shared between all instances of {@link CounterAPI}, and their underlying deployed
 * contracts. The private state defines a `'secretKey'` property that effectively identifies the current
 * user, and is used to determine if the current user is the owner of the message as the observable
 * contract state changes.
 *
 * In the future, Midnight.js will provide a private state provider that supports private state storage
 * keyed by contract address. This will remove the current workaround of sharing private state across
 * the deployed bulletin board contracts, and allows for a unique secret key to be generated for each bulletin
 * board that the user interacts with.
 */
// TODO: Update BBoardAPI to use contract level private state storage.
export class CounterAPI implements DeployedCounterAPI {
  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedCounterContract,
    providers: CounterProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        // Combine public (ledger) state with...
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, { type: 'latest' })
          .pipe(map((contractState) => Counter.ledger(contractState.data))),
        // ...private state...
        //    since the private state of the bulletin board application never changes, we can query the
        //    private state once and always use the same value with `combineLatest`. In applications
        //    where the private state is expected to change, we would need to make this an `Observable`.
        from(providers.privateStateProvider.get(counterPrivateStateKey) as Promise<CounterPrivateState>),
      ],
      // ...and combine them to produce the required derived state.
      (ledgerState, privateState) => {
        const hashedSecretKey = Counter.pureCircuits.publicKey(privateState.secretKey);

        return {
          beneficiaries: new Map<string, UserInfo>(),
        };
      },
    );
  }

  readonly deployedContractAddress: ContractAddress;

  readonly state$: Observable<CounterDerivedState>;

  async increment() {
    const txData = await this.deployedContract.callTx.increment();
  }
  async increment2() {
    const txData = await this.deployedContract.callTx.increment2();
  }
  async addBeneficiary(publicKey: Uint8Array, condition: boolean) {
    const txData = await this.deployedContract.callTx.addBeneficiary(publicKey, condition);
  }
  async lookupData(key: string): Promise<string | undefined> {
    return key;
  }
  async grantVerifier(address: string) {}

  static async deploy(providers: CounterProviders): Promise<CounterAPI> {
    const deployecCounterContract = await deployContract<typeof medicalContractInstance>(providers as any, {
      privateStateId: counterPrivateStateKey,
      contract: medicalContractInstance,
      initialPrivateState: await CounterAPI.getPrivateState(providers),
    });

    return new CounterAPI(deployecCounterContract, providers);
  }

  static async join(providers: CounterProviders, address: ContractAddress): Promise<CounterAPI> {
    const deployedCounterContract = await findDeployedContract<CounterContract>(providers, {
      contractAddress: address,
      contract: medicalContractInstance,
      privateStateId: counterPrivateStateKey,
      initialPrivateState: await CounterAPI.getPrivateState(providers),
    });

    return new CounterAPI(deployedCounterContract, providers);
  }

  private static async getPrivateState(providers: CounterProviders): Promise<CounterPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(counterPrivateStateKey);
    return existingPrivateState!;
  }
}

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
