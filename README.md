
<h1 align="center">OneRWA Marketplace</h1>

<p align="center"><strong>A marketplace for tokenized Real-World Assets (RWA) built with thirdweb.</strong></p>

## Features
- **Trade Diverse Real-World Assets**: Buy and sell tokenized assets like real estate, art, and collectibles.
- **Fractional Ownership**: Invest in fractions of high-value assets, making them more accessible.
- **Compliance Ready**: Built with a focus on security and regulatory compliance.
- **Multi-Chain Support**: Trade assets across multiple blockchain networks.
- **Custom Currencies**: Use various ERC20 tokens for transactions.

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

