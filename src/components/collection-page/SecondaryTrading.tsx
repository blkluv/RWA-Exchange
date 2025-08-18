import { client } from "@/consts/client";
import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Link as NextLink } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { MediaRenderer } from "thirdweb/react";

// SecondaryTrading: Displays basic trading info for fractionalized property tokens (ERC20)
// Note: Currently uses metadata attributes to discover ERC20 token address and mock stats.
// Attributes that will be checked (case-insensitive):
// - fraction_token
// - erc20_address
// - fractionAddress
// - token_address
export function SecondaryTrading() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3, xl: 4 });
  const items = listingsInSelectedCollection;

  // Dex data cache keyed by token address (lowercase)
  const [dexData, setDexData] = useState<Record<string, DexTokenStats>>({});
  const [loading, setLoading] = useState(false);

  const tokens = useMemo(() => {
    const set = new Set<string>();
    for (const it of items || []) {
      const erc20 = extractErc20Address(it.asset.metadata as any);
      if (erc20) set.add(erc20.toLowerCase());
    }
    return Array.from(set);
  }, [items]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!tokens.length) return;
      setLoading(true);
      try {
        const results = await Promise.all(
          tokens.map(async (addr) => ({ addr, data: await fetchDexForToken(addr) }))
        );
        if (cancelled) return;
        const map: Record<string, DexTokenStats> = {};
        for (const r of results) if (r.data) map[r.addr] = r.data;
        setDexData(map);
      } catch (e) {
        // noop, fallback UI will show
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [tokens]);

  if (!items?.length) {
    return (
      <Box mt="8" textAlign="center">
        <Text>No secondary market data available for this asset pool.</Text>
        <Text color="gray">List an item with a linked fraction token to populate.</Text>
      </Box>
    );
  }

  return (
    <Box mt="6">
      <Heading size="md" mb="4">
        Secondary Trading (ERC20 Fractions)
      </Heading>
      <SimpleGrid columns={columns} spacing={4}>
        {items.map((item) => {
          const meta = item.asset.metadata as any;
          const erc20 = extractErc20Address(meta);
          const chainId = nftContract.chain.id;
          const dexUrl = getDexUrl(chainId, erc20);
          const stats = erc20 ? dexData[erc20.toLowerCase()] : undefined;
          const mock = getMockStats(item.asset.id);
          return (
            <Flex
              key={`sec-${item.id.toString()}`}
              direction="column"
              rounded="12px"
              borderWidth="1px"
              borderColor="gray.200"
              p="4"
              gap="2"
            >
              <MediaRenderer client={client} src={meta?.image} />
              <Heading size="sm" mt="2">{meta?.name ?? "Unknown property"}</Heading>
              <Text color="gray">Token ID: {item.asset.id.toString()}</Text>
              <Text>
                Fraction Token: {erc20 ? shorten(erc20) : "Not linked"}
              </Text>

              <Box mt="2">
                <Text fontWeight="bold">Price</Text>
                <Text>
                  {stats?.priceUsd ? `$${formatNum(stats.priceUsd)}` : "-"}
                  {stats?.priceChangeH24 !== undefined && (
                    <Text as="span" color={stats.priceChangeH24 >= 0 ? "green.500" : "red.500"} ml="2">
                      ({stats.priceChangeH24.toFixed(2)}%)
                    </Text>
                  )}
                </Text>
              </Box>

              <Flex mt="2" gap="6">
                <Box>
                  <Text color="gray">Liquidity</Text>
                  <Text>
                    {stats?.liquidityUsd !== undefined
                      ? `$${formatNum(stats.liquidityUsd)}`
                      : `$${mock.liquidity.toLocaleString()}`}
                  </Text>
                </Box>
                <Box>
                  <Text color="gray">24h Volume</Text>
                  <Text>
                    {stats?.volume24hUsd !== undefined
                      ? `$${formatNum(stats.volume24hUsd)}`
                      : `$${mock.volume24h.toLocaleString()}`}
                  </Text>
                </Box>
              </Flex>

              <Flex mt="3" gap="3">
                {erc20 ? (
                  <Button as={Link} href={dexUrl} isExternal colorScheme="green" isDisabled={!erc20}>
                    Trade on DEX
                  </Button>
                ) : (
                  <Button as={NextLink} href={`/collection/${nftContract.chain.id}/${nftContract.address}/token/${item.asset.id.toString()}`}>
                    View Property
                  </Button>
                )}
              </Flex>

              {loading && !stats && erc20 && (
                <Text color="gray" fontSize="sm" mt="2">Loading market data…</Text>
              )}
            </Flex>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}

function extractErc20Address(metadata: any): string | null {
  try {
    const lowerKeys = Object.fromEntries(
      Object.entries(metadata || {}).map(([k, v]) => [String(k).toLowerCase(), v])
    );
    const direct =
      lowerKeys["erc20_address"] ||
      lowerKeys["fraction_token"] ||
      lowerKeys["fractionaddress"] ||
      lowerKeys["token_address"]; 
    if (typeof direct === "string" && direct.startsWith("0x") && direct.length === 42) return direct;

    const attrs = (metadata?.attributes || []) as Array<any>;
    for (const a of attrs) {
      const t = String(a?.trait_type || a?.traitType || "").toLowerCase();
      if (["erc20_address", "fraction_token", "fractionaddress", "token_address"].includes(t)) {
        const val = String(a?.value || "");
        if (val.startsWith("0x") && val.length === 42) return val;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getDexUrl(chainId: number, token: string | null): string {
  if (!token) return "#";
  // Basic router links for common chains (placeholder). You may customize per chain.
  switch (chainId) {
    case 1: // Ethereum Mainnet
      return `https://app.uniswap.org/explore/tokens/ethereum/${token}`;
    case 137: // Polygon
      return `https://app.uniswap.org/explore/tokens/polygon/${token}`;
    case 10: // Optimism
      return `https://app.uniswap.org/explore/tokens/optimism/${token}`;
    case 8453: // Base
      return `https://app.uniswap.org/explore/tokens/base/${token}`;
    default:
      return `https://dexscreener.com/search?q=${token}`;
  }
}

function getMockStats(tokenId: bigint) {
  // Deterministic pseudo-random mock data from tokenId
  const seed = Number(tokenId % 1000n);
  const liquidity = 50000 + seed * 23;
  const volume24h = 10000 + seed * 13;
  const points = 30 + (seed % 20);
  return { liquidity, volume24h, points };
}

function shorten(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

type DexTokenStats = {
  priceUsd?: number;
  liquidityUsd?: number;
  volume24hUsd?: number;
  priceChangeH24?: number;
};

async function fetchDexForToken(tokenAddress: string): Promise<DexTokenStats | undefined> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    if (!res.ok) return undefined;
    const json: any = await res.json();
    const pairs = Array.isArray(json?.pairs) ? json.pairs : [];
    if (!pairs.length) return undefined;
    // Choose pair with highest liquidity in USD
    let best = pairs[0];
    for (const p of pairs) {
      if ((p?.liquidity?.usd || 0) > (best?.liquidity?.usd || 0)) best = p;
    }
    const priceUsd = Number(best?.priceUsd || best?.price?.usd || best?.price || 0);
    const liquidityUsd = Number(best?.liquidity?.usd || 0);
    const volume24hUsd = Number(best?.volume?.h24 || best?.txns?.h24?.volume || 0);
    const priceChangeH24 = Number(best?.priceChange?.h24 ?? 0);
    return { priceUsd, liquidityUsd, volume24hUsd, priceChangeH24 };
  } catch {
    return undefined;
  }
}

function formatNum(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}
