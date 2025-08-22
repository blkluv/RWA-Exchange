import type { Chain } from "thirdweb";
import { avalancheFuji, polygonAmoy, base } from "./chains"; // Added base

export type NftContract = {
  address: string;
  chain: Chain;
  type: "ERC1155" | "ERC721";

  title?: string;
  description?: string;
  thumbnailUrl?: string;
  slug?: string;
};

/**
 * Below is a list of all NFT contracts supported by your marketplace(s)
 * This is of course hard-coded for demo purpose
 *
 * In reality, the list should be dynamically fetched from your own data source
 */
export const NFT_CONTRACTS: NftContract[] = [
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///airship.neat.sulky",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/s3iIMfD.jpeg",
    slug: "airship-neat-sulky",
    type: "ERC721",
  },
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///clip.womanly.emerald",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/CCYjFjT.jpeg",
    slug: "clip.womanly.emerald",
    type: "ERC721",
  },
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///yards.shuttle.rudder",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/TJ5ufAW.jpeg",
    slug: "yards-shuttle-rudder",
    type: "ERC721",
  },
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///tangent.welfare.increments",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/SpOeBOa.jpeg",
    slug: "tangent-welfare-increments",
    type: "ERC721",
  },
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///flute.contact.stream",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/hqSS25Y.jpeg",
    slug: "flute-contact-stream",
    type: "ERC721",
  },
  {
    address: "0xFeEdAcc7f5C2ffF2BD1E881E1689866D7ae7B24B",
    chain: base,
    title: "///reply.snapper.bakers",
    description: "Rentable RWA available on RNT.SOCIAL",
    thumbnailUrl:
      "https://i.imgur.com/kG3RfjB.jpeg",
    slug: "reply-snapper-bakers",
    type: "ERC721",
  },
];
