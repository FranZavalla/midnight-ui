import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { Counter, type CounterPrivateState } from 'medical-contract';

export const counterPrivateStateKey = 'counterPrivateState';
export type PrivateStateId = typeof counterPrivateStateKey;

export type PrivateStates = {
  readonly counterPrivateState: CounterPrivateState;
};

export type CounterContract = Counter.Contract<CounterPrivateState, Counter.Witnesses<CounterPrivateState>>;

export type CounterCircuitKeys = Exclude<keyof CounterContract['impureCircuits'], number | symbol>;

export type CounterProviders = MidnightProviders<CounterCircuitKeys, PrivateStateId, CounterPrivateState>;

export type DeployedCounterContract = FoundContract<CounterContract>;

export type UserInfo = {
  rewards: bigint;
  data: boolean;
};

export type CounterDerivedState = {
  readonly beneficiaries: Map<string, UserInfo>;
};
