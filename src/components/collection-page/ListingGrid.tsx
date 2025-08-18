import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";
import { ComplianceBadge } from "@/components/shared/ComplianceBadge";

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 4),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });
  if (!listingsInSelectedCollection || !len) return <></>;
  return (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {listingsInSelectedCollection.map((item) => (
        <Box
          key={item.id}
          rounded="12px"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${
            nftContract.address
          }/token/${item.asset.id.toString()}`}
          _hover={{ textDecoration: "none" }}
        >
          <Flex direction="column">
            <MediaRenderer client={client} src={item.asset.metadata.image} />
            <Text>{item.asset?.metadata?.name ?? "Unknown item"}</Text>
            <ComplianceBadge verified={isVerified(item.asset.metadata)} />
            <Text>Price</Text>
            <Text>
              {item.currencyValuePerToken.displayValue}{" "}
              {item.currencyValuePerToken.symbol}
            </Text>
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function isVerified(metadata: any): boolean {
  try {
    const attrs = (metadata?.attributes || []) as Array<any>;
    const flag = attrs.find(
      (a) =>
        (a.trait_type || a.traitType || "").toLowerCase() === "compliance" ||
        (a.trait_type || a.traitType || "").toLowerCase() === "verified",
    );
    if (!flag) return false;
    const val = String(flag.value || "").toLowerCase();
    return val === "true" || val === "yes" || val === "verified";
  } catch {
    return false;
  }
}
