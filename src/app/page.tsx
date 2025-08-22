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
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FaArrowRight, FaChartLine, FaGlobe, FaShieldAlt, FaStar, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export default function Home() {
  const gradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #000000 0%, #1a0033 50%, #330066 100%)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const glowColor = useColorModeValue("purple.500", "purple.300");

  return (
    <Box bg="black">
      {/* Hero Section with Advanced Animations */}
      <Box
        bg={gradient}
        py={{ base: 20, md: 32 }}
        color="white"
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Animated Background Elements */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          w="100px"
          h="100px"
          borderRadius="full"
          bg="whiteAlpha.100"
          animation={`${float} 6s ease-in-out infinite`}
        />
        <Box
          position="absolute"
          top="60%"
          right="15%"
          w="60px"
          h="60px"
          borderRadius="full"
          bg="whiteAlpha.150"
          animation={`${float} 4s ease-in-out infinite reverse`}
        />
        
        {/* Mint Green Floating Elements */}
        <Box
          position="absolute"
          top="20%"
          right="20%"
          w="40px"
          h="40px"
          borderRadius="full"
          bg="rgba(152, 251, 152, 0.3)"
          animation={`${float} 5s ease-in-out infinite`}
          filter="blur(8px)"
        />
        <Box
          position="absolute"
          bottom="30%"
          left="20%"
          w="30px"
          h="30px"
          borderRadius="full"
          bg="rgba(152, 251, 152, 0.4)"
          animation={`${float} 7s ease-in-out infinite reverse`}
          filter="blur(6px)"
        />
        
        <Container maxW="7xl" position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <VStack spacing={8}>
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                <Badge 
                  colorScheme="purple" 
                  variant="solid" 
                  px={6} 
                  py={3} 
                  rounded="full"
                  fontSize="md"
                  fontFamily="Outfit"
                  fontWeight="600"
                  boxShadow="0 0 20px rgba(128, 0, 128, 0.6)"
                  border="2px solid"
                  borderColor="purple.400"
                >
                RWA Blockchain Wall Street
                </Badge>
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <Heading 
                  size={{ base: "2xl", md: "4xl" }} 
                  fontFamily="Outfit"
                  fontWeight="800"
                  lineHeight="1.1"
                  bgGradient="linear(to-r, white, #9F7AEA)"
                  bgClip="text"
                  maxW="5xl"
                  textShadow="0 0 30px rgba(159, 122, 234, 0.5)"
                >
                  Fractionalize the Planet. Trade Like Wall Street.
                </Heading>
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Text 
                  fontSize={{ base: "lg", md: "xl" }} 
                  maxW="3xl" 
                  opacity={0.9}
                  fontFamily="Inter"
                  lineHeight="1.8"
                  color="gray.200"
                >
                  Every asset has a rentable address. Every share has a ticker. Invest seamlessly in
                  tokenized real-world assets, precisely located by what3words. Build your portfolio
                  with ownership stakes starting at $100.
                </Text>
              </MotionBox>
              
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <HStack spacing={6} pt={6} flexWrap="wrap" justify="center">
                  <Button 
                    as={Link} 
                    href="/collection" 
                    size="lg"
                    bg="linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)"
                    color="white"
                    fontFamily="Outfit"
                    fontWeight="700"
                    px={8}
                    py={6}
                    rightIcon={<FaArrowRight />}
                    _hover={{ 
                      transform: "translateY(-3px) scale(1.05)",
                      boxShadow: "0 0 30px rgba(159, 122, 234, 0.6)",
                      bg: "linear-gradient(135deg, #805AD5 0%, #6B46C1 100%)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    border="2px solid"
                    borderColor="purple.300"
                  >
                    Explore Marketplace
                  </Button>
                  <Button 
                    as={Link} 
                    href="/dashboard" 
                    size="lg"
                    variant="outline"
                    borderColor="#98FB98"
                    borderWidth="2px"
                    color="#98FB98"
                    fontFamily="Outfit"
                    fontWeight="600"
                    px={8}
                    py={6}
                    _hover={{ 
                      bg: "rgba(152, 251, 152, 0.1)",
                      transform: "translateY(-3px)",
                      borderColor: "#7CFC00",
                      color: "#7CFC00",
                      boxShadow: "0 0 20px rgba(152, 251, 152, 0.4)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  >
                    View Dashboard
                  </Button>
                </HStack>
              </MotionBox>
            </VStack>
          </MotionBox>
        </Container>
      </Box>

      {/* Animated Stats Section */}
      <Box py={20} bg="black" position="relative">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
            {[
              { icon: FaChartLine, value: "$2.5M+", label: "Total Value Locked", color: "purple" },
              { icon: FaGlobe, value: "25+", label: "Asset Categories", color: "green" },
              { icon: FaShieldAlt, value: "150+", label: "Verified Investors", color: "#98FB98" }
            ].map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <VStack 
                  spacing={6} 
                  p={8} 
                  bg="rgba(26, 0, 51, 0.8)"
                  rounded="2xl" 
                  shadow="lg"
                  border="1px solid"
                  borderColor={stat.color === "#98FB98" ? "rgba(152, 251, 152, 0.3)" : `${stat.color}.400`}
                  backdropFilter="blur(10px)"
                  _hover={{ 
                    transform: "translateY(-5px)",
                    shadow: "0 0 30px rgba(159, 122, 234, 0.4)",
                    borderColor: stat.color === "#98FB98" ? "#98FB98" : `${stat.color}.500`
                  }}
                  transition="all 0.3s ease"
                >
                  <Box
                    p={4}
                    bg={stat.color === "#98FB98" ? "rgba(152, 251, 152, 0.2)" : `${stat.color}.50`}
                    rounded="full"
                    animation={`${pulse} 2s ease-in-out infinite`}
                    border="1px solid"
                    borderColor={stat.color === "#98FB98" ? "rgba(152, 251, 152, 0.4)" : `${stat.color}.200`}
                  >
                    <Icon 
                      as={stat.icon} 
                      w={10} 
                      h={10} 
                      color={stat.color === "#98FB98" ? "#98FB98" : `${stat.color}.500`} 
                    />
                  </Box>
                  <Stat textAlign="center">
                    <StatNumber 
                      fontSize="4xl" 
                      fontFamily="Outfit"
                      fontWeight="800"
                      color={stat.color === "#98FB98" ? "#98FB98" : `${stat.color}.500`}
                      textShadow={stat.color === "#98FB98" ? "0 0 10px rgba(152, 251, 152, 0.5)" : "none"}
                    >
                      {stat.value}
                    </StatNumber>
                    <StatLabel 
                      fontSize="lg" 
                      fontFamily="Inter"
                      fontWeight="500"
                      color="gray.300"
                    >
                      {stat.label}
                    </StatLabel>
                  </Stat>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Featured Assets with Enhanced Animations */}
      <Container maxW="7xl" py={24} bg="black">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} mb={16}>
            <Heading 
              size="2xl" 
              textAlign="center"
              fontFamily="Outfit"
              fontWeight="800"
              bgGradient="linear(to-r, #9F7AEA, #98FB98)"
              bgClip="text"
              textShadow="0 0 20px rgba(159, 122, 234, 0.4)"
            >
              Featured Real-World Assets
            </Heading>
            <Text 
              fontSize="xl" 
              color="gray.300" 
              textAlign="center" 
              maxW="3xl"
              fontFamily="Inter"
              lineHeight="1.8"
            >
              Discover premium tokenized assets with verified ownership, regulatory compliance, 
              and instant liquidity. Start investing with as little as $100.
            </Text>
          </VStack>
        </MotionBox>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {NFT_CONTRACTS.slice(0, 6).map((item, index) => (
            <MotionCard
              key={item.address}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              bg="rgba(26, 0, 51, 0.8)"
              rounded="2xl"
              overflow="hidden"
              shadow="lg"
              border="1px solid"
              borderColor="purple.700"
              backdropFilter="blur(10px)"
              _hover={{ 
                shadow: "0 0 30px rgba(159, 122, 234, 0.4)",
                borderColor: "purple.500"
              }}
              position="relative"
              cursor="pointer"
            >
              <Box position="relative" overflow="hidden">
                <Image 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  w="full"
                  h="240px"
                  objectFit="cover"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.05)" }}
                />
                <Box
                  position="absolute"
                  top={4}
                  right={4}
                  bg="rgba(0, 0, 0, 0.8)"
                  px={3}
                  py={1}
                  rounded="full"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="purple.400"
                >
                  <Badge colorScheme="purple" variant="solid" fontSize="xs">
                    {item.type}
                  </Badge>
                </Box>
              </Box>
              
              <CardBody p={6}>
                <VStack align="start" spacing={4}>
                  <Heading 
                    size="md" 
                    noOfLines={2}
                    fontFamily="Outfit"
                    fontWeight="700"
                    color="white"
                  >
                    {item.title}
                  </Heading>
                  
                  <Text 
                    color="gray.300" 
                    fontSize="sm" 
                    noOfLines={3}
                    lineHeight="1.6"
                  >
                    {item.description || "Premium tokenized asset with verified ownership and regulatory compliance. Perfect for fractional investment opportunities."}
                  </Text>
                  
                  <HStack justify="space-between" w="full" pt={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color="gray.400" fontWeight="500">
                        Starting from
                      </Text>
                      <Text fontSize="lg" fontWeight="700" color="#98FB98" fontFamily="Outfit">
                        $100
                      </Text>
                    </VStack>
                    <Badge colorScheme="green" variant="solid" px={3} py={1} bg="#98FB98" color="black">
                      {item.chain.name || "Multi-chain"}
                    </Badge>
                  </HStack>
                  
                  <HStack spacing={3} w="full" pt={2}>
                    <Button
                      as={Link}
                      href={`/collection/${item.chain.id.toString()}/${item.address}`}
                      size="sm"
                      variant="outline"
                      colorScheme="purple"
                      flex={1}
                      fontFamily="Outfit"
                      fontWeight="600"
                      borderColor="purple.400"
                      color="purple.300"
                      _hover={{
                        bg: "purple.600",
                        color: "white"
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      as={Link}
                      href={`/collection/${item.chain.id.toString()}/${item.address}?action=buy`}
                      size="sm"
                      bg="linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%)"
                      color="white"
                      flex={1}
                      fontFamily="Outfit"
                      fontWeight="600"
                      rightIcon={<FaArrowRight />}
                      _hover={{
                        bg: "linear-gradient(135deg, #805AD5 0%, #6B46C1 100%)",
                        transform: "translateY(-1px)"
                      }}
                    >
                      Buy Now
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
        
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Flex justify="center" mt={16}>
            <Button 
              as={Link} 
              href="/collection" 
              size="xl"
              bg="linear-gradient(135deg, #9F7AEA 0%, #98FB98 100%)"
              color="black"
              px={12}
              py={8}
              fontSize="lg"
              fontFamily="Outfit"
              fontWeight="700"
              rightIcon={<FaArrowRight />}
              _hover={{
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: "0 0 30px rgba(159, 122, 234, 0.6)",
                bg: "linear-gradient(135deg, #805AD5 0%, #7CFC00 100%)"
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              border="2px solid"
              borderColor="rgba(152, 251, 152, 0.5)"
            >
              Explore All Assets
            </Button>
          </Flex>
        </MotionBox>
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