import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { ImpureCircuitId, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { Counter, type CounterPrivateState } from 'medical-contract';

export const counterPrivateStateKey = 'counterPrivateState';
export type PrivateStateId = typeof counterPrivateStateKey;

export type PrivateStates = {
  readonly counterPrivateState: CounterPrivateState;
};

export type MedRecordContract = Counter.Contract<CounterPrivateState, Counter.Witnesses<CounterPrivateState>>;

export type MedRecordCircuitKeys = Exclude<keyof MedRecordContract['impureCircuits'], number | symbol>;

export type MedRecordProviders = MidnightProviders<MedRecordCircuitKeys, PrivateStateId, CounterPrivateState>;

export type DeployedMedRecordContract = FoundContract<MedRecordContract>;

export type UserInfo = {
  rewards: bigint;
  data: boolean;
};

export type MedRecordDerivedState = {
  readonly beneficiaries: Map<string, UserInfo>;
};

export type CounterCircuits = ImpureCircuitId<Counter.Contract<CounterPrivateState>>;
