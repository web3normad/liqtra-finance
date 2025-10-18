import { ethers } from 'ethers';
import Logger from '../utils/logger';

const logger = new Logger('BLOCKCHAIN');

const VAULT_ABI = [
  'function balances(address) view returns (uint256)',
  'function getUserBalance(address) view returns (uint256)',
  'function userRiskLevel(address) view returns (uint8)',
];

export class BlockchainService {
  private provider: ethers.Provider;
  private vaultContract: ethers.Contract;

  constructor(rpcUrl: string, vaultAddress: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.vaultContract = new ethers.Contract(vaultAddress, VAULT_ABI, this.provider);
  }

  async getVaultBalance(userAddress: string): Promise<bigint> {
    return await this.vaultContract.balances(userAddress);
  }

  async getUserRiskLevel(userAddress: string): Promise<number> {
    const level = await this.vaultContract.userRiskLevel(userAddress);
    return Number(level);
  }

  formatUSDC(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
  }

  parseUSDC(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
  }
}
