// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {LiqtraVault} from "../src/LiqtraVault.sol";

contract DeployAll is Script {
    // Official Circle USDC on Base Sepolia
    address public constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    
    function run() external returns (LiqtraVault) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("==============================================");
        console.log("Deploying Liqtra Finance Vault");
        console.log("==============================================");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("USDC Address:", BASE_SEPOLIA_USDC);
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Vault with official Circle USDC
        console.log("Deploying LiqtraVault...");
        LiqtraVault vault = new LiqtraVault(BASE_SEPOLIA_USDC);
        console.log("   LiqtraVault deployed at:", address(vault));
        console.log("");
        
        vm.stopBroadcast();
        
        // Display summary
        console.log("==============================================");
        console.log("Deployment Summary");
        console.log("==============================================");
        console.log("USDC (Circle):  ", BASE_SEPOLIA_USDC);
        console.log("LiqtraVault:    ", address(vault));
        console.log("Owner:          ", deployer);
        console.log("");
        
        console.log("==============================================");
        console.log("Next Steps");
        console.log("==============================================");
        console.log("");
        console.log("1. VERIFY CONTRACT:");
        console.log("   forge verify-contract %s LiqtraVault --constructor-args $(cast abi-encode \"constructor(address)\" %s) --chain base-sepolia", address(vault), BASE_SEPOLIA_USDC);
        console.log("");
        
        console.log("2. UPDATE FRONTEND .env:");
        console.log("   NEXT_PUBLIC_VAULT_CONTRACT=%s", address(vault));
        console.log("   NEXT_PUBLIC_USDC_CONTRACT=%s", BASE_SEPOLIA_USDC);
        console.log("");
        
        console.log("3. UPDATE BACKEND .env:");
        console.log("   VAULT_ADDRESS=%s", address(vault));
        console.log("   USDC_ADDRESS=%s", BASE_SEPOLIA_USDC);
        console.log("");
        
        console.log("4. GET TEST USDC:");
        console.log("   - Visit Circle's USDC Faucet: https://faucet.circle.com/");
        console.log("   - Or Alchemy Base Sepolia Faucet");
        console.log("   - USDC is official Circle USDC on Base Sepolia");
        console.log("");
        
        console.log("5. TEST DEPOSIT FLOW:");
        console.log("   - Approve vault: cast send %s \"approve(address,uint256)\" %s 1000000000", BASE_SEPOLIA_USDC, address(vault));
        console.log("   - Deposit: cast send %s \"deposit(uint256)\" 1000000000", address(vault));
        console.log("   - Check balance: cast call %s \"balances(address)(uint256)\" YOUR_ADDRESS", address(vault));
        console.log("");
        
        return vault;
    }
}
