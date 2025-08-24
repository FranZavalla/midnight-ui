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
