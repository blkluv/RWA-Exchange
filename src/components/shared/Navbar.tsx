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
    <Box py="30px" px={{ base: "20px", lg: "50px" }}>
      <Flex direction="row" justifyContent="space-between" align="center">
        <Box my="auto">
          <Heading
            as={Link}
            href="/"
            _hover={{ textDecoration: "none" }}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontWeight="extrabold"
            size={{ base: "lg", md: "xl" }}
          >
            RWA ExChange
          </Heading>
        </Box>
        
        {/* Desktop Navigation */}
        <HStack display={{ lg: "flex", base: "none" }} spacing={4}>
          <HStack spacing={6}>
            <Link href="/landing" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium">About</Text>
            </Link>
            <Link href="/dashboard" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium">Dashboard</Text>
            </Link>
            <Link href="/collection" _hover={{ textDecoration: "none" }}>
              <Text fontWeight="medium">Marketplace</Text>
            </Link>
          </HStack>
          
          <ToggleThemeButton />
          
          {account ? (
            <ProfileButton address={account.address} onLogout={handleLogout} />
          ) : (
            <ConnectButton 
              client={client}
              theme="light"
              connectButton={{
                label: "Connect Wallet",
                style: {
                  height: "56px",
                  minWidth: "140px",
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
      <MenuButton as={Button} height="56px">
        <Flex direction="row" gap="5">
          <Box my="auto">
            <FiUser size={30} />
          </Box>
          <Image
            src={blo(address as `0x${string}`)}
            height="40px"
            rounded="8px"
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
    <Button height="56px" w="56px" onClick={toggleColorMode} mr="10px">
      {colorMode === "light" ? <FaRegMoon /> : <IoSunny />}
    </Button>
  );
}
