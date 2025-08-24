import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { Counter, CounterPrivateState, witnesses } from 'medical-contract';
import { type Logger } from 'pino';
import { combineLatest, from, map, type Observable } from 'rxjs';
import {
  DeployedMedRecordContract,
  MedRecordContract,
  MedRecordDerivedState,
  counterPrivateStateKey as medRecordPrivateStateKey,
  MedRecordProviders,
  UserInfo,
} from './common-types.js';
import { encodeTokenType, nativeToken } from '@midnight-ntwrk/ledger';

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

/** @internal */
const medicalContractInstance: MedRecordContract = new Counter.Contract(witnesses);

export interface DeployedMedRecordsAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<MedRecordDerivedState>;

  addRewards: (rewardsPerBeneficiary: bigint, key: Uint8Array) => Promise<void>;
  claimRewards: (value: bigint) => Promise<void>;
  addBeneficiary: (address: Uint8Array, condition: boolean) => Promise<void>;
  lookupData: (key: string) => Promise<string | undefined>;
  grantVerifier: (address: string) => Promise<void>;
}

export class MedRecordsAPI implements DeployedMedRecordsAPI {
  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedMedRecordContract,
    providers: MedRecordProviders,
    private readonly logger?: Logger,
  ) {
    console.log('DEPLOYED-CONTRACT', deployedContract);
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        providers.publicDataProvider
          .contractStateObservable(this.deployedContractAddress, { type: 'latest' })
          .pipe(map((contractState) => Counter.ledger(contractState.data))),
        from(providers.privateStateProvider.get(medRecordPrivateStateKey) as Promise<CounterPrivateState>),
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

  readonly state$: Observable<MedRecordDerivedState>;

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

  async addRewards(rewardsPerBeneficiary: bigint, key: Uint8Array) {
    console.log('Adding rewards...');

    const coinInfo = {
      color: encodeTokenType(nativeToken()),
      nonce: randomBytes(32),
      value: rewardsPerBeneficiary,
    };

    const finalizedTxData = await this.deployedContract.callTx.addRewards(coinInfo, BigInt(rewardsPerBeneficiary), key);
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  }

  static async deploy(providers: MedRecordProviders): Promise<MedRecordsAPI> {
    const deployecMedRecordContract = await deployContract<typeof medicalContractInstance>(providers, {
      privateStateId: medRecordPrivateStateKey,
      contract: medicalContractInstance,
      initialPrivateState: await MedRecordsAPI.getPrivateState(providers),
    });
    console.log('deployedMedRecordContract-------------', deployecMedRecordContract);

    return new MedRecordsAPI(deployecMedRecordContract, providers);
  }

  async claimRewards(value: bigint) {
    console.log('Claiming rewards...');

    const coinInfo = {
      color: encodeTokenType(nativeToken()),
      nonce: randomBytes(32),
      value: value,
    };

    const finalizedTxData = await this.deployedContract.callTx.claimRewards(coinInfo, BigInt(value));
    console.log(`Transaction ${finalizedTxData.public.txId} added in block ${finalizedTxData.public.blockHeight}`);
  }

  static async join(providers: MedRecordProviders, address: ContractAddress): Promise<MedRecordsAPI> {
    const deployedMedRecordContract = await findDeployedContract<MedRecordContract>(providers, {
      contractAddress: address,
      contract: medicalContractInstance,
      privateStateId: medRecordPrivateStateKey,
      initialPrivateState: await MedRecordsAPI.getPrivateState(providers),
    });

    return new MedRecordsAPI(deployedMedRecordContract, providers);
  }

  private static async getPrivateState(providers: MedRecordProviders): Promise<CounterPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(medRecordPrivateStateKey);
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
