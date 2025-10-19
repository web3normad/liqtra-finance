// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Mock USDC token for testing on Base Sepolia testnet
 * @dev 6 decimals like real USDC
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;
    
    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer (1 million USDC)
        _mint(msg.sender, 1_000_000 * 10**DECIMALS);
    }
    
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @notice Mint new tokens (for testing)
     * @param to Address to mint to
     * @param amount Amount to mint (with 6 decimals)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @notice Faucet function - anyone can get 1000 USDC for testing
     */
    function faucet() external {
        _mint(msg.sender, 1000 * 10**DECIMALS);
    }
    
    /**
     * @notice Burn tokens
     * @param amount Amount to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
