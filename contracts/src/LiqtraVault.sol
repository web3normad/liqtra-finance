// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LiqtraVault
 * @notice A secure vault contract for managing user USDC deposits and yield optimization
 * @dev Implements basic deposit/withdraw functionality with user balance tracking and risk levels
 */
contract LiqtraVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // State variables
    IERC20 public immutable USDC;
    
    // User balances mapping
    mapping(address => uint256) public balances;
    
    // User risk levels (0 = conservative, 1 = balanced, 2 = aggressive)
    mapping(address => uint8) public userRiskLevel;
    
    // Total value locked in the vault
    uint256 public totalDeposited;
    
    // Minimum deposit amount (1 USDC with 6 decimals)
    uint256 public constant MIN_DEPOSIT = 1e6;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event RiskLevelUpdated(address indexed user, uint8 oldLevel, uint8 newLevel);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    
    // Errors
    error InvalidAmount();
    error InsufficientBalance();
    error InvalidRiskLevel();
    error TransferFailed();
    error ZeroAddress();
    
    /**
     * @notice Constructor to initialize the vault with USDC token address
     * @param _usdc Address of the USDC token contract
     */
    constructor(address _usdc) Ownable(msg.sender) {
        if (_usdc == address(0)) revert ZeroAddress();
        USDC = IERC20(_usdc);
    }
    
    /**
     * @notice Deposit USDC into the vault
     * @param amount Amount of USDC to deposit (with 6 decimals)
     */
    function deposit(uint256 amount) external nonReentrant {
        if (amount < MIN_DEPOSIT) revert InvalidAmount();
        
        // Transfer USDC from user to vault
        USDC.safeTransferFrom(msg.sender, address(this), amount);
        
        // Update user balance
        balances[msg.sender] += amount;
        totalDeposited += amount;
        
        // Set default risk level if first deposit
        if (userRiskLevel[msg.sender] == 0 && balances[msg.sender] == amount) {
            userRiskLevel[msg.sender] = 1; // Default to balanced
        }
        
        emit Deposit(msg.sender, amount);
    }
    
    /**
     * @notice Withdraw USDC from the vault
     * @param amount Amount of USDC to withdraw (with 6 decimals)
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (balances[msg.sender] < amount) revert InsufficientBalance();
        
        // Update user balance
        balances[msg.sender] -= amount;
        totalDeposited -= amount;
        
        // Transfer USDC to user
        USDC.safeTransfer(msg.sender, amount);
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Withdraw all balance from the vault
     */
    function withdrawAll() external nonReentrant {
        uint256 amount = balances[msg.sender];
        if (amount == 0) revert InsufficientBalance();
        
        // Update user balance
        balances[msg.sender] = 0;
        totalDeposited -= amount;
        
        // Transfer USDC to user
        USDC.safeTransfer(msg.sender, amount);
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @notice Get user's vault balance
     * @param user Address of the user
     * @return User's balance in USDC (with 6 decimals)
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @notice Set user's risk level
     * @param riskLevel Risk level (0 = conservative, 1 = balanced, 2 = aggressive)
     */
    function setRiskLevel(uint8 riskLevel) external {
        if (riskLevel > 2) revert InvalidRiskLevel();
        
        uint8 oldLevel = userRiskLevel[msg.sender];
        userRiskLevel[msg.sender] = riskLevel;
        
        emit RiskLevelUpdated(msg.sender, oldLevel, riskLevel);
    }
    
    /**
     * @notice Admin function to update user balance (for yield distribution)
     * @param user Address of the user
     * @param newBalance New balance after yield
     */
    function updateUserBalance(address user, uint256 newBalance) external onlyOwner {
        uint256 oldBalance = balances[user];
        balances[user] = newBalance;
        
        // Update total deposited
        if (newBalance > oldBalance) {
            totalDeposited += (newBalance - oldBalance);
        } else {
            totalDeposited -= (oldBalance - newBalance);
        }
    }
    
    /**
     * @notice Admin function to transfer funds for yield optimization
     * @param to Destination address (DeFi protocol)
     * @param amount Amount to transfer
     */
    function transferForYield(address to, uint256 amount) external onlyOwner nonReentrant {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount();
        
        uint256 vaultBalance = USDC.balanceOf(address(this));
        if (vaultBalance < amount) revert InsufficientBalance();
        
        USDC.safeTransfer(to, amount);
    }
    
    /**
     * @notice Emergency withdraw function for users in case of emergency
     * @dev Can be used even if contract is paused
     */
    function emergencyWithdraw() external nonReentrant {
        uint256 amount = balances[msg.sender];
        if (amount == 0) revert InsufficientBalance();
        
        // Update state
        balances[msg.sender] = 0;
        totalDeposited -= amount;
        
        // Transfer funds
        USDC.safeTransfer(msg.sender, amount);
        
        emit EmergencyWithdraw(msg.sender, amount);
    }
    
    /**
     * @notice Get vault's total USDC balance
     * @return Total USDC held by the vault
     */
    function getVaultBalance() external view returns (uint256) {
        return USDC.balanceOf(address(this));
    }
    
    /**
     * @notice Get USDC contract address (for frontend/backend integration)
     * @return Address of the USDC token contract
     */
    function usdc() external view returns (address) {
        return address(USDC);
    }
    
    /**
     * @notice Get number of users with deposits
     * @dev This is a simple implementation, for production use a more gas-efficient approach
     */
    function getTotalDeposited() external view returns (uint256) {
        return totalDeposited;
    }
}
