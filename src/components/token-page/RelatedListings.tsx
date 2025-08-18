import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { ComplianceBadge } from "@/components/shared/ComplianceBadge";
import { Link } from "@chakra-ui/next-js";
import {
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
	Text,
} from "@chakra-ui/react";
import { toEther } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

export default function RelatedListings({
	excludedListingId,
}: {
	excludedListingId: bigint;
}) {
	const { nftContract, allValidListings } = useMarketplaceContext();
	const listings = allValidListings?.filter(
		(o) =>
			o.id !== excludedListingId &&
			o.assetContractAddress.toLowerCase() ===
				nftContract.address.toLowerCase(),
	);
	if (!listings || !listings.length) return <></>;
	return (
		<AccordionItem>
			<Text>
				<AccordionButton>
					<Box as="span" flex="1" textAlign="left">
						More from this asset pool
					</Box>
					<AccordionIcon />
				</AccordionButton>
			</Text>
			<AccordionPanel pb={4}>
				<Box
					display="flex"
					overflowX="auto"
					whiteSpace="nowrap"
					padding="4"
					width="100%"
					gap="15px"
				>
					{listings?.map((item) => (
						<Box
							key={item.id.toString()}
							rounded="12px"
							as={Link}
							href={`/collection/${nftContract.chain.id}/${
								nftContract.address
							}/token/${item.asset.id.toString()}`}
							_hover={{ textDecoration: "none" }}
							minW={250}
						>
							<Flex direction="column">
								<MediaRenderer
									client={client}
									src={item.asset.metadata.image}
								/>
								<Text>{item.asset.metadata?.name ?? "Unknown item"}</Text>
								<ComplianceBadge verified={isVerified(item.asset.metadata)} />
								<Text>Price</Text>
								<Text>
									{item.currencyValuePerToken.displayValue}{" "}
									{item.currencyValuePerToken.symbol}
								</Text>
							</Flex>
						</Box>
					))}
				</Box>
			</AccordionPanel>
		</AccordionItem>
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
