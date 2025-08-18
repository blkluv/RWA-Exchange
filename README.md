
<div align="center">

  <h1>OneRWA Marketplace</h1>
  
  <p><strong>A marketplace for tokenized Real-World Assets (RWA) built with thirdweb.</strong></p>
  
  <p>
    <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://hardhat.org/" target="_blank"><img src="https://img.shields.io/badge/Hardhat-3-FFEA00?logo=ethereum&logoColor=black" alt="Hardhat" /></a>
    <a href="https://chakra-ui.com/" target="_blank"><img src="https://img.shields.io/badge/Chakra%20UI-2-319795?logo=chakraui&logoColor=white" alt="Chakra UI" /></a>
    <a href="https://thirdweb.com/" target="_blank"><img src="https://img.shields.io/badge/thirdweb-5-2D2D2D?logo=web3.js&logoColor=white" alt="thirdweb" /></a>
  </p>
</div>

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Environment](#environment)
- [Workflow](#workflow)
- [Mermaid Flowchart (Dev + User Flow)](#mermaid-flowchart-dev--user-flow)
- [Demo](#demo)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features
- ✅ **Trade Diverse RWAs**: Buy and sell tokenized assets like real estate, art, and collectibles.
- 🧩 **Fractional Ownership**: Invest in fractions of high-value assets, making them more accessible.
- 🛡️ **Compliance Ready**: Built with a focus on security and regulatory compliance.
- 🌐 **Multi-Chain Support**: Trade assets across multiple blockchain networks.
- 💱 **Custom Currencies**: Use various ERC20 tokens for transactions.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Chakra UI
- **Web3 SDK**: thirdweb
- **Smart Contracts**: Solidity (OpenZeppelin), Hardhat, Ethers v6
- **State/Data**: @tanstack/react-query


## Dev + User Flow

```mermaid
flowchart TD
  subgraph Dev[Developer Workflow]
    A[Clone Repo] --> B[Install Deps]
    B --> C[Create .env.local\nNEXT_PUBLIC_TW_CLIENT_ID]
    C --> D{Contracts needed?}
    D -- Yes --> E[Hardhat Compile/Test]
    E --> F[Deploy via scripts/deploy.ts]
    D -- No --> G[Skip]
    F --> H[Update src/consts/*]
    G --> H
    H --> I[Run: npm run dev]
  end

  subgraph User[End-User Flow]
    J[Open App / Landing] --> K[Connect OneWallet in Navbar]
    K --> L{Connected?}
    L -- Yes --> M[Browse Marketplace]
    L -- No --> K
    M --> N[View Token Page]
    N --> O{Buy / List / Fractionalize}
    O -- Buy --> P[Purchase via supported token]
    O -- List --> Q[Create Listing]
    O -- Fractionalize --> R[Fractionalize Asset]
  end

  I --> J
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables
Create a file named `.env.local` in the root of your project and add your thirdweb client ID:
```
NEXT_PUBLIC_TW_CLIENT_ID="<your-thirdweb-client-id>"
```

You can get a client ID from the [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys).

### 3. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Quick Start (All-in-One)

```bash
# 1) Install
npm install

# 2) Configure env
cp .env.example .env.local  # then edit .env.local

# 3) Run
npm run dev
```

## Customize Your Marketplace

### 1. Supported Networks
Deploy a [MarketplaceV3 contract](https://thirdweb.com/thirdweb.eth/MarketplaceV3) on each network you want to support. Add the desired chains to [`./src/consts/chains.ts`](./src/consts/chains.ts).

[Learn more about thirdweb Chains](https://portal.thirdweb.com/typescript/v5/chain).

### 2. Marketplace Contracts
Add your deployed MarketplaceV3 contract addresses and their corresponding chains to [`/src/consts/marketplace_contracts.ts`](/src/consts/marketplace_contract.ts).

### 3. Supported Currencies
Configure the ERC20 tokens you want to support for payments in [`./src/consts/supported_tokens.ts`](./src/consts/supported_tokens.ts).

## Learn More

To learn more about thirdweb, take a look at the following resources:

- [thirdweb Documentation](https://portal.thirdweb.com/) - learn about thirdweb features and API.
- [thirdweb Discord](https://discord.gg/thirdweb) - join our community for support and questions.

## Security

If you discover a security vulnerability, please report it by emailing `security@thirdweb.com`.


## Project Structure

- `contracts/` — Solidity contracts (`Fraction.sol`, `Fractionalizer.sol`, `PropertyNFT.sol`).
- `scripts/deploy.ts` — Hardhat deployment script(s).
- `src/` — Next.js app and components.
  - `src/app/` — Next.js routes (e.g., `landing/page.tsx`).
  - `src/components/` — UI components (e.g., `token-page/*`, `shared/*`).
  - `src/consts/` — Chain, contract, and token configuration.

## Scripts

From `package.json`:

```bash
npm run dev      # start Next.js dev server
npm run build    # build production bundle
npm run start    # start production server
npm run lint     # run Next.js lint
```

Hardhat (typical usage):

```bash
npx hardhat compile
npx hardhat test
# Deploy (example):
npx hardhat run scripts/deploy.ts --network <network>
```

## Environment

Create `.env.local` at repo root:

```
NEXT_PUBLIC_TW_CLIENT_ID="<your-thirdweb-client-id>"
```

You can obtain a client ID from the [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys).

## Workflow

1) Install dependencies: `npm install`

2) Configure environment: create `.env.local` with your Thirdweb client ID.

3) (Optional) Develop/compile/deploy contracts with Hardhat.

4) Update frontend configs:
   - Chains: `src/consts/chains.ts`
   - Marketplace contracts: `src/consts/marketplace_contract.ts`
   - Supported tokens: `src/consts/supported_tokens.ts`

5) Run the app: `npm run dev` and open http://localhost:3000

6) Connect wallet (OneWallet via navbar) and interact with marketplace pages.


## Troubleshooting

- Ensure your wallet extension (e.g., OneWallet) is installed and unlocked.
- If contracts are redeployed, remember to update addresses under `src/consts/*`.
- If Next.js fails to start, clear `.next/` and retry: `rm -rf .next && npm run dev` (Windows: delete `.next` folder manually).

## Demo

- Screenshots or GIFs
  - Landing Page: `src/app/landing/page.tsx`
  - Token Page and Listing Flow: `src/components/token-page/*`
  
Add your media under `public/` and embed here:

```md
![Landing](public/landing.png)
![Marketplace](public/marketplace.png)
```

## Contributing

Contributions are welcome! Please:

- Fork the repo and create a feature branch.
- Follow existing code style and run `npm run lint`.
- Open a PR with a clear description and screenshots if UI changes.

## License

MIT © OneRWA Marketplace Contributors

