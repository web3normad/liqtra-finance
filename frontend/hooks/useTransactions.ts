import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import toast from 'react-hot-toast';
import { getVaultAddress, getUSDCAddress } from '@/lib/web3/contracts/addresses';
import { VAULT_ABI, ERC20_ABI } from '@/lib/web3/contracts/abis';

export function useTransactions() {
  const { address } = useAccount();
  const chainId = useChainId();
  const vaultAddress = getVaultAddress(chainId);
  const usdcAddress = getUSDCAddress(chainId);
  
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [lastAction, setLastAction] = useState<string>('');

  /**
   * Approve USDC spending
   */
  const approveUSDC = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setLastAction('approve');
      const amountWei = parseUnits(amount, 6); // USDC has 6 decimals

      writeContract({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [vaultAddress, amountWei],
      });

      toast.loading('Approving USDC...', { id: 'approve' });
    } catch (err: any) {
      console.error('Approval error:', err);
      toast.error(err.message || 'Failed to approve USDC');
    }
  };

  /**
   * Deposit USDC to vault
   */
  const deposit = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setLastAction('deposit');
      const amountWei = parseUnits(amount, 6);

      writeContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'deposit',
        args: [amountWei],
      });

      toast.loading('Depositing...', { id: 'deposit' });
    } catch (err: any) {
      console.error('Deposit error:', err);
      toast.error(err.message || 'Failed to deposit');
    }
  };

  /**
   * Withdraw USDC from vault
   */
  const withdraw = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      setLastAction('withdraw');
      const amountWei = parseUnits(amount, 6);

      writeContract({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'withdraw',
        args: [amountWei],
      });

      toast.loading('Withdrawing...', { id: 'withdraw' });
    } catch (err: any) {
      console.error('Withdraw error:', err);
      toast.error(err.message || 'Failed to withdraw');
    }
  };

  // Handle transaction confirmation
  if (isSuccess && lastAction) {
    const actionMessages: Record<string, string> = {
      approve: 'USDC approved successfully!',
      deposit: 'Deposit successful!',
      withdraw: 'Withdrawal successful!',
    };

    toast.success(actionMessages[lastAction] || 'Transaction successful!', {
      id: lastAction,
    });
    setLastAction('');
  }

  // Handle transaction errors
  if (error) {
    toast.error(error.message || 'Transaction failed', {
      id: lastAction,
    });
    setLastAction('');
  }

  return {
    approveUSDC,
    deposit,
    withdraw,
    isPending: isPending || isConfirming,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}
