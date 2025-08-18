"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Tag,
  useColorModeValue,
  keyframes,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

function Section({ title, subtitle, children }: any) {
  return (
    <Box
      as="section"
      py={{ base: 12, md: 20 }}
      animation={`${fadeIn} 0.6s ease both`}
    >
      <Container maxW="6xl">
        <Stack spacing={3} mb={6}>
          <Heading size="lg">{title}</Heading>
          {subtitle && (
            <Text color="gray" fontSize={{ base: "md", md: "lg" }}>
              {subtitle}
            </Text>
          )}
        </Stack>
        {children}
      </Container>
    </Box>
  );
}

export default function LandingPage() {
  const glass = useColorModeValue(
    "rgba(255,255,255,0.6)",
    "rgba(0,0,0,0.35)"
  );
  const borderCol = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.08)");
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #DBEAFE 100%)",
    "linear-gradient(135deg, #0b1220 0%, #0f172a 40%, #111827 100%)"
  );

  return (
    <Box>
      {/* Hero */}
      <Box
        bg={gradient}
        pt={{ base: 16, md: 24 }}
        pb={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="6xl">
          <Flex direction={{ base: "column", md: "row" }} align="center" gap={10}>
            <Box flex="1" animation={`${fadeIn} 0.6s ease both`}>
              <Tag size="md" variant="subtle" colorScheme="blue" mb={4}>
                Hackathon Pitch Ready
              </Tag>
              <Heading size={{ base: "xl", md: "2xl" }} lineHeight={1.15}>
                Tokenize the Real World with OneRWA
              </Heading>
              <Text mt={4} fontSize={{ base: "md", md: "lg" }} color="gray">
                OneRWA makes real-world assets investable on-chain with fractional
                ownership, built-in compliance (OneID), and seamless wallet
                integration (OneWallet).
              </Text>
              <Flex gap={3} mt={6} wrap="wrap">
                <Button as={Link} href="/collection" colorScheme="blue">
                  Launch Marketplace
                </Button>
                <Button as={Link} href="/dashboard" variant="outline">
                  View Investor Dashboard
                </Button>
              </Flex>
            </Box>
            <Box
              flex="1"
              bg={glass}
              borderWidth="1px"
              borderColor={borderCol}
              backdropFilter="blur(8px)"
              rounded="lg"
              p={8}
              animation={`${float} 5s ease-in-out infinite`}
            >
              <Stack spacing={3}>
                <Heading size="md">Live Demo Features</Heading>
                <Text>• Fractional trading (Secondary market)</Text>
                <Text>• Property & Carbon categories</Text>
                <Text>• Real-time token data via Dexscreener</Text>
                <Text>• KYC-ready workflow with OneID</Text>
              </Stack>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* What is OneRWA */}
      <Section
        title="What is OneRWA?"
        subtitle="A full-stack protocol to tokenize and trade real-world assets (RWA) with compliance-first UX."
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {[
            {
              t: "Tokenization",
              d: "Mint assets as NFTs, enable fractional ERC20s, and unlock liquidity.",
            },
            {
              t: "Compliance",
              d: "OneID provides identity verification hooks for permissioned flows.",
            },
            {
              t: "Distribution",
              d: "OneWallet + marketplace rails make onboarding and trading simple.",
            },
          ].map((c, i) => (
            <FeatureCard key={i} title={c.t} desc={c.d} />
          ))}
        </SimpleGrid>
      </Section>

      {/* Fractional Ownership */}
      <Section
        title="How fractional ownership works"
        subtitle="Each asset NFT can be fractionalized into ERC20 tokens that trade on DEXs, enabling partial ownership and liquidity."
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <ExplainCard
            title="Mint"
            points={["Assets are minted as NFTs with on-chain metadata."]}
          />
          <ExplainCard
            title="Fractionalize"
            points={[
              "NFTs can be split into ERC20 fractions.",
              "Fractions trade on DEXs and can be redeemed subject to rules.",
            ]}
          />
          <ExplainCard
            title="Trade"
            points={[
              "Secondary market shows live price/liquidity via Dexscreener.",
              "Buy/sell fractions using popular DEXs and aggregators.",
            ]}
          />
          <ExplainCard
            title="Redeem"
            points={["Protocol-defined conditions allow redemption or payouts."]}
          />
        </SimpleGrid>
      </Section>

      {/* Compliance */}
      <Section
        title="Compliance via OneID"
        subtitle="Pluggable KYC/KYB checks integrated into the marketplace workflow."
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <FeatureCard title="KYC Ready" desc="Gate listings, purchases, or redemptions." />
          <FeatureCard title="Policy Hooks" desc="Toggle regions, limits, and accreditation." />
          <FeatureCard title="Audit Trail" desc="On-chain & off-chain proofs for compliance." />
        </SimpleGrid>
      </Section>

      {/* Wallet */}
      <Section
        title="Wallet integration with OneWallet"
        subtitle="Frictionless onboarding and embedded wallet UX."
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <FeatureCard title="Embedded UX" desc="Sign up with email, socials, or passkeys." />
          <FeatureCard title="Multi-chain" desc="Polygon, Avalanche and more out of the box." />
          <FeatureCard title="Security" desc="MPC / smart account options for enterprises." />
        </SimpleGrid>
      </Section>

      {/* Adoption Examples */}
      <Section
        title="Real-world adoption examples"
        subtitle="Industries already exploring tokenization with OneRWA."
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <ExampleCard title="Real Estate" desc="Fractional property ownership and rental streams." />
          <ExampleCard title="Gold" desc="Digitized bullion with redeemability and transparent custody." />
          <ExampleCard title="Carbon Credits" desc="Bridged credits with market transparency and traceability." />
        </SimpleGrid>
      </Section>

      {/* CTA */}
      <Section>
        <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" gap={4}>
          <Heading size="lg">Ready to demo OneRWA?</Heading>
          <Flex gap={3}>
            <Button as={Link} href="/collection" colorScheme="blue">
              Launch Marketplace
            </Button>
            <Button as={Link} href="/dashboard" variant="outline">
              Investor Dashboard
            </Button>
          </Flex>
        </Flex>
      </Section>
    </Box>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      rounded="lg"
      transition="all .2s ease"
      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray">{desc}</Text>
    </Box>
  );
}

function ExplainCard({ title, points }: { title: string; points: string[] }) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      rounded="lg"
      transition="all .2s ease"
      _hover={{ transform: "translateY(-4px)", shadow: "md" }}
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Stack spacing={2}>
        {points.map((p, i) => (
          <Text key={i} color="gray">
            • {p}
          </Text>
        ))}
      </Stack>
    </Box>
  );
}

function ExampleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Box
      p={6}
      borderWidth="1px"
      rounded="lg"
      bg={useColorModeValue("white", "#111827")}
      transition="all .2s ease"
      _hover={{ transform: "translateY(-6px)", shadow: "lg" }}
      animation={`${fadeIn} .6s ease both`}
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray">{desc}</Text>
    </Box>
  );
}
