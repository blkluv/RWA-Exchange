import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Flex,
  Text,
} from "@chakra-ui/react";

type Attribute = {
  trait_type?: string;
  traitType?: string;
  value?: unknown;
  [key: string]: unknown;
};

export function NftAttributes({
  attributes,
}: {
  attributes?: Attribute[] | Record<string, unknown>;
}) {
  // Normalize attributes into an array of { trait_type, value }
  let items: Attribute[] = [];

  if (Array.isArray(attributes)) {
    // Filter out attributes without a trait_type or traitType
    items = attributes.filter(
      (item) => Boolean(item.trait_type || item.traitType)
    );
  } else if (attributes && typeof attributes === "object") {
    // Convert object format into array
    items = Object.entries(attributes).map(([key, value]) => ({
      trait_type: key,
      value,
    }));
  }

  return (
    <AccordionItem>
      <Text>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            Traits
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </Text>
      <AccordionPanel pb={4}>
        <Flex direction="row" wrap="wrap" gap="3">
          {items.map((item, index) => (
            <Card
              key={
                (item.trait_type || item.traitType || `attr-${index}`).toString()
              }
              as={Flex}
              flexDir="column"
              gap={2}
              py={2}
              px={4}
              bg="transparent"
              border="1px"
            >
              {(item.trait_type || item.traitType) && (
                <Text size="label.sm" textAlign="center" lineHeight={1.2}>
                  {item.trait_type || item.traitType}
                </Text>
              )}
              {(() => {
                const displayValue =
                  typeof item.value === "object" && item.value !== null
                    ? JSON.stringify(item.value)
                    : String(item.value ?? "");
                return (
                  <Text size="label.md" textAlign="center" fontWeight="bold">
                    {displayValue}
                  </Text>
                );
              })()}
            </Card>
          ))}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
}
