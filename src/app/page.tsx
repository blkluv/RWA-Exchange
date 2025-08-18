"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex>
      <Box mt="24px" m="auto">
        <Flex direction="column" gap="4">
          {/* Delete this <Card /> in your own app */}
          <Card border="1px" maxW="90vw" mx="auto">
            <CardHeader>
              <Heading size="md">Welcome to OneRWA Marketplace</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                {_rwaFeatures.map((item) => (
                  <Box key={item.title}>
                    <Heading size="xs" textTransform="uppercase">
                      {item.title}
                    </Heading>
                    {item.bullet_points.map((pt) => (
                      <Text pt="2" fontSize="sm" key={pt}>
                        {pt}
                      </Text>
                    ))}
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Heading ml="20px" mt="40px">
            Featured Real-World Assets
          </Heading>
          <Flex
            direction="row"
            wrap="wrap"
            mt="20px"
            gap="5"
            justifyContent="space-evenly"
          >
            {NFT_CONTRACTS.map((item) => (
              <Link
                _hover={{ textDecoration: "none" }}
                w={300}
                h={400}
                key={item.address}
                href={`/collection/${item.chain.id.toString()}/${item.address}`}
              >
                <Image src={item.thumbnailUrl} />
                <Text fontSize="large" mt="10px">
                  {item.title}
                </Text>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

// Delete this in your own app
const _rwaFeatures: Array<{ title: string; bullet_points: string[] }> = [
  {
    title: "Property Tokenization",
    bullet_points: [
      "Invest in fractional ownership of real estate properties from around the world.",
    ],
  },
  {
    title: "Fractional Ownership",
    bullet_points: [
      "Buy and sell fractions of high-value assets like fine art, luxury watches, and classic cars.",
    ],
  },
  {
    title: "Compliance Ready",
    bullet_points: [
      "Our platform is built with regulatory compliance in mind, ensuring secure and transparent transactions.",
    ],
  },
  {
    title: "Global Access",
    bullet_points: ["Access a diverse range of real-world assets from a global marketplace."],
  },
  {
    title: "Get Started",
    bullet_points: [
      "Connect your wallet to start browsing and trading tokenized real-world assets.",
      "Learn more about our mission at our main site.",
    ],
  },
];
