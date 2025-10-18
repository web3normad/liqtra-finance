import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';

export const validateAddress = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const address = req.params.address || req.body.address;

  if (!address) {
    return res.status(400).json({
      success: false,
      error: 'Address is required',
    });
  }

  // Check if valid address (case-insensitive)
  if (!ethers.isAddress(address)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Ethereum address',
    });
  }

  // Normalize address to checksum format
  req.params.address = ethers.getAddress(address);
  if (req.body.address) {
    req.body.address = ethers.getAddress(address);
  }

  next();
};

export const validateRiskLevel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { risk_level } = req.body;

  if (!risk_level) {
    return res.status(400).json({
      success: false,
      error: 'risk_level is required',
    });
  }

  const validLevels = ['conservative', 'balanced', 'aggressive'];
  if (!validLevels.includes(risk_level)) {
    return res.status(400).json({
      success: false,
      error: `risk_level must be one of: ${validLevels.join(', ')}`,
    });
  }

  next();
};
