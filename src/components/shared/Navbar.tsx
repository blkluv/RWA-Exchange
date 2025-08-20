"use client";

import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  useColorMode,
  HStack,
  Text,
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import { SideMenu } from "./SideMenu";
import { client } from "@/consts/client";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { OneChainWalletButton } from "./OneChainWallet";

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  const handleLogout = async () => {
    if (wallet) {
      await disconnect(wallet);
    }
  };

  return (
    <Box py="16px" px={{ base: "20px", lg: "50px" }}>
      <Flex direction="row" justifyContent="space-between" align="center">
        <Box my="auto">
        <Heading
        as={Link}
        href="/"
        _hover={{ textDecoration: "none" }}
        color="purple.600"   // nice purple shade
        fontFamily="'Poppins', sans-serif" // unique, modern font
        fontWeight="extrabold"
        letterSpacing="wide"
        size={{ base: "md", md: "lg" }}
      >
        RWA EXCHANGE
</Heading>

        </Box>

        {/* Desktop Navigation */}
        <HStack display={{ lg: "flex", base: "none" }} spacing={4}>
          <HStack spacing={6}>
            <Link href="/landing" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium" fontSize="sm">About</Text>
            </Link>
            <Link href="/dashboard" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium" fontSize="sm">Dashboard</Text>
            </Link>
            <Link href="/collection" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium" fontSize="sm">Marketplace</Text>
            </Link>
          </HStack>

          <ToggleThemeButton />

          <OneChainWalletButton />

          {account ? (
            <ProfileButton address={account.address} onLogout={handleLogout} />
          ) : (
            <ConnectButton
              client={client}
              theme="light"
              connectButton={{
                label: "Connect Wallet",
                style: {
                  height: "40px",
                  minWidth: "120px",
                  fontSize: "14px"
                }
              }}
            />
          )}
        </HStack>

        <SideMenu />
      </Flex>
    </Box>
  );
}

function ProfileButton({ address, onLogout }: { address: string; onLogout: () => void }) {
  return (
    <Menu>
      <MenuButton as={Button} height="40px" px="12px">
        <Flex direction="row" gap="2" align="center">
          <Box>
            <FiUser size={18} />
          </Box>
          <Image
            src={blo(address as `0x${string}`)}
            height="24px"
            width="24px"
            rounded="6px"
          />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem as={Link} href="/profile" _hover={{ textDecoration: "none" }}>
          Profile
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
}

function ToggleThemeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button height="40px" w="40px" onClick={toggleColorMode} mr="8px">
      {colorMode === "light" ? <FaRegMoon size={16} /> : <IoSunny size={16} />}
    </Button>
  );
}