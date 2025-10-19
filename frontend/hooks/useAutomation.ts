/**
 * useAutomation Hook
 * 
 * Handles the complete automation flow:
 * 1. Approve USDC
 * 2. Deposit to Vault
 * 3. Store allocation metadata (which protocols to "allocate" to)
 * 4. Track positions for UI display
 */

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import toast from 'react-hot-toast';
import { getVaultAddress, getUSDCAddress } from '@/lib/web3/contracts/addresses';
import { VAULT_ABI, ERC20_ABI } from '@/lib/web3/contracts/abis';

export interface AllocationData {
  protocol: string;
  amount: string;
  apy: number;
  percentage: number;
  timestamp: number;
}

export interface AutomationResult {
  success: boolean;
  vaultDeposit: string;
  allocations: AllocationData[];
  txHash?: string;
}

export function useAutomation() {
  const { address } = useAccount();
  const chainId = useChainId();
  const vaultAddress = getVaultAddress(chainId);
  const usdcAddress = getUSDCAddress(chainId);
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'approving' | 'depositing' | 'complete'>('idle');
  
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  // Check USDC allowance
  const { data: allowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && vaultAddress ? [address, vaultAddress] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
    },
  });

  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  /**
   * Execute complete automation flow
   */
  const executeAutomation = useCallback(async (
    riskLevel: 'low' | 'medium' | 'high',
    customAmount?: string
  ): Promise<AutomationResult> => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }

    if (!usdcBalance || usdcBalance === BigInt(0)) {
      throw new Error('No USDC balance available');
    }

    setIsExecuting(true);
    setCurrentStep('idle');

    try {
      // Use custom amount if provided, otherwise use full balance
      const balanceFormatted = formatUnits(usdcBalance as bigint, 6);
      const amountToUse = customAmount || balanceFormatted;
      const minDeposit = 1; // Minimum 1 USDC

      if (parseFloat(amountToUse) < minDeposit) {
        throw new Error(`Minimum deposit is ${minDeposit} USDC`);
      }

      if (parseFloat(amountToUse) > parseFloat(balanceFormatted)) {
        throw new Error(`Insufficient balance. Available: ${balanceFormatted} USDC`);
      }

      // Convert amount to wei
      const amountWei = parseUnits(amountToUse, 6);

      // Step 1: Get AI allocation strategy from API
      toast.loading('🤖 AI analyzing protocols...', { id: 'automation' });
      
      const strategyResponse = await fetch('/api/agent/automate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userAddress: address, 
          riskLevel,
          amount: amountToUse // Pass the actual amount
        }),
      });

      if (!strategyResponse.ok) {
        throw new Error('Failed to get allocation strategy');
      }

      const strategy = await strategyResponse.json();
      const allocations: AllocationData[] = strategy.allocations.map((a: any) => ({
        ...a,
        timestamp: Date.now(),
      }));

      // Step 2: Check if approval is needed
      const needsApproval = !allowance || allowance < amountWei;

      if (needsApproval) {
        setCurrentStep('approving');
        toast.loading('💳 Approve USDC in your wallet...', { id: 'automation' });

        await new Promise<void>((resolve, reject) => {
          writeContract(
            {
              address: usdcAddress,
              abi: ERC20_ABI,
              functionName: 'approve',
              args: [vaultAddress, amountWei],
            },
            {
              onSuccess: () => {
                toast.loading('⏳ Waiting for approval confirmation...', { id: 'automation' });
                // Wait for confirmation
                setTimeout(() => resolve(), 3000);
              },
              onError: (error) => reject(error),
            }
          );
        });

        toast.success('✅ USDC approved!', { id: 'automation', duration: 1000 });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Step 3: Deposit to vault
      setCurrentStep('depositing');
      toast.loading('🏦 Depositing to vault...', { id: 'automation' });

      const depositTxHash = await new Promise<string>((resolve, reject) => {
        writeContract(
          {
            address: vaultAddress,
            abi: VAULT_ABI,
            functionName: 'deposit',
            args: [amountWei],
          },
          {
            onSuccess: (hash) => {
              toast.loading('⏳ Confirming deposit...', { id: 'automation' });
              setTimeout(() => resolve(hash), 3000);
            },
            onError: (error) => reject(error),
          }
        );
      });

      toast.success('✅ Deposited to vault!', { id: 'automation', duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Store allocations in localStorage
      const positionsKey = `positions_${address}_${chainId}`;
      const existingPositions = JSON.parse(localStorage.getItem(positionsKey) || '[]');
      
      const newPositions = allocations.map((alloc) => ({
        id: `${alloc.protocol}-${Date.now()}`,
        protocol: alloc.protocol,
        amount: alloc.amount,
        apy: alloc.apy,
        percentage: alloc.percentage,
        startTime: Date.now(),
        earnings: '0',
        status: 'active' as const,
        txHash: depositTxHash,
      }));

      localStorage.setItem(positionsKey, JSON.stringify([...existingPositions, ...newPositions]));

      // Step 5: Complete
      setCurrentStep('complete');
      toast.success(`🎉 Automated! Funds allocated to ${allocations.length} protocols`, {
        id: 'automation',
        duration: 3000,
      });

      return {
        success: true,
        vaultDeposit: amountToUse,
        allocations,
        txHash: depositTxHash,
      };

    } catch (error: any) {
      console.error('Automation error:', error);
      toast.error(error.message || 'Automation failed', { id: 'automation' });
      throw error;
    } finally {
      setIsExecuting(false);
      setCurrentStep('idle');
    }
  }, [address, chainId, usdcBalance, allowance, vaultAddress, usdcAddress, writeContract]);

  /**
   * Get user positions from localStorage
   */
  const getPositions = useCallback(() => {
    if (!address) return [];
    
    const positionsKey = `positions_${address}_${chainId}`;
    return JSON.parse(localStorage.getItem(positionsKey) || '[]');
  }, [address, chainId]);

  /**
   * Calculate total portfolio value and earnings
   */
  const getPortfolioStats = useCallback(() => {
    const positions = getPositions();
    
    let totalValue = 0;
    let totalEarnings = 0;
    let totalApy = 0;

    positions.forEach((pos: any) => {
      const amount = parseFloat(pos.amount);
      const apy = pos.apy;
      
      // Calculate time-based earnings (simplified - in production, query actual yields)
      const timeElapsed = Date.now() - pos.startTime;
      const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);
      const yearlyEarnings = amount * (apy / 100);
      const currentEarnings = (yearlyEarnings / 365) * daysElapsed;
      
      totalValue += amount + currentEarnings;
      totalEarnings += currentEarnings;
      totalApy += apy;
    });

    const avgApy = positions.length > 0 ? totalApy / positions.length : 0;

    return {
      totalValue,
      totalEarnings,
      activePositions: positions.length,
      avgApy,
      positions,
    };
  }, [getPositions]);

  /**
   * Clear all positions from localStorage (called after full withdrawal)
   */
  const clearPositions = useCallback(() => {
    if (!address) return;
    
    const positionsKey = `positions_${address}_${chainId}`;
    localStorage.removeItem(positionsKey);
    console.log('🗑️ Cleared all positions from localStorage');
  }, [address, chainId]);

  return {
    executeAutomation,
    getPositions,
    getPortfolioStats,
    clearPositions,
    isExecuting,
    currentStep,
    isPending: isPending || isConfirming,
  };
}
