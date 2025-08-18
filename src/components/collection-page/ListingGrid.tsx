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

type Category = "all" | "property" | "carbon";

export function ListingGrid({ category = "all" }: { category?: Category }) {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const filtered = (listingsInSelectedCollection || []).filter((item) =>
    isInCategory(item.asset?.metadata, category)
  );
  const len = filtered.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 4),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });
  if (!filtered.length) return <></>;
  return (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {filtered.map((item) => (
        <Box
          key={item.id}
          rounded="12px"
          as={Link}
          href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}
          _hover={{ textDecoration: "none" }}
        >
          <Flex direction="column">
            <MediaRenderer client={client} src={item.asset.metadata.image} />
            <Text>{item.asset?.metadata?.name ?? "Unknown item"}</Text>
            <ComplianceBadge verified={isVerified(item.asset.metadata)} />
            <Text>Price</Text>
            <Text>
              {item.currencyValuePerToken.displayValue} {item.currencyValuePerToken.symbol}
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

function isInCategory(metadata: any, category: Category): boolean {
  if (category === "all") return true;
  try {
    const lower = Object.fromEntries(
      Object.entries(metadata || {}).map(([k, v]) => [String(k).toLowerCase(), v])
    );
    const direct = String(
      lower["category"] || lower["asset_type"] || lower["type"] || ""
    ).toLowerCase();
    if (direct) {
      if (category === "carbon") return direct.includes("carbon");
      if (category === "property")
        return direct.includes("property") || direct.includes("real estate");
    }
    const attrs = (metadata?.attributes || []) as Array<any>;
    for (const a of attrs) {
      const t = String(a?.trait_type || a?.traitType || "").toLowerCase();
      if (["category", "asset_type", "type"].includes(t)) {
        const v = String(a?.value || "").toLowerCase();
        if (category === "carbon" && v.includes("carbon")) return true;
        if (
          category === "property" &&
          (v.includes("property") || v.includes("real estate"))
        )
          return true;
      }
      if (t === "is_carbon") {
        const v = String(a?.value || "").toLowerCase();
        if (category === "carbon" && (v === "true" || v === "yes" || v === "1"))
          return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
