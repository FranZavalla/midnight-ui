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

/**
 * Bulletin board common types and abstractions.
 *
 * @module
 */

import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { CounterPrivateState } from 'medical-contract';
import { Contract, Witnesses } from 'medical-contract/dist/managed/counter/contract/index.cjs';

export const counterPrivateStateKey = 'counterPrivateState';
export type PrivateStateId = typeof counterPrivateStateKey;

/**
 * The private states consumed throughout the application.
 *
 * @remarks
 * {@link PrivateStates} can be thought of as a type that describes a schema for all
 * private states for all contracts used in the application. Each key represents
 * the type of private state consumed by a particular type of contract.
 * The key is used by the deployed contract when interacting with a private state provider,
 * and the type (i.e., `typeof PrivateStates[K]`) represents the type of private state
 * expected to be returned.
 *
 * Since there is only one contract type for the bulletin board example, we only define a
 * single key/type in the schema.
 *
 * @public
 */
export type PrivateStates = {
  readonly counterPrivateState: CounterPrivateState;
};

/**
 * Represents a bulletin board contract and its private state.
 *
 * @public
 */
export type CounterContract = Contract<CounterPrivateState, Witnesses<CounterPrivateState>>;

/**
 * The keys of the circuits exported from {@link BBoardContract}.
 *
 * @public
 */
export type CounterCircuitKeys = Exclude<keyof CounterContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link BBoardContract}.
 *
 * @public
 */
export type CounterProviders = MidnightProviders<CounterCircuitKeys, PrivateStateId, CounterPrivateState>;

/**
 * A {@link BBoardContract} that has been deployed to the network.
 *
 * @public
 */
export type DeployedCounterContract = FoundContract<CounterProviders & Contract<any, Witnesses<any>>>;

export type UserInfo = {
  rewards: bigint;
  data: boolean;
};
/**
 * A type that represents the derived combination of public (or ledger), and private state.
 */
export type CounterDerivedState = {
  readonly beneficiaries: Map<string, UserInfo>;
};

// TODO: for some reason I needed to include "@midnight-ntwrk/wallet-sdk-address-format": "1.0.0-rc.1", should we bump in to rc-2 ?
