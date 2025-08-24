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
import { CoinInfo } from '@midnight-ntwrk/zswap';
import { encodeTokenType, nativeToken } from '@midnight-ntwrk/ledger';

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

/** @internal */
const medicalContractInstance: CounterContract = new Counter.Contract(witnesses);

/**
 * An API for a deployed bulletin board.
 */
export interface DeployedCounterAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<CounterDerivedState>;

  addRewards: (coin: CoinInfo, rewardsPerBeneficiary: bigint, key: Uint8Array) => Promise<void>;
  claimRewards: (coin: CoinInfo, value: bigint) => Promise<void>;
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
    console.log('DEPLOYED-COUNTER', deployedContract);
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, { type: 'latest' })
          .pipe(map((contractState) => Counter.ledger(contractState.data))),
        from(providers.privateStateProvider.get(counterPrivateStateKey) as Promise<CounterPrivateState>),
      ],
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

  async addBeneficiary(publicKey: Uint8Array, condition: boolean) {
    console.log('Adding beneficiary...');

    const finalizedTxData = await this.deployedContract.callTx.addBeneficiary(publicKey, condition);
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  }

  async lookupData(key: string) {
    console.log('Displaying beneficiary data...');
    const beneficiaries = await this.deployedContract.callTx.lookupData();
    for (const [beneficiary, data] of Object.entries(beneficiaries)) {
      console.log(`Beneficiary: ${beneficiary}, Data: ${JSON.stringify(data)}`);
    }
    return JSON.stringify(beneficiaries);
  }
  async grantVerifier(address: string) {
    console.log('Granting verifier...');

    const finalizedTxData = await this.deployedContract.callTx.grantVerifier({ bytes: Buffer.from(address, 'hex') });
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  }

  async addRewards(coin: CoinInfo, rewardsPerBeneficiary: bigint, key: Uint8Array) {
    console.log('Adding rewards...');

    const coinInfo = {
      color: encodeTokenType(nativeToken()),
      nonce: randomBytes(32),
      value: rewardsPerBeneficiary,
    };

    const finalizedTxData = await this.deployedContract.callTx.addRewards(coinInfo, BigInt(rewardsPerBeneficiary), key);
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  }

  static async deploy(providers: CounterProviders): Promise<CounterAPI> {
    const deployecCounterContract = await deployContract<typeof medicalContractInstance>(providers, {
      privateStateId: counterPrivateStateKey,
      contract: medicalContractInstance,
      initialPrivateState: await CounterAPI.getPrivateState(providers),
    });
    console.log('deployedCounterContract-------------', deployecCounterContract);

    return new CounterAPI(deployecCounterContract, providers);
  }

  async claimRewards(coin: CoinInfo, value: bigint) {
    console.log('Claiming rewards...');

    const coinInfo = {
      color: encodeTokenType(nativeToken()),
      nonce: randomBytes(32),
      value: value,
    };

    const finalizedTxData = await this.deployedContract.callTx.claimRewards(coinInfo, BigInt(value));
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
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
    return existingPrivateState ?? { secretKey: randomBytes(32) };
  }
}

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
