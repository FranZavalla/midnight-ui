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

import { type Resource } from '@midnight-ntwrk/wallet';
import { type Wallet } from '@midnight-ntwrk/wallet-api';
import { stdin as input, stdout as output } from 'node:process';
import { createInterface, type Interface } from 'node:readline/promises';
import { type Logger } from 'pino';
import { type StartedDockerComposeEnvironment, type DockerComposeEnvironment } from 'testcontainers';
import { type CounterProviders, type DeployedCounterContract } from './common-types';
import { type Config, StandaloneConfig } from './config';
import * as api from './api';
import { randomBytes } from 'node:crypto';

let logger: Logger;

/**
 * This seed gives access to tokens minted in the genesis block of a local development node - only
 * used in standalone networks to build a wallet with initial funds.
 */
const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

const DEPLOY_OR_JOIN_QUESTION = `
You can do one of the following:
  1. Deploy a new authorized rewards contract
  2. Join an existing authorized rewards contract
  3. Exit
Which would you like to do? `;

const MAIN_LOOP_QUESTION = `
You can do one of the following:
  1. Display current authorized rewards value
  2. Grant verifier
  3. Add beneficiary
  4. Display beneficiary data
  5. Own Pub key
  6. Add rewards
  7. Claim rewards
  8. Exit
Which would you like to do? `;

const join = async (providers: CounterProviders, rli: Interface): Promise<DeployedCounterContract> => {
  const contractAddress = await rli.question('What is the contract address (in hex)? ');
  const pk = await rli.question('What is your secret key (in hex)? ');
  return await api.joinContract(providers, contractAddress, pk);
};

const deployOrJoin = async (providers: CounterProviders, rli: Interface): Promise<DeployedCounterContract | null> => {
  while (true) {
    const choice = await rli.question(DEPLOY_OR_JOIN_QUESTION);
    switch (choice) {
      case '1': {
        const sk = Buffer.from(randomBytes(32));
        console.log(`Your secret key (in hex) is: ${sk.toString('hex')}`);
        return await api.deploy(providers, { secretKey: sk });
      }
      case '2':
        return await join(providers, rli);
      case '3':
        logger.info('Exiting...');
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const mainLoop = async (providers: CounterProviders, rli: Interface): Promise<void> => {
  const counterContract = await deployOrJoin(providers, rli);
  if (counterContract === null) {
    return;
  }
  while (true) {
    const choice = await rli.question(MAIN_LOOP_QUESTION);
    switch (choice) {
      case '1':
        await api.displayCounterValue(providers, counterContract);
        break;
      case '2': {
        const verifier = await rli.question('Enter the verifier (in hex): ');
        await api.grantVerifier(counterContract, verifier);
        break;
      }
      case '3': {
        const beneficiary = await rli.question('Enter the beneficiary (in hex): ');
        const data = await rli.question('Enter the data (true/false): ');
        await api.addBeneficiary(counterContract, beneficiary, data === 'true');
        break;
      }
      case '4':
        await api.displayBeneficiaryData(providers, counterContract);
        break;
      case '5': {
        const sk = await rli.question('Enter your secret key (in hex): ');
        await api.displayOwnPubKey(sk);
        break;
      }
      case '6': {
        const coinAmountStr = await rli.question('Enter the coin amount to add (in decimal): ');
        const coinAmount = BigInt(coinAmountStr);
        const rewardsPerBeneficiaryStr = await rli.question('Enter the rewards per beneficiary (in decimal): ');
        const rewardsPerBeneficiary = BigInt(rewardsPerBeneficiaryStr);
        const beneficiary = await rli.question('Enter the beneficiary (in hex): ');
        await api.addRewards(providers, counterContract, coinAmount, rewardsPerBeneficiary, beneficiary);
        break;
      }
      case '7': {
        const coinAmountStr = await rli.question('Enter the coin amount to claim (in decimal): ');
        const coinAmount = BigInt(coinAmountStr);
        const sk = await rli.question('Enter your secret key (in hex): ');
        await api.claimRewards(providers, counterContract, coinAmount, sk);
        break;
      }
      case '8':
        logger.info('Exiting...');
        return;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const buildWalletFromSeed = async (config: Config, rli: Interface): Promise<Wallet & Resource> => {
  const seed = await rli.question('Enter your wallet seed: ');
  return await api.buildWalletAndWaitForFunds(config, seed, '');
};

const WALLET_LOOP_QUESTION = `
You can do one of the following:
  1. Build a fresh wallet
  2. Build wallet from a seed
  3. Exit
Which would you like to do? `;

const buildWallet = async (config: Config, rli: Interface): Promise<(Wallet & Resource) | null> => {
  if (config instanceof StandaloneConfig) {
    return await api.buildWalletAndWaitForFunds(config, GENESIS_MINT_WALLET_SEED, '');
  }
  while (true) {
    const choice = await rli.question(WALLET_LOOP_QUESTION);
    switch (choice) {
      case '1':
        return await api.buildFreshWallet(config);
      case '2':
        return await buildWalletFromSeed(config, rli);
      case '3':
        logger.info('Exiting...');
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const mapContainerPort = (env: StartedDockerComposeEnvironment, url: string, containerName: string) => {
  const mappedUrl = new URL(url);
  const container = env.getContainer(containerName);

  mappedUrl.port = String(container.getFirstMappedPort());

  return mappedUrl.toString().replace(/\/+$/, '');
};

export const run = async (config: Config, _logger: Logger, dockerEnv?: DockerComposeEnvironment): Promise<void> => {
  logger = _logger;
  api.setLogger(_logger);
  const rli = createInterface({ input, output, terminal: true });
  let env;
  if (dockerEnv !== undefined) {
    env = await dockerEnv.up();

    if (config instanceof StandaloneConfig) {
      config.indexer = mapContainerPort(env, config.indexer, 'counter-indexer');
      config.indexerWS = mapContainerPort(env, config.indexerWS, 'counter-indexer');
      config.node = mapContainerPort(env, config.node, 'counter-node');
      config.proofServer = mapContainerPort(env, config.proofServer, 'counter-proof-server');
    }
  }
  const wallet = await buildWallet(config, rli);
  try {
    if (wallet !== null) {
      const providers = await api.configureProviders(wallet, config);
      await mainLoop(providers, rli);
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`Found error '${e.message}'`);
      logger.info('Exiting...');
      logger.debug(`${e.stack}`);
    } else {
      throw e;
    }
  } finally {
    try {
      rli.close();
      rli.removeAllListeners();
    } catch (e) {
      logger.error(`Error closing readline interface: ${e}`);
    } finally {
      try {
        if (wallet !== null) {
          await wallet.close();
        }
      } catch (e) {
        logger.error(`Error closing wallet: ${e}`);
      } finally {
        try {
          if (env !== undefined) {
            await env.down();
            logger.info('Goodbye');
          }
        } catch (e) {
          logger.error(`Error shutting down docker environment: ${e}`);
        }
      }
    }
  }
};
