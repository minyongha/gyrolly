// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinter is ERC721, Ownable {
    mapping(address => uint) public levelInfo;
    string public uri="QmSzCDUw5GoRnjccpxhN6bDsfnT6iTPRTh25yymqyUTQYT";
    uint maxLevel=7;

    constructor() ERC721("GyRolly", "GyRy") Ownable() {}

    function mintNFT() external {
        require(levelInfo[msg.sender]<maxLevel, "Can not over maxLevel");

        uint256 tokenId = levelInfo[msg.sender];
        _mint(msg.sender, tokenId);
        levelInfo[msg.sender]++;
    }
}