

import { ethers } from 'ethers';
import { CONFIG } from '../config/constants';
import Logger from '../utils/logger';

const logger = new Logger('BLOCKCHAIN');

// Minimal ABI for FloquidityVault
const VAULT_ABI = [
  'function balances(address) view returns (uint256)',
  'function getUserBalance(address) view returns (uint256)',
  'function userRiskLevel(address) view returns (uint8)',
  'function getUserProtocolBalance(address, address) view returns (uint256)',
  'function getUserTotalEarned(address) view returns (uint256)',
  'function agentInvest(address user, address protocol, uint256 amount, bytes calldata data)',
  'function agentWithdrawFromProtocol(address user, address protocol, uint256 amount, bytes calldata data)',
  'function usdc() view returns (address)',
];

// Minimal ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

// Mock Protocol ABI
const MOCK_PROTOCOL_ABI = [
  'function deposit(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function balanceOf(address) view returns (uint256)',
];

export class BlockchainService {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private vaultContract: ethers.Contract;
  private usdcAddress: string = '';

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(CONFIG.AGENT_PRIVATE_KEY, this.provider);
    
    this.vaultContract = new ethers.Contract(
      CONFIG.VAULT_ADDRESS,
      VAULT_ABI,
      this.wallet
    );

    logger.info('Blockchain service initialized', {
      network: CONFIG.CHAIN_NAME,
      agent: this.wallet.address,
      vault: CONFIG.VAULT_ADDRESS,
    });
  }

  async initialize() {
    try {
      // Get USDC address from vault
      this.usdcAddress = await this.vaultContract.usdc();
      logger.info('USDC address loaded:', this.usdcAddress);
    } catch (error) {
      logger.error('Failed to initialize blockchain service', error);
      throw error;
    }
  }

  // Read functions
  async getUserVaultBalance(userAddress: string): Promise<bigint> {
    try {
      const balance = await this.vaultContract.balances(userAddress);
      return balance;
    } catch (error) {
      logger.error('Error reading vault balance', { user: userAddress, error });
      throw error;
    }
  }

  async getUserProtocolBalance(userAddress: string, protocolAddress: string): Promise<bigint> {
  try {
    // Call vault contract to get user's balance in specific protocol
    const balance = await this.vaultContract.getUserProtocolBalance(
      userAddress,
      protocolAddress
    );
    
    return balance;
    
  } catch (error: any) {
    logger.error('Error reading protocol balance', { 
      user: userAddress, 
      protocol: protocolAddress,
      error: error.message 
    });
    return 0n;
  }
}
 async getUserTotalEarned(userAddress: string): Promise<bigint> {
  try {
    const earned = await this.vaultContract.getUserTotalEarned(userAddress);
    return earned;
  } catch (error: any) {
    logger.error('Error reading total earned', { 
      user: userAddress, 
      error: error.message 
    });
    return 0n;
  }
}

  async getUserRiskLevel(userAddress: string): Promise<number> {
    try {
      const riskLevel = await this.vaultContract.userRiskLevel(userAddress);
      return Number(riskLevel);
    } catch (error) {
      logger.error('Error reading risk level', { user: userAddress, error });
      return 1; // Default to balanced
    }
  }

  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice || 0n;
  }

  async getAgentBalance(): Promise<bigint> {
    return await this.provider.getBalance(this.wallet.address);
  }

  // Write functions - Agent invests user funds
  async investFunds(
    userAddress: string,
    protocolAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      logger.info('Investing funds', {
        user: userAddress,
        protocol: protocolAddress,
        amount: this.formatUSDC(amount),
      });

      // Build calldata for mock protocol deposit
      const protocolInterface = new ethers.Interface(MOCK_PROTOCOL_ABI);
      const calldata = protocolInterface.encodeFunctionData('deposit', [amount]);

      // Call agentInvest with proper calldata
      const tx = await this.vaultContract.agentInvest(
        userAddress,
        protocolAddress,
        amount,
        calldata
      );

      const receipt = await tx.wait();
      logger.info('Investment successful', { txHash: receipt.hash });
      
      return receipt.hash;
    } catch (error: any) {
      logger.error('Investment failed', { error: error.message, user: userAddress });
      throw error;
    }
  }

  async withdrawFromProtocol(
    userAddress: string,
    protocolAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      logger.info('Withdrawing from protocol', {
        user: userAddress,
        protocol: protocolAddress,
        amount: this.formatUSDC(amount),
      });

      // Build calldata for mock protocol withdrawal
      const protocolInterface = new ethers.Interface(MOCK_PROTOCOL_ABI);
      const calldata = protocolInterface.encodeFunctionData('withdraw', [amount]);

      const tx = await this.vaultContract.agentWithdrawFromProtocol(
        userAddress,
        protocolAddress,
        amount,
        calldata
      );

      const receipt = await tx.wait();
      logger.info('Withdrawal successful', { txHash: receipt.hash });
      
      return receipt.hash;
    } catch (error: any) {
      logger.error('Withdrawal failed', { error: error.message });
      throw error;
    }
  }

  // Utility
  async estimateGasCost(amount: bigint): Promise<bigint> {
    const gasPrice = await this.getGasPrice();
    const estimatedGas = 200000n; // Rough estimate
    return gasPrice * estimatedGas;
  }

  formatUSDC(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
  }

  parseUSDC(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
  }

  getUSDCAddress(): string {
    return this.usdcAddress;
  }

  
}
