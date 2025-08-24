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

  increment: () => Promise<void>;
  increment2: () => Promise<void>;
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

  static async deploy(providers: MedRecordProviders): Promise<MedRecordsAPI> {
    const deployecMedRecordContract = await deployContract<typeof medicalContractInstance>(providers, {
      privateStateId: medRecordPrivateStateKey,
      contract: medicalContractInstance,
      initialPrivateState: await MedRecordsAPI.getPrivateState(providers),
    });
    console.log('deployedMedRecordContract-------------', deployecMedRecordContract);

    return new MedRecordsAPI(deployecMedRecordContract, providers);
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
