import { SuiClient } from '@onelabs/sui/client';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';
import { Transaction } from '@onelabs/sui/transactions';
import { fromBase64, toBase64 } from '@onelabs/sui/utils';

export interface OneChainConfig {
  rpcUrl: string;
  faucetUrl: string;
  network: 'testnet' | 'mainnet' | 'localnet';
}

export interface WalletAccount {
  address: string;
  publicKey: string;
  balance?: string;
}

export class OneChainWalletService {
  private client: SuiClient;
  private config: OneChainConfig;
  private keypair?: Ed25519Keypair;
  private walletExtension: any = null;

  constructor(config: OneChainConfig) {
    this.config = config;
    this.client = new SuiClient({ url: config.rpcUrl });
  }

  isWalletExtensionAvailable(): boolean {
    return typeof window !== 'undefined' && (window as any).suiWallet !== undefined;
  }

  async connectWalletExtension(): Promise<WalletAccount> {
    if (!this.isWalletExtensionAvailable()) throw new Error('Sui wallet extension not found.');

    try {
      const wallet = (window as any).suiWallet;
      const response = await wallet.requestPermissions({
        permissions: ['viewAccount', 'suggestTransactions'],
      });

      if (!response.accounts || response.accounts.length === 0) {
        throw new Error('No accounts found in wallet extension');
      }

      const account = response.accounts[0];
      this.walletExtension = wallet;

      return {
        address: account.address,
        publicKey: account.publicKey || '',
      };
    } catch (error) {
      console.error('Failed to connect to wallet extension:', error);
      throw new Error('Failed to connect to wallet extension');
    }
  }

  async getWalletExtensionAccounts(): Promise<WalletAccount[]> {
    if (!this.walletExtension) throw new Error('Wallet extension not connected');

    try {
      const accounts = await this.walletExtension.getAccounts();
      return accounts.map((account: any) => ({
        address: account.address,
        publicKey: account.publicKey || '',
      }));
    } catch (error) {
      console.error('Failed to get accounts:', error);
      throw error;
    }
  }

  createWallet(): { keypair: Ed25519Keypair; account: WalletAccount } {
    const keypair = new Ed25519Keypair();
    const account: WalletAccount = {
      address: keypair.getPublicKey().toSuiAddress(),
      publicKey: keypair.getPublicKey().toBase64(),
    };

    this.keypair = keypair;
    return { keypair, account };
  }

  importWallet(privateKey: string): WalletAccount {
    const secretKeyBytes = fromBase64(privateKey);
    const keypair = Ed25519Keypair.fromSecretKey(secretKeyBytes);
    const account: WalletAccount = {
      address: keypair.getPublicKey().toSuiAddress(),
      publicKey: keypair.getPublicKey().toBase64(),
    };

    this.keypair = keypair;
    return account;
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.client.getBalance({ owner: address });
      return balance.totalBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  async getAccountInfo(address: string): Promise<WalletAccount> {
    const balance = await this.getBalance(address);
    return { address, publicKey: '', balance };
  }

  async requestFromFaucet(address: string): Promise<boolean> {
    if (this.config.network !== 'testnet') throw new Error('Faucet is only available on testnet');

    try {
      const response = await fetch(`${this.config.faucetUrl}/gas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ FixedAmountRequest: { recipient: address } }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error requesting from faucet:', error);
      return false;
    }
  }

  async createTransaction(
    sender: string,
    recipient: string,
    amount: string | number | bigint
  ): Promise<string> {
    if (this.walletExtension) {
      return this.createTransactionWithExtension(sender, recipient, amount);
    } else if (this.keypair) {
      return this.createTransactionWithKeypair(sender, recipient, amount);
    } else {
      throw new Error('No wallet connected');
    }
  }

  private async createTransactionWithExtension(
    sender: string,
    recipient: string,
    amount: string | number | bigint
  ): Promise<string> {
    const tx = new Transaction();
    const numericAmount = typeof amount === 'string' ? BigInt(amount) : BigInt(amount);
    const [coin] = tx.splitCoins(tx.gas, [numericAmount]);
    tx.transferObjects([coin], recipient);
    tx.setSender(sender);

    try {
      const result = await this.walletExtension.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        account: sender,
      });
      return result.digest;
    } catch (error) {
      console.error('Error executing transaction with extension:', error);
      throw error;
    }
  }

  private async createTransactionWithKeypair(
    sender: string,
    recipient: string,
    amount: string | number | bigint
  ): Promise<string> {
    if (!this.keypair) throw new Error('No keypair available');

    const tx = new Transaction();
    const numericAmount = typeof amount === 'string' ? BigInt(amount) : BigInt(amount);
    const [coin] = tx.splitCoins(tx.gas, [numericAmount]);
    tx.transferObjects([coin], recipient);
    tx.setSender(sender);

    try {
      const result = await this.client.signAndExecuteTransaction({
        signer: this.keypair,
        transaction: tx,
      });
      return result.digest;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }

  async getTransaction(digest: string) {
    try {
      return await this.client.getTransactionBlock({
        digest,
        options: { showInput: true, showEffects: true, showEvents: true },
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  async getOwnedObjects(address: string) {
    try {
      return await this.client.getOwnedObjects({
        owner: address,
        options: { showType: true, showContent: true, showDisplay: true },
      });
    } catch (error) {
      console.error('Error fetching owned objects:', error);
      throw error;
    }
  }

  disconnect(): void {
    this.keypair = undefined;
  }

  isConnected(): boolean {
    return !!this.keypair;
  }

  getKeypair(): Ed25519Keypair | undefined {
    return this.keypair;
  }

  exportPrivateKey(): string {
    if (!this.keypair) throw new Error('No wallet connected');

    const secretKeyString = this.keypair.getSecretKey(); // string
    const secretKeyBytes = new TextEncoder().encode(secretKeyString); // Uint8Array
    return toBase64(secretKeyBytes);
  }
}

// Singleton instance
export const oneChainService = new OneChainWalletService({
  rpcUrl: process.env.NEXT_PUBLIC_ONECHAIN_RPC_URL || 'https://rpc-testnet.onelabs.cc:443',
  faucetUrl: process.env.NEXT_PUBLIC_ONECHAIN_FAUCET_URL || 'https://faucet-testnet.onelabs.cc:443',
  network: (process.env.NEXT_PUBLIC_ONECHAIN_NETWORK as 'testnet' | 'mainnet' | 'localnet') || 'testnet',
});
