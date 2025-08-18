"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { FaArrowRight, FaChartLine, FaGlobe, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={gradient}
        py={{ base: 16, md: 24 }}
        color="white"
        textAlign="center"
      >
        <Container maxW="6xl">
          <VStack spacing={6}>
            <Badge colorScheme="purple" variant="solid" px={4} py={2} rounded="full">
              🌟 Live Marketplace
            </Badge>
            
            <Heading size={{ base: "xl", md: "3xl" }} fontWeight="bold">
              Invest in Real-World Assets
            </Heading>
            
            <Text fontSize={{ base: "lg", md: "xl" }} maxW="2xl" opacity={0.9}>
              Discover tokenized real estate, art, commodities, and more. 
              Start with fractional ownership from just $100.
            </Text>
            
            <HStack spacing={4} pt={4}>
              <Button 
                as={Link} 
                href="/landing" 
                size="lg"
                colorScheme="white"
                variant="solid"
                color="purple.600"
                rightIcon={<FaArrowRight />}
              >
                Learn More
              </Button>
              <Button 
                as={Link} 
                href="/dashboard" 
                size="lg"
                variant="outline"
                borderColor="white"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                View Dashboard
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Quick Stats */}
      <Box py={12} bg={useColorModeValue("gray.50", "gray.900")}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <VStack>
              <Icon as={FaChartLine} w={8} h={8} color="purple.500" />
              <Stat textAlign="center">
                <StatNumber fontSize="2xl" color="purple.500">$2.5M+</StatNumber>
                <StatLabel>Total Value Locked</StatLabel>
              </Stat>
            </VStack>
            <VStack>
              <Icon as={FaGlobe} w={8} h={8} color="purple.500" />
              <Stat textAlign="center">
                <StatNumber fontSize="2xl" color="purple.500">25+</StatNumber>
                <StatLabel>Asset Categories</StatLabel>
              </Stat>
            </VStack>
            <VStack>
              <Icon as={FaShieldAlt} w={8} h={8} color="purple.500" />
              <Stat textAlign="center">
                <StatNumber fontSize="2xl" color="purple.500">150+</StatNumber>
                <StatLabel>Verified Investors</StatLabel>
              </Stat>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Assets */}
      <Container maxW="6xl" py={16}>
        <VStack spacing={8} mb={12}>
          <Heading size="xl" textAlign="center">
            Featured Real-World Assets
          </Heading>
          <Text fontSize="lg" color={textColor} textAlign="center" maxW="2xl">
            Explore our curated selection of tokenized assets. Each asset is verified, 
            compliant, and ready for fractional investment.
          </Text>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
          {NFT_CONTRACTS.slice(0, 6).map((item) => (
            <Link
              key={item.address}
              href={`/collection/${item.chain.id.toString()}/${item.address}`}
              _hover={{ textDecoration: "none" }}
            >
              <Box
                bg={cardBg}
                rounded="xl"
                overflow="hidden"
                shadow="lg"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
              >
                <Image 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  w="full"
                  h="200px"
                  objectFit="cover"
                />
                <Box p={6}>
                  <VStack align="start" spacing={3}>
                    <Badge colorScheme="purple" variant="subtle">
                      {item.type}
                    </Badge>
                    <Heading size="md" noOfLines={2}>
                      {item.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm" noOfLines={2}>
                      {item.description || "Premium tokenized asset available for fractional investment"}
                    </Text>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="purple.500" fontWeight="medium">
                        Chain: {item.chain.name || "Multi-chain"}
                      </Text>
                      <Icon as={FaArrowRight} color="purple.500" />
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
        
        <Flex justify="center" mt={12}>
          <Button 
            as={Link} 
            href="/collection" 
            size="lg"
            colorScheme="purple"
            rightIcon={<FaArrowRight />}
          >
            View All Assets
          </Button>
        </Flex>
      </Container>
    </Box>
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
