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
} from "@chakra-ui/react";
import { blo } from "blo";
import { FaRegMoon } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoSunny } from "react-icons/io5";
import { SideMenu } from "./SideMenu";
import { HarmonyExtension } from "@harmony-js/core";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    onewallet?: any;
  }
}

export function Navbar() {
  const [account, setAccount] = useState<any>(null);
  // Use a permissive type here because HarmonyExtension's type declarations are a namespace in @harmony-js/core
  // which cannot be used directly as a type parameter. Runtime usage remains the same.
  const [harmonyExtension, setHarmonyExtension] = useState<any>(null);

  useEffect(() => {
    const initHarmonyExtension = async () => {
      if (window.onewallet) {
        const extension = new HarmonyExtension(window.onewallet);
        setHarmonyExtension(extension);
        const loggedInAccount = await extension.login();
        setAccount(loggedInAccount);
      }
    };
    initHarmonyExtension();
  }, []);

  const handleLogin = async () => {
    if (harmonyExtension) {
      const acc = await harmonyExtension.login();
      setAccount(acc);
    }
  };

  const handleLogout = async () => {
    if (harmonyExtension) {
      await harmonyExtension.logout();
      setAccount(null);
    }
  };

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box py="30px" px={{ base: "20px", lg: "50px" }}>
      <Flex direction="row" justifyContent="space-between">
        <Box my="auto">
          <Heading
            as={Link}
            href="/"
            _hover={{ textDecoration: "none" }}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
            fontWeight="extrabold"
          >
            OneRWA Marketplace
          </Heading>
        </Box>
        <Box display={{ lg: "block", base: "none" }}>
          <ToggleThemeButton />
          {account ? (
            <ProfileButton address={account.address} onLogout={handleLogout} />
          ) : (
            <Button onClick={handleLogin} height="56px">
              Connect OneWallet
            </Button>
          )}
        </Box>
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
