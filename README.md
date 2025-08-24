use node 22

1) docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
2) nvm use 22
3) npm i -g http-server
4) npm install -g pnpm@latest-10
5) pnpm -w run clean
6) cd packages/contract
7) pnpm i
8) pnpm build
9) cd ../../apps/ui
10) pnpm i
11) pnpm turbo build
12) pnpm run build:start
# Medical Verification System

A transparent, secure and privacy-preserving protocol for medical data validation and sharing built on the Midnight Network. This system enables medical verifiers (doctors, medical institutions) to add beneficiaries for government benefits while maintaining data privacy through zero-knowledge proofs.

## Overview

The system consists of three main actors:
- **Government**: Manages rewards/benefits and authorizes medical verifiers
- **Medical Verifiers**: Doctors or medical institutions who can verify medical conditions
- **Patients/Beneficiaries**: Individuals who can claim government benefits based on verified medical conditions

### Key Features

- **Privacy-Preserving**: Uses zero-knowledge proofs to verify medical conditions without exposing sensitive health data
- **Transparent**: All transactions are recorded on the blockchain for auditability
- **Secure**: Built on Midnight Network's privacy-focused infrastructure
- **Flexible**: Supports verification of any medical condition that can be validated by healthcare professionals

## Architecture

The project is structured as a monorepo with:
- `packages/contract/`: Smart contract written in Compact language for Midnight Network
- `apps/ui/`: React-based user interface for interacting with the contract
- CLI tool for programmatic interactions

## Prerequisites

- Node.js >= 18
- pnpm package manager
- Compact tooling (for contract compilation)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd midnight-ui

# Install dependencies
pnpm install
```

## Building the Contract

The smart contract is written in Compact language and needs to be compiled before use:

```bash
# Build the contract
cd packages/contract
pnpm run setup
```

This will:
1. Compile the Compact contract (`counter.compact`) 
2. Generate TypeScript bindings
3. Create zero-knowledge proof keys and circuits

## Building the UI

```bash
cd apps/ui
pnpm run build
```

This creates a production build of the React application with the contract artifacts included.

## Usage

### Web Interface

1. Start the development server:
```bash
cd apps/ui
pnpm run dev
```

2. Open your browser to the provided URL (typically http://localhost:5173)

3. The interface provides different views for each user type:
   - **Government**: Add rewards and authorize verifiers
   - **Doctor**: Verify medical conditions and add beneficiaries
   - **Patient**: View status and claim available rewards

### CLI Interface

For programmatic access, use the CLI tool:

```bash
cd apps/ui
pnpm run testnet-remote
```

#### CLI Operations

The CLI provides an interactive menu system with the following options:

**Initial Setup:**
1. **Deploy a new contract**: Creates a new medical verification contract instance
2. **Join existing contract**: Connect to an already deployed contract using its address

**Main Operations:**

1. **Display current authorized rewards value**: View total rewards available in the system
2. **Grant verifier**: Authorize a medical professional to verify conditions
   - Requires verifier's public key (hex format)
3. **Add beneficiary**: Register a patient as eligible for benefits
   - Requires beneficiary's public key and medical verification status (true/false)
4. **Display beneficiary data**: View registered beneficiaries and their status
5. **Own Pub key**: Display your public key from your secret key
6. **Add rewards**: Government function to deposit rewards into the system
   - Requires coin amount and rewards per beneficiary
7. **Claim rewards**: Allow beneficiaries to claim their allocated benefits
   - Requires coin amount to claim and beneficiary's secret key

#### Example CLI Workflow

1. **Government Setup** (first time):
   ```
   1. Deploy a new authorized rewards contract
   → System generates contract address and your secret key
   6. Add rewards (deposit initial benefits)
   2. Grant verifier (authorize medical professionals)
   ```

2. **Medical Verifier**:
   ```
   2. Join an existing authorized rewards contract
   → Enter contract address and your secret key
   3. Add beneficiary (verify patient's medical condition)
   ```

3. **Patient/Beneficiary**:
   ```
   2. Join an existing authorized rewards contract
   4. Display beneficiary data (check your status)
   7. Claim rewards (if eligible)
   ```

### Key Management

- **Secret Keys**: 64-character hex strings used for authentication
- **Public Keys**: Derived from secret keys, used for identification
- **Contract Address**: Unique identifier for each deployed contract instance

Keep your secret keys secure and never share them publicly.

## Development

### Running Tests

```bash
# Contract tests
cd packages/contract
pnpm test

# UI tests (if available)
cd apps/ui
pnpm test
```

### Linting

```bash
# Root level
pnpm run lint

# Individual packages
cd packages/contract && pnpm run lint
cd apps/ui && pnpm run lint
```

### Type Checking

```bash
# Root level
pnpm run check-types

# UI specific
cd apps/ui && pnpm run typecheck
```

## License

Apache-2.0
