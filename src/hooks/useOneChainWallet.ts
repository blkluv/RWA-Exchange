import { useState, useEffect, useCallback } from 'react';
import { oneChainService, WalletAccount } from '@/services/onechain';
import { Ed25519Keypair } from '@onelabs/sui/keypairs/ed25519';

export interface UseOneChainWalletReturn {
  account: WalletAccount | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => Promise<WalletAccount>;
  disconnect: () => void;
  createWallet: () => Promise<WalletAccount>;
  importWallet: (privateKey: string) => Promise<WalletAccount>;
  getBalance: () => Promise<string>;
  requestFromFaucet: () => Promise<boolean>;
  sendTransaction: (recipient: string, amount: string) => Promise<string>;
}

export const useOneChainWallet = (): UseOneChainWalletReturn => {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!account;

  // Load saved wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('onechain_wallet');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        setAccount(walletData);
      } catch (err) {
        console.error('Error loading saved wallet:', err);
        localStorage.removeItem('onechain_wallet');
      }
    }
  }, []);

  const connect = useCallback(async (): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(null);

    try {
      // For now, create a new wallet. In production, this would integrate with browser wallet
      const { account: newAccount } = oneChainService.createWallet();
      
      // Get balance
      const balance = await oneChainService.getBalance(newAccount.address);
      const accountWithBalance = { ...newAccount, balance };
      
      setAccount(accountWithBalance);
      
      // Save to localStorage
      localStorage.setItem('onechain_wallet', JSON.stringify(accountWithBalance));
      
      return accountWithBalance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    oneChainService.disconnect();
    setAccount(null);
    localStorage.removeItem('onechain_wallet');
    setError(null);
  }, []);

  const createWallet = useCallback(async (): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(null);

    try {
      const { account: newAccount } = oneChainService.createWallet();
      
      // Get balance
      const balance = await oneChainService.getBalance(newAccount.address);
      const accountWithBalance = { ...newAccount, balance };
      
      setAccount(accountWithBalance);
      
      // Save to localStorage
      localStorage.setItem('onechain_wallet', JSON.stringify(accountWithBalance));
      
      return accountWithBalance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importWallet = useCallback(async (privateKey: string): Promise<WalletAccount> => {
    setIsLoading(true);
    setError(null);

    try {
      const importedAccount = oneChainService.importWallet(privateKey);
      
      // Get balance
      const balance = await oneChainService.getBalance(importedAccount.address);
      const accountWithBalance = { ...importedAccount, balance };
      
      setAccount(accountWithBalance);
      
      // Save to localStorage
      localStorage.setItem('onechain_wallet', JSON.stringify(accountWithBalance));
      
      return accountWithBalance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import wallet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    try {
      const balance = await oneChainService.getBalance(account.address);
      
      // Update account with new balance
      const updatedAccount = { ...account, balance };
      setAccount(updatedAccount);
      localStorage.setItem('onechain_wallet', JSON.stringify(updatedAccount));
      
      return balance;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get balance';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  const requestFromFaucet = useCallback(async (): Promise<boolean> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await oneChainService.requestFromFaucet(account.address);
      
      if (success) {
        // Refresh balance after faucet request
        await getBalance();
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request from faucet';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [account, getBalance]);

  const sendTransaction = useCallback(async (recipient: string, amount: string): Promise<string> => {
    if (!account) {
      throw new Error('No wallet connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const txDigest = await oneChainService.createTransaction(
        account.address,
        recipient,
        amount
      );
      
      // Refresh balance after transaction
      await getBalance();
      
      return txDigest;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send transaction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [account, getBalance]);

  return {
    account,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    createWallet,
    importWallet,
    getBalance,
    requestFromFaucet,
    sendTransaction,
  };
};
