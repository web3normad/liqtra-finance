// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {LiqtraVault} from "../src/LiqtraVault.sol";

contract DeployLiqtraVault is Script {
    // Base Sepolia USDC address (you'll need to use a test USDC or deploy one)
    // If no USDC on Base Sepolia, we'll deploy a mock one
    address public constant BASE_SEPOLIA_USDC = address(0); // Replace with actual USDC address
    
    function run() external returns (LiqtraVault) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get USDC address (use env var or constant)
        address usdcAddress = vm.envOr("USDC_ADDRESS", BASE_SEPOLIA_USDC);
        
        require(usdcAddress != address(0), "USDC address not set. Set USDC_ADDRESS env var");
        
        console.log("Deploying LiqtraVault...");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("USDC Address:", usdcAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        LiqtraVault vault = new LiqtraVault(usdcAddress);
        
        vm.stopBroadcast();
        
        console.log("LiqtraVault deployed at:", address(vault));
        console.log("");
        console.log("Next steps:");
        console.log("1. Verify the contract on BaseScan");
        console.log("2. Update frontend .env:");
        console.log("   NEXT_PUBLIC_VAULT_CONTRACT=%s", address(vault));
        console.log("   NEXT_PUBLIC_USDC_CONTRACT=%s", usdcAddress);
        console.log("3. Update backend .env with vault address");
        
        return vault;
    }
}
