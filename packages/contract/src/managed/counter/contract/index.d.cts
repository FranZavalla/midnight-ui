import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type UserInfo = { rewards: bigint; data: boolean };

export type Witnesses<T> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  increment(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  increment2(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  addBeneficiary(context: __compactRuntime.CircuitContext<T>,
                 beneficiary_0: Uint8Array,
                 data_0: boolean): __compactRuntime.CircuitResults<T, []>;
  lookupData(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, boolean>;
  grantVerifier(context: __compactRuntime.CircuitContext<T>,
                verifier_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  increment(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  increment2(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, []>;
  addBeneficiary(context: __compactRuntime.CircuitContext<T>,
                 beneficiary_0: Uint8Array,
                 data_0: boolean): __compactRuntime.CircuitResults<T, []>;
  lookupData(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, boolean>;
  grantVerifier(context: __compactRuntime.CircuitContext<T>,
                verifier_0: { bytes: Uint8Array }): __compactRuntime.CircuitResults<T, []>;
  publicKey(context: __compactRuntime.CircuitContext<T>, sk_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly Verifiers: Uint8Array;
  beneficiaries: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): UserInfo;
    [Symbol.iterator](): Iterator<[Uint8Array, UserInfo]>
  };
  readonly round: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
