import { ethers } from 'ethers';
import { CONFIG } from '../config/constants';
import Logger from '../utils/logger';

const logger = new Logger('BLOCKCHAIN');

// Minimal ABI for FloquidityVault
const VAULT_ABI = [
  'function balances(address) view returns (uint256)',
  'function getUserBalance(address) view returns (uint256)',
  'function userRiskLevel(address) view returns (uint8)',
  'function agentInvest(address user, address protocol, uint256 amount, bytes calldata data)',
  'function agentWithdrawFromProtocol(address user, address protocol, uint256 amount, bytes calldata data)',
];

// Minimal ERC20 ABI
const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
];

export class BlockchainService {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private vaultContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
    this.wallet = new ethers.Wallet(CONFIG.AGENT_PRIVATE_KEY, this.provider);
    
    this.vaultContract = new ethers.Contract(
      CONFIG.VAULT_ADDRESS,
      VAULT_ABI,
      this.wallet
    );

    logger.info('Blockchain service initialized', {
      network: 'Base',
      agent: this.wallet.address,
      vault: CONFIG.VAULT_ADDRESS,
    });
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

  // Write functions
  async investFunds(
    userAddress: string,
    protocolAddress: string,
    amount: bigint
  ): Promise<string> {
    try {
      logger.info('Investing funds', {
        user: userAddress,
        protocol: protocolAddress,
        amount: ethers.formatUnits(amount, 6),
      });

      // For now, empty calldata (you'll customize per protocol)
      const tx = await this.vaultContract.agentInvest(
        userAddress,
        protocolAddress,
        amount,
        '0x'
      );

      const receipt = await tx.wait();
      logger.info('Investment successful', { txHash: receipt.hash });
      
      return receipt.hash;
    } catch (error) {
      logger.error('Investment failed', error);
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
        amount: ethers.formatUnits(amount, 6),
      });

      const tx = await this.vaultContract.agentWithdrawFromProtocol(
        userAddress,
        protocolAddress,
        amount,
        '0x'
      );

      const receipt = await tx.wait();
      logger.info('Withdrawal successful', { txHash: receipt.hash });
      
      return receipt.hash;
    } catch (error) {
      logger.error('Withdrawal failed', error);
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
}
