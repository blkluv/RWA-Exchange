// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyNFT.sol";
import "./Fraction.sol";

interface IERC4907 {
    function setUser(uint256 tokenId, address user, uint64 expires) external;
    function userOf(uint256 tokenId) external view returns (address);
    function userExpires(uint256 tokenId) external view returns (uint256);
}

contract Fractionalizer {
    address public propertyNFTAddress;

    struct FractionalizedNFT {
        address fractionToken;
        uint256 totalFractions;
        address originalOwner;
    }

    mapping(uint256 => FractionalizedNFT) public fractionalizedNFTs;

    event NFTFractionalized(
        uint256 indexed tokenId,
        address indexed fractionToken,
        uint256 totalFractions,
        address indexed originalOwner
    );
    event NFTRedeemed(uint256 indexed tokenId, address indexed redeemer);
    event NFTUserSet(uint256 indexed tokenId, address indexed user, uint64 expires);

    constructor(address _propertyNFTAddress) {
        propertyNFTAddress = _propertyNFTAddress;
    }

    /**
     * @notice Fractionalize a PropertyNFT into ERC20 fractions
     * @param tokenId The NFT to fractionalize
     * @param totalFractions Number of ERC20 fractions
     * @param name Name of the fraction token
     * @param symbol Symbol of the fraction token
     */
    function fractionalize(
        uint256 tokenId,
        uint256 totalFractions,
        string memory name,
        string memory symbol
    ) public {
        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");

        // Transfer NFT to Fractionalizer contract
        propertyNFT.transferFrom(msg.sender, address(this), tokenId);

        // Deploy new fraction ERC20 token
        Fraction fractionToken = new Fraction(name, symbol, address(this));

        // Save fractionalized NFT info
        fractionalizedNFTs[tokenId] = FractionalizedNFT({
            fractionToken: address(fractionToken),
            totalFractions: totalFractions,
            originalOwner: msg.sender
        });

        // Mint fractions to original owner
        fractionToken.mint(msg.sender, totalFractions);

        emit NFTFractionalized(tokenId, address(fractionToken), totalFractions, msg.sender);
    }

    /**
     * @notice Redeem an NFT by holding all fractions
     * @param tokenId The NFT to redeem
     */
    function redeem(uint256 tokenId) public {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(msg.sender) == fnft.totalFractions, "You do not own all the fractions");

        // Transfer all fractions from redeemer to this contract
        fractionToken.transferFrom(msg.sender, address(this), fnft.totalFractions);
        fractionToken.burn(fnft.totalFractions);

        // Transfer NFT back to redeemer
        PropertyNFT(propertyNFT = PropertyNFT(propertyNFTAddress);
        propertyNFT.transferFrom(address(this), msg.sender, tokenId);

        // Remove record
        delete fractionalizedNFTs[tokenId];

        emit NFTRedeemed(tokenId, msg.sender);
    }

    /**
     * @notice Set ERC4907 user/renter for the NFT
     * @param tokenId The NFT ID
     * @param user The address of the renter/user
     * @param expires Expiration timestamp for the rental
     */
    function setUser(uint256 tokenId, address user, uint64 expires) public {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(msg.sender) > 0, "Must hold fractions to set user");

        IERC4907(propertyNFTAddress).setUser(tokenId, user, expires);

        emit NFTUserSet(tokenId, user, expires);
    }

    /**
     * @notice View current ERC4907 user of the NFT
     */
    function userOf(uint256 tokenId) public view returns (address) {
        return IERC4907(propertyNFTAddress).userOf(tokenId);
    }

    /**
     * @notice View expiration timestamp of ERC4907 user
     */
    function userExpires(uint256 tokenId) public view returns (uint256) {
        return IERC4907(propertyNFTAddress).userExpires(tokenId);
    }
}
