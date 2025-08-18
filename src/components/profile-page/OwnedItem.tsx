import { client } from "@/consts/client";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { ComplianceBadge } from "@/components/shared/ComplianceBadge";
import type { NFT, ThirdwebContract } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export function OwnedItem(props: {
  nft: NFT;
  nftCollection: ThirdwebContract;
}) {
  const { nft, nftCollection } = props;
  return (
    <>
      <Box
        rounded="12px"
        as={Link}
        href={`/collection/${nftCollection.chain.id}/${
          nftCollection.address
        }/token/${nft.id.toString()}`}
        _hover={{ textDecoration: "none" }}
        w={250}
      >
        <Flex direction="column">
          <MediaRenderer client={client} src={nft.metadata.image} />
          <Text>{nft.metadata?.name ?? "Unknown item"}</Text>
          <ComplianceBadge verified={isVerified(nft.metadata)} />
        </Flex>
      </Box>
    </>
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
