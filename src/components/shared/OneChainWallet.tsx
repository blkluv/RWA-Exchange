"use client";

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Input,
  useDisclosure,
  useToast,
  Divider,
  Badge,
  IconButton,
  Tooltip,
  Code,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiCopy, FiRefreshCw, FiSend } from "react-icons/fi";
import { useOneChainWallet } from "@/hooks/useOneChainWallet";

interface OneChainWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OneChainWallet({ isOpen, onClose }: OneChainWalletProps) {
  const {
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
  } = useOneChainWallet();

  const [privateKey, setPrivateKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "OneChain wallet connected successfully",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Failed to connect wallet",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleCreateWallet = async () => {
    try {
      await createWallet();
      toast({
        title: "Wallet Created",
        description: "New OneChain wallet created successfully",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Creation Failed",
        description: err instanceof Error ? err.message : "Failed to create wallet",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleImportWallet = async () => {
    if (!privateKey.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid private key",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await importWallet(privateKey);
      setPrivateKey("");
      setShowImport(false);
      toast({
        title: "Wallet Imported",
        description: "Wallet imported successfully",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Import Failed",
        description: err instanceof Error ? err.message : "Failed to import wallet",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleRefreshBalance = async () => {
    try {
      await getBalance();
      toast({
        title: "Balance Updated",
        description: "Wallet balance refreshed",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Refresh Failed",
        description: err instanceof Error ? err.message : "Failed to refresh balance",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRequestFaucet = async () => {
    try {
      const success = await requestFromFaucet();
      if (success) {
        toast({
          title: "Faucet Request Successful",
          description: "Test tokens requested successfully",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Faucet Request Failed",
          description: "Failed to request tokens from faucet",
          status: "error",
          duration: 3000,
        });
      }
    } catch (err) {
      toast({
        title: "Faucet Error",
        description: err instanceof Error ? err.message : "Faucet request failed",
        status: "error",
        duration: 5000,
      });
    }
  };

  const handleSendTransaction = async () => {
    if (!recipient.trim() || !amount.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter recipient address and amount",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const txDigest = await sendTransaction(recipient, amount);
      setRecipient("");
      setAmount("");
      setShowSend(false);
      toast({
        title: "Transaction Sent",
        description: `Transaction successful: ${txDigest.slice(0, 10)}...`,
        status: "success",
        duration: 5000,
      });
    } catch (err) {
      toast({
        title: "Transaction Failed",
        description: err instanceof Error ? err.message : "Failed to send transaction",
        status: "error",
        duration: 5000,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
      status: "success",
      duration: 2000,
    });
  };

  const formatBalance = (balance: string) => {
    const balanceNum = parseFloat(balance) / 1e9; // Convert from MIST to SUI
    return balanceNum.toFixed(4);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>OneChain Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!isConnected ? (
            <VStack spacing={4}>
              <Text textAlign="center" color="gray.600">
                Connect or create a OneChain wallet to get started
              </Text>

              <Button
                onClick={handleConnect}
                isLoading={isLoading}
                colorScheme="blue"
                size="lg"
                width="full"
              >
                Connect Existing Wallet
              </Button>

              <Button
                onClick={handleCreateWallet}
                isLoading={isLoading}
                variant="outline"
                size="lg"
                width="full"
              >
                Create New Wallet
              </Button>

              <Divider />

              <Button
                onClick={() => setShowImport(!showImport)}
                variant="ghost"
                size="sm"
              >
                Import from Private Key
              </Button>

              {showImport && (
                <VStack spacing={3} width="full">
                  <Input
                    placeholder="Enter private key"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    type="password"
                  />
                  <Button
                    onClick={handleImportWallet}
                    isLoading={isLoading}
                    colorScheme="green"
                    size="sm"
                  >
                    Import Wallet
                  </Button>
                </VStack>
              )}
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                width="full"
                bg="gray.50"
              >
                <VStack spacing={3}>
                  <HStack justify="space-between" width="full">
                    <Text fontWeight="bold">Address:</Text>
                    <Badge colorScheme="green">Connected</Badge>
                  </HStack>
                  
                  <HStack width="full" spacing={2}>
                    <Code fontSize="xs" flex={1} p={2}>
                      {account?.address}
                    </Code>
                    <Tooltip label="Copy address">
                      <IconButton
                        aria-label="Copy address"
                        icon={<FiCopy />}
                        size="sm"
                        onClick={() => copyToClipboard(account?.address || "")}
                      />
                    </Tooltip>
                  </HStack>

                  <HStack justify="space-between" width="full">
                    <Text fontWeight="bold">Balance:</Text>
                    <HStack>
                      <Text>{formatBalance(account?.balance || "0")} SUI</Text>
                      <Tooltip label="Refresh balance">
                        <IconButton
                          aria-label="Refresh balance"
                          icon={<FiRefreshCw />}
                          size="sm"
                          onClick={handleRefreshBalance}
                          isLoading={isLoading}
                        />
                      </Tooltip>
                    </HStack>
                  </HStack>
                </VStack>
              </Box>

              <HStack spacing={2} width="full">
                <Button
                  onClick={handleRequestFaucet}
                  isLoading={isLoading}
                  colorScheme="purple"
                  flex={1}
                >
                  Request Faucet
                </Button>
                <Button
                  onClick={() => setShowSend(!showSend)}
                  colorScheme="blue"
                  flex={1}
                  leftIcon={<FiSend />}
                >
                  Send
                </Button>
              </HStack>

              {showSend && (
                <VStack spacing={3} width="full" p={4} borderWidth={1} borderRadius="md">
                  <Text fontWeight="bold">Send Transaction</Text>
                  <Input
                    placeholder="Recipient address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <Input
                    placeholder="Amount (in MIST)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                  <HStack spacing={2} width="full">
                    <Button
                      onClick={() => setShowSend(false)}
                      variant="ghost"
                      flex={1}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendTransaction}
                      isLoading={isLoading}
                      colorScheme="blue"
                      flex={1}
                    >
                      Send
                    </Button>
                  </HStack>
                </VStack>
              )}

              <Divider />

              <Button
                onClick={disconnect}
                variant="outline"
                colorScheme="red"
                width="full"
              >
                Disconnect Wallet
              </Button>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function OneChainWalletButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, isConnected } = useOneChainWallet();

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={isConnected ? "green" : "blue"}
        variant={isConnected ? "solid" : "outline"}
        size="sm"
      >
        {isConnected ? `OneChain: ${account?.address?.slice(0, 6)}...` : "Connect OneChain"}
      </Button>
      <OneChainWallet isOpen={isOpen} onClose={onClose} />
    </>
  );
}
