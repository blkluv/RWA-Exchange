// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PropertyNFT.sol";
import "./Fraction.sol";

contract Fractionalizer {
    address public propertyNFTAddress;

    struct FractionalizedNFT {
        address fractionToken;
        uint256 totalFractions;
        address originalOwner;
    }

    mapping(uint256 => FractionalizedNFT) public fractionalizedNFTs;

    event NFTFractionalized(uint256 indexed tokenId, address indexed fractionToken, uint256 totalFractions, address indexed originalOwner);
    event NFTRedeemed(uint256 indexed tokenId, address indexed redeemer);

    constructor(address _propertyNFTAddress) {
        propertyNFTAddress = _propertyNFTAddress;
    }

    function fractionalize(uint256 tokenId, uint256 totalFractions, string memory name, string memory symbol) public {
        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");

        propertyNFT.transferFrom(msg.sender, address(this), tokenId);

        Fraction fractionToken = new Fraction(name, symbol, address(this));

        fractionalizedNFTs[tokenId] = FractionalizedNFT({
            fractionToken: address(fractionToken),
            totalFractions: totalFractions,
            originalOwner: msg.sender
        });

        fractionToken.mint(msg.sender, totalFractions);

        emit NFTFractionalized(tokenId, address(fractionToken), totalFractions, msg.sender);
    }

    function redeem(uint256 tokenId) public {
        FractionalizedNFT storage fnft = fractionalizedNFTs[tokenId];
        require(fnft.fractionToken != address(0), "NFT not fractionalized");

        Fraction fractionToken = Fraction(fnft.fractionToken);
        require(fractionToken.balanceOf(msg.sender) == fnft.totalFractions, "You do not own all the fractions");

        // The Fractionalizer contract calls the burn function on the Fraction contract.
        // Since the Fractionalizer is the minter, it has the authority to burn the tokens.
        // The user must hold all tokens, which are then burned before they can redeem the NFT.
        address fractionTokenAddress = fnft.fractionToken;
        Fraction(fractionTokenAddress).transferFrom(msg.sender, address(this), fnft.totalFractions);
        Fraction(fractionTokenAddress).burn(fnft.totalFractions);

        PropertyNFT propertyNFT = PropertyNFT(propertyNFTAddress);
        propertyNFT.transferFrom(address(this), msg.sender, tokenId);

        delete fractionalizedNFTs[tokenId];

        emit NFTRedeemed(tokenId, msg.sender);
    }
}
