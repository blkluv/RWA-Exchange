"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";
import { client } from "@/consts/client";
import Dashboard from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  const account = useActiveAccount();
  const { connect } = useConnectModal();

  useEffect(() => {
    if (!account) {
      connect({ client });
    }
  }, [account, connect]);

  if (!account)
    return (
      <Box>
        <Flex>
          <Heading m="auto">Log in to continue</Heading>
        </Flex>
      </Box>
    );

  return <Dashboard />;
}
