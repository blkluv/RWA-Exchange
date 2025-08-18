import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { 
	Button, 
	useToast, 
	VStack, 
	HStack, 
	Text, 
	Badge, 
	Box,
	useColorModeValue,
	Icon,
	Spinner,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Divider
} from "@chakra-ui/react";
import {
	type Hex,
	NATIVE_TOKEN_ADDRESS,
	getContract,
	sendAndConfirmTransaction,
	sendTransaction,
	toTokens,
	waitForReceipt,
} from "thirdweb";
import { allowance, approve, decimals } from "thirdweb/extensions/erc20";
import {
	type DirectListing,
	buyFromListing,
} from "thirdweb/extensions/marketplace";
import {
	useActiveWalletChain,
	useSwitchActiveWalletChain,
} from "thirdweb/react";
import type { Account } from "thirdweb/wallets";
import { OneIdVerification } from "../shared/OneIdVerification";
import { FaShoppingCart, FaLock, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

type Props = {
	listing: DirectListing;
	account: Account;
};

export default function BuyFromListingButton(props: Props) {
	const { account, listing } = props;
	const { marketplaceContract, refetchAllListings, nftContract } = useMarketplaceContext();
	const switchChain = useSwitchActiveWalletChain();
	const activeChain = useActiveWalletChain();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const [quantity, setQuantity] = useState(1);
	
	const cardBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.600");
	
	const totalPrice = Number(listing.currencyValuePerToken.displayValue) * quantity;
	const maxQuantity = Number(listing.quantity);

	const handlePurchase = async () => {
		if (activeChain?.id !== nftContract.chain.id) {
			await switchChain(nftContract.chain);
		}
		
		setIsLoading(true);
		try {
			// Handle ERC20 token approval if needed
			if (listing.currencyContractAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()) {
				const customTokenContract = getContract({
					address: listing.currencyContractAddress as Hex,
					client,
					chain: nftContract.chain,
				});
				const result = await allowance({
					contract: customTokenContract,
					owner: account.address,
					spender: marketplaceContract.address as Hex,
				});

				if (result < listing?.pricePerToken * BigInt(quantity)) {
					const _decimals = await decimals({ contract: customTokenContract });
					const transaction = approve({
						contract: customTokenContract,
						spender: marketplaceContract.address as Hex,
						amount: toTokens(listing?.pricePerToken * BigInt(quantity), _decimals),
					});
					await sendAndConfirmTransaction({ transaction, account });
				}
			}

			// Execute purchase
			const transaction = buyFromListing({
				contract: marketplaceContract,
				listingId: listing.id,
				quantity: BigInt(quantity),
				recipient: account.address,
			});
			
			const receipt = await sendTransaction({ transaction, account });
			await waitForReceipt({
				transactionHash: receipt.transactionHash,
				client,
				chain: nftContract.chain,
			});
			
			toast({
				title: "🎉 Purchase Successful!",
				description: `You've successfully purchased ${quantity} fraction(s) of this asset!`,
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			
			refetchAllListings();
			onClose();
		} catch (err) {
			console.error(err);
			const errorMessage = (err as Error).message;
			
			if (errorMessage.includes("insufficient funds")) {
				toast({
					title: "Insufficient Funds",
					description: `You need ${totalPrice} ${listing.currencyValuePerToken.symbol} + gas fees`,
					status: "error",
					isClosable: true,
					duration: 7000,
				});
			} else {
				toast({
					title: "Transaction Failed",
					description: "Please try again or contact support if the issue persists.",
					status: "error",
					isClosable: true,
					duration: 5000,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<MotionButton
				onClick={onOpen}
				size="lg"
				colorScheme="purple"
				fontFamily="Outfit"
				fontWeight="700"
				px={8}
				py={6}
				rightIcon={<FaShoppingCart />}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				_hover={{
					transform: "translateY(-2px)",
					boxShadow: "xl"
				}}
				transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			>
				Buy Fractions
			</MotionButton>

			<Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
				<ModalOverlay backdropFilter="blur(10px)" />
				<ModalContent bg={cardBg} rounded="2xl" border="1px solid" borderColor={borderColor}>
					<ModalHeader>
						<HStack spacing={3}>
							<Icon as={FaShoppingCart} color="purple.500" />
							<Text fontFamily="Outfit" fontWeight="700">
								Purchase Asset Fractions
							</Text>
						</HStack>
					</ModalHeader>
					<ModalCloseButton />
					
					<ModalBody pb={8}>
						<VStack spacing={6} align="stretch">
							{/* Asset Info */}
							<Box p={4} bg={useColorModeValue("gray.50", "gray.700")} rounded="xl">
								<VStack spacing={3}>
									<Text fontSize="lg" fontWeight="600" textAlign="center">
										Investment Details
									</Text>
									<HStack justify="space-between" w="full">
										<Text color="gray.500">Price per fraction:</Text>
										<HStack>
											<Text fontWeight="700" fontSize="lg" color="purple.500">
												{listing.currencyValuePerToken.displayValue}
											</Text>
											<Badge colorScheme="purple" variant="subtle">
												{listing.currencyValuePerToken.symbol}
											</Badge>
										</HStack>
									</HStack>
									<HStack justify="space-between" w="full">
										<Text color="gray.500">Available:</Text>
										<Text fontWeight="600">{maxQuantity} fractions</Text>
									</HStack>
								</VStack>
							</Box>

							{/* Quantity Selector */}
							<Box>
								<Text mb={3} fontWeight="600">Select Quantity:</Text>
								<NumberInput
									value={quantity}
									onChange={(_, value) => setQuantity(Math.min(value || 1, maxQuantity))}
									min={1}
									max={maxQuantity}
									size="lg"
								>
									<NumberInputField 
										bg={cardBg}
										border="2px solid"
										borderColor={borderColor}
										rounded="xl"
										_focus={{ borderColor: "purple.500" }}
									/>
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</Box>

							<Divider />

							{/* Total Calculation */}
							<Box p={4} bg={useColorModeValue("purple.50", "purple.900")} rounded="xl">
								<HStack justify="space-between">
									<Text fontSize="lg" fontWeight="600">Total Investment:</Text>
									<HStack>
										<Text fontSize="2xl" fontWeight="800" color="purple.500" fontFamily="Outfit">
											{totalPrice.toFixed(4)}
										</Text>
										<Badge colorScheme="purple" variant="solid" fontSize="md">
											{listing.currencyValuePerToken.symbol}
										</Badge>
									</HStack>
								</HStack>
							</Box>

							{/* Security Notice */}
							<HStack spacing={3} p={3} bg={useColorModeValue("green.50", "green.900")} rounded="lg">
								<Icon as={FaLock} color="green.500" />
								<Text fontSize="sm" color="green.600">
									This transaction is secured by blockchain technology and smart contracts.
								</Text>
							</HStack>

							{/* Purchase Button */}
							<Button
								onClick={handlePurchase}
								isLoading={isLoading}
								loadingText="Processing..."
								size="lg"
								colorScheme="purple"
								fontFamily="Outfit"
								fontWeight="700"
								py={6}
								rightIcon={isLoading ? <Spinner size="sm" /> : <FaCheckCircle />}
								_hover={{ transform: "translateY(-1px)" }}
								transition="all 0.2s ease"
							>
								{isLoading ? "Processing Purchase..." : `Confirm Purchase`}
							</Button>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>

			<OneIdVerification account={account} />
		</>
	);
}
