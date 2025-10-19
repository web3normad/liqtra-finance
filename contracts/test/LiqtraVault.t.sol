// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {LiqtraVault} from "../src/LiqtraVault.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract LiqtraVaultTest is Test {
    LiqtraVault public vault;
    MockUSDC public usdc;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    uint256 constant DEPOSIT_AMOUNT = 1000 * 1e6; // 1000 USDC
    
    function setUp() public {
        // Deploy contracts
        usdc = new MockUSDC();
        vault = new LiqtraVault(address(usdc));
        
        // Mint USDC to test users
        usdc.mint(user1, 10000 * 1e6);
        usdc.mint(user2, 10000 * 1e6);
        
        console.log("Setup complete");
        console.log("Vault address:", address(vault));
        console.log("USDC address:", address(usdc));
    }
    
    function testDeposit() public {
        vm.startPrank(user1);
        
        // Approve vault
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        
        // Deposit
        vault.deposit(DEPOSIT_AMOUNT);
        
        // Check balance
        assertEq(vault.balances(user1), DEPOSIT_AMOUNT);
        assertEq(vault.getUserBalance(user1), DEPOSIT_AMOUNT);
        assertEq(vault.totalDeposited(), DEPOSIT_AMOUNT);
        
        vm.stopPrank();
    }
    
    function testWithdraw() public {
        // First deposit
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        
        // Then withdraw half
        uint256 withdrawAmount = DEPOSIT_AMOUNT / 2;
        vault.withdraw(withdrawAmount);
        
        // Check balances
        assertEq(vault.balances(user1), DEPOSIT_AMOUNT - withdrawAmount);
        assertEq(usdc.balanceOf(user1), 10000 * 1e6 - DEPOSIT_AMOUNT + withdrawAmount);
        
        vm.stopPrank();
    }
    
    function testWithdrawAll() public {
        // Deposit
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        
        // Withdraw all
        vault.withdrawAll();
        
        // Check balances
        assertEq(vault.balances(user1), 0);
        assertEq(usdc.balanceOf(user1), 10000 * 1e6);
        
        vm.stopPrank();
    }
    
    function testRiskLevel() public {
        vm.startPrank(user1);
        
        // Default risk level after deposit
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        assertEq(vault.userRiskLevel(user1), 1); // Balanced
        
        // Change risk level
        vault.setRiskLevel(2); // Aggressive
        assertEq(vault.userRiskLevel(user1), 2);
        
        vm.stopPrank();
    }
    
    function testMultipleUsers() public {
        // User1 deposits
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        vm.stopPrank();
        
        // User2 deposits
        vm.startPrank(user2);
        usdc.approve(address(vault), DEPOSIT_AMOUNT * 2);
        vault.deposit(DEPOSIT_AMOUNT * 2);
        vm.stopPrank();
        
        // Check balances
        assertEq(vault.balances(user1), DEPOSIT_AMOUNT);
        assertEq(vault.balances(user2), DEPOSIT_AMOUNT * 2);
        assertEq(vault.totalDeposited(), DEPOSIT_AMOUNT * 3);
    }
    
    function test_RevertWhen_DepositBelowMinimum() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), 0.5e6); // 0.5 USDC
        
        vm.expectRevert(LiqtraVault.InvalidAmount.selector);
        vault.deposit(0.5e6); // Should fail
        vm.stopPrank();
    }
    
    function test_RevertWhen_WithdrawMoreThanBalance() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        
        vm.expectRevert(LiqtraVault.InsufficientBalance.selector);
        vault.withdraw(DEPOSIT_AMOUNT + 1); // Should fail
        vm.stopPrank();
    }
    
    function testEmergencyWithdraw() public {
        vm.startPrank(user1);
        usdc.approve(address(vault), DEPOSIT_AMOUNT);
        vault.deposit(DEPOSIT_AMOUNT);
        
        vault.emergencyWithdraw();
        
        assertEq(vault.balances(user1), 0);
        assertEq(usdc.balanceOf(user1), 10000 * 1e6);
        vm.stopPrank();
    }
}
