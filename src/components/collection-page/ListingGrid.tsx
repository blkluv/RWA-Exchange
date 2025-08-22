import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Flex,
  SimpleGrid,
  useBreakpointValue,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { MediaRenderer } from "thirdweb/react";
import { ComplianceBadge } from "@/components/shared/ComplianceBadge";

type Category = "all" | "property" | "carbon";

interface ERC4907Metadata {
  name?: string;
  image?: string;
  attributes?: Array<{ trait_type?: string; traitType?: string; value?: any }>;
  owner?: string;
  user?: string;
  expires?: string; // UNIX timestamp or ISO string
}

export function ListingGrid({ category = "all" }: { category?: Category }) {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();

  const demoListings = [
    {
      id: 1n,
      asset: {
        id: 1n,
        metadata: {
          name: "///airship.neat.sulky",
          image: "https://i.imgur.com/s3iIMfD.jpeg?w=400&h=400&fit=crop",
          attributes: [
            { trait_type: "CITY", value: "ATL5D" },
            { trait_type: "RWA ST", value: "$ANS" },
            { trait_type: "HAHZTAG", value: "#airshipneatsulky" },
          ],
          owner: "0x8F3b48431FA3d9b92ff7157E890105F9B5f96089",
          user: "0x8F3b48431FA3d9b92ff7157E890105F9B5f96089",
          expires: "2025-12-31T23:59:59Z",
        },
      },
      currencyValuePerToken: { displayValue: "0.025", symbol: "ETH" },
    },
    {
      id: 2n,
      asset: {
        id: 2n,
        metadata: {
          name: "Carbon Credit Portfolio",
          image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
          attributes: [
            { trait_type: "category", value: "carbon" },
            { trait_type: "type", value: "Forest Conservation" },
            { trait_type: "compliance", value: "verified" },
          ],
          owner: "0xOwnerAddress2",
        },
      },
      currencyValuePerToken: { displayValue: "0.01", symbol: "ETH" },
    },
  ];

  const listingsToShow =
    listingsInSelectedCollection && listingsInSelectedCollection.length > 0
      ? listingsInSelectedCollection
      : demoListings;

  const filtered = listingsToShow.filter((item) =>
    isInCategory(normalizeMetadata(item.asset?.metadata), category)
  );

  const len = filtered.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 4),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });

  if (!filtered.length) return <Text textAlign="center">No items found</Text>;

  return (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {filtered.map((item) => {
        const meta = normalizeMetadata(item.asset.metadata);
        const verified = isVerified(meta);
        const isRentable = !!meta.user && !!meta.expires;

        return (
          <Box
            key={item.id.toString()}
            rounded="12px"
            border="1px solid"
            borderColor="gray.200"
            overflow="hidden"
            as={Link}
            href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}
            _hover={{ textDecoration: "none", shadow: "lg" }}
          >
            <VStack spacing={2} p={2}>
              <MediaRenderer client={client} src={meta.image || ""} />
              <Text fontWeight="bold">{meta.name ?? "Unknown Item"}</Text>

              <ComplianceBadge verified={verified} />

              {meta.owner && (
                <Text fontSize="sm">Owner: {shortenAddress(meta.owner)}</Text>
              )}
              {isRentable && (
                <HStack spacing={2} fontSize="sm">
                  <Badge colorScheme="purple">Rented</Badge>
                  <Text>
                    User: {meta.user ? shortenAddress(meta.user) : "N/A"}
                  </Text>
                  <Text>Expires: {formatDate(meta.expires || "")}</Text>
                </HStack>
              )}

              <Text fontWeight="bold">Price</Text>
              <Text>
                {item.currencyValuePerToken.displayValue}{" "}
                {item.currencyValuePerToken.symbol}
              </Text>
            </VStack>
          </Box>
        );
      })}
    </SimpleGrid>
  );
}

/**
 * Normalize NFT metadata to ERC4907Metadata shape
 */
function normalizeMetadata(metadata: any): ERC4907Metadata {
  if (!metadata) return {};
  const normalized: ERC4907Metadata = {
    name: metadata.name,
    image: metadata.image,
    owner: metadata.owner,
    user: metadata.user,
    expires: metadata.expires,
    attributes: [],
  };

  if (Array.isArray(metadata.attributes)) {
    normalized.attributes = metadata.attributes.map((attr: any) => ({
      trait_type: attr.trait_type ?? attr.traitType,
      value: attr.value,
    }));
  } else if (metadata.attributes && typeof metadata.attributes === "object") {
    normalized.attributes = Object.entries(metadata.attributes).map(
      ([k, v]) => ({
        trait_type: k,
        value: v,
      })
    );
  }

  return normalized;
}

function isVerified(metadata: ERC4907Metadata): boolean {
  try {
    const attrs = metadata?.attributes || [];
    const flag = attrs.find(
      (a) =>
        (a.trait_type || a.traitType || "").toLowerCase() === "compliance" ||
        (a.trait_type || a.traitType || "").toLowerCase() === "verified"
    );
    if (!flag) return false;
    const val = String(flag.value || "").toLowerCase();
    return val === "true" || val === "yes" || val === "verified";
  } catch {
    return false;
  }
}

function isInCategory(metadata: ERC4907Metadata, category: Category): boolean {
  if (category === "all") return true;
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
  const attrs = metadata?.attributes || [];
  for (const a of attrs) {
    const t = String(a?.trait_type || a?.traitType || "").toLowerCase();
    const v = String(a?.value || "").toLowerCase();
    if (category === "carbon" && v.includes("carbon")) return true;
    if (
      category === "property" &&
      (v.includes("property") || v.includes("real estate"))
    )
      return true;
    if (
      t === "is_carbon" &&
      category === "carbon" &&
      (v === "true" || v === "yes" || v === "1")
    )
      return true;
  }
  return false;
}

function shortenAddress(addr: string): string {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

function formatDate(dateStr: string): string {
  try {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}
