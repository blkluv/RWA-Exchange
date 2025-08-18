"use client";

import { NFT_CONTRACTS } from "@/consts/nft_contracts";
import { Link } from "@chakra-ui/next-js";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Icon,
  Image,
  Button,
  Input,
  Select,
  Flex,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FaArrowRight, FaSearch, FaFilter } from "react-icons/fa";
import { useState } from "react";

export default function CollectionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const filteredContracts = NFT_CONTRACTS.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Container maxW="7xl" py={8}>
      {/* Header */}
      <VStack spacing={6} mb={12} textAlign="center">
        <Heading size="2xl">Asset Marketplace</Heading>
        <Text fontSize="lg" color={textColor} maxW="2xl">
          Discover and invest in tokenized real-world assets. From real estate to art, 
          find your next investment opportunity.
        </Text>
      </VStack>

      {/* Search and Filter */}
      <Box mb={8}>
        <Flex 
          direction={{ base: "column", md: "row" }} 
          gap={4} 
          align={{ base: "stretch", md: "center" }}
        >
          <InputGroup flex={1}>
            <InputLeftElement>
              <Icon as={FaSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
              borderColor={borderColor}
            />
          </InputGroup>
          
          <HStack spacing={4}>
            <Icon as={FaFilter} color="gray.400" />
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              bg={cardBg}
              borderColor={borderColor}
              minW="150px"
            >
              <option value="all">All Types</option>
              <option value="ERC721">ERC721</option>
              <option value="ERC1155">ERC1155</option>
            </Select>
          </HStack>
        </Flex>
      </Box>

      {/* Results Count */}
      <Text mb={6} color={textColor}>
        Showing {filteredContracts.length} of {NFT_CONTRACTS.length} assets
      </Text>

      {/* Asset Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
        {filteredContracts.map((item) => (
          <Link
            key={item.address}
            href={`/collection/${item.chain.id.toString()}/${item.address}`}
            _hover={{ textDecoration: "none" }}
          >
            <Box
              bg={cardBg}
              rounded="xl"
              overflow="hidden"
              shadow="md"
              transition="all 0.3s ease"
              _hover={{ 
                transform: "translateY(-4px)", 
                shadow: "xl",
                borderColor: "purple.200"
              }}
              borderWidth="1px"
              borderColor={borderColor}
              h="full"
            >
              <Image 
                src={item.thumbnailUrl} 
                alt={item.title}
                w="full"
                h="200px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/300x200?text=Asset+Image"
              />
              
              <Box p={5}>
                <VStack align="start" spacing={3} h="full">
                  <HStack justify="space-between" w="full">
                    <Badge 
                      colorScheme={item.type === "ERC721" ? "blue" : "green"} 
                      variant="subtle"
                    >
                      {item.type}
                    </Badge>
                    <Badge colorScheme="purple" variant="outline" fontSize="xs">
                      {item.chain.name || "Multi-chain"}
                    </Badge>
                  </HStack>
                  
                  <Heading size="sm" noOfLines={2} minH="40px">
                    {item.title}
                  </Heading>
                  
                  <Text 
                    color={textColor} 
                    fontSize="sm" 
                    noOfLines={3}
                    flex={1}
                  >
                    {item.description || "Premium tokenized asset available for fractional investment. Verified and compliant with regulatory standards."}
                  </Text>
                  
                  <HStack justify="space-between" w="full" pt={2}>
                    <Text fontSize="xs" color="purple.500" fontWeight="medium">
                      View Details
                    </Text>
                    <Icon as={FaArrowRight} color="purple.500" w={3} h={3} />
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </Link>
        ))}
      </SimpleGrid>

      {/* Empty State */}
      {filteredContracts.length === 0 && (
        <VStack spacing={4} py={16} textAlign="center">
          <Heading size="md" color={textColor}>No assets found</Heading>
          <Text color={textColor}>
            Try adjusting your search terms or filters
          </Text>
          <Button 
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
            colorScheme="purple"
            variant="outline"
          >
            Clear Filters
          </Button>
        </VStack>
      )}

      {/* Call to Action */}
      <Box 
        mt={16} 
        p={8} 
        bg={useColorModeValue("purple.50", "purple.900")} 
        rounded="xl"
        textAlign="center"
      >
        <VStack spacing={4}>
          <Heading size="lg">Ready to Start Investing?</Heading>
          <Text color={textColor} maxW="md">
            Connect your wallet to start investing in tokenized real-world assets. 
            Fractional ownership starts from just $100.
          </Text>
          <Button 
            as={Link} 
            href="/dashboard" 
            colorScheme="purple"
            size="lg"
            rightIcon={<FaArrowRight />}
          >
            Go to Dashboard
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}