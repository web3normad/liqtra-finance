import { ethers } from 'ethers';
import Logger from '../utils/logger';

const logger = new Logger('BLOCKCHAIN');

const VAULT_ABI = [
  'function balances(address) view returns (uint256)',
  'function getUserBalance(address) view returns (uint256)',
  'function userRiskLevel(address) view returns (uint8)',
  'function deposit(uint256 amount)',
  'function withdraw(uint256 amount)',
  'function usdc() view returns (address)',
];

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

export class BlockchainService {
  private provider: ethers.Provider;
  private vaultContract: ethers.Contract;
  private usdcAddress: string = '';
  private vaultAddress: string;

  constructor(rpcUrl: string, vaultAddress: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.vaultAddress = vaultAddress;
    this.vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, this.provider);
  }

  async initialize() {
    try {
      logger.info('Initializing blockchain service...');
      
      // Get USDC address from vault contract
      this.usdcAddress = await this.vaultContract.usdc();
      
      if (!this.usdcAddress || this.usdcAddress === ethers.ZeroAddress) {
        throw new Error('Invalid USDC address returned from vault');
      }

      logger.info('Blockchain service initialized successfully', {
        vault: this.vaultAddress,
        usdc: this.usdcAddress,
      });

    } catch (error: any) {
      logger.error('Failed to initialize blockchain service', {
        error: error.message,
        vault: this.vaultAddress,
      });
      throw new Error(`Blockchain initialization failed: ${error.message}`);
    }
  }

  // Read functions
  async getVaultBalance(userAddress: string): Promise<bigint> {
    try {
      return await this.vaultContract.balances(userAddress);
    } catch (error: any) {
      logger.error('Error reading vault balance', { user: userAddress, error: error.message });
      return 0n;
    }
  }

  async getUserRiskLevel(userAddress: string): Promise<number> {
    try {
      const level = await this.vaultContract.userRiskLevel(userAddress);
      return Number(level);
    } catch (error: any) {
      logger.error('Error reading risk level', { user: userAddress, error: error.message });
      return 1; // Default to balanced
    }
  }

  async getUSDCBalance(userAddress: string): Promise<bigint> {
    try {
      if (!this.usdcAddress) {
        throw new Error('USDC address not initialized');
      }

      const usdcContract = new ethers.Contract(
        this.usdcAddress,
        ERC20_ABI,
        this.provider
      );
      return await usdcContract.balanceOf(userAddress);
    } catch (error: any) {
      logger.error('Error reading USDC balance', { user: userAddress, error: error.message });
      return 0n;
    }
  }

  async getUSDCAllowance(userAddress: string): Promise<bigint> {
    try {
      if (!this.usdcAddress) {
        throw new Error('USDC address not initialized');
      }

      const usdcContract = new ethers.Contract(
        this.usdcAddress,
        ERC20_ABI,
        this.provider
      );
      return await usdcContract.allowance(userAddress, this.vaultAddress);
    } catch (error: any) {
      logger.error('Error reading USDC allowance', { user: userAddress, error: error.message });
      return 0n;
    }
  }

  // Write functions (return unsigned transactions)
  async buildDepositTransaction(userAddress: string, amount: bigint): Promise<any> {
    const tx = await this.vaultContract.deposit.populateTransaction(amount);
    
    return {
      to: this.vaultAddress,
      data: tx.data,
      value: '0',
      from: userAddress,
    };
  }

  async buildWithdrawTransaction(userAddress: string, amount: bigint): Promise<any> {
    const tx = await this.vaultContract.withdraw.populateTransaction(amount);
    
    return {
      to: this.vaultAddress,
      data: tx.data,
      value: '0',
      from: userAddress,
    };
  }

  async buildApproveTransaction(userAddress: string, amount: bigint): Promise<any> {
    if (!this.usdcAddress) {
      throw new Error('USDC address not initialized. Please restart the API server.');
    }

    const usdcContract = new ethers.Contract(
      this.usdcAddress,
      ERC20_ABI,
      this.provider
    );
    
    const tx = await usdcContract.approve.populateTransaction(this.vaultAddress, amount);
    
    return {
      to: this.usdcAddress,
      data: tx.data,
      value: '0',
      from: userAddress,
    };
  }

  // Utilities
  formatUSDC(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
  }

  parseUSDC(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
  }

  getVaultAddress(): string {
    return this.vaultAddress;
  }

  getUSDCAddress(): string {
    return this.usdcAddress;
  }

  isInitialized(): boolean {
    return this.usdcAddress !== '';
  }
}
