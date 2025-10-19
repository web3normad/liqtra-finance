"use client";

import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { TopYieldCards } from "@/components/dashboard/TopYieldCards";
import { LogoImage } from "@/components/common/LogoImage";
import {
  Lightning,
  TrendUp,
  ShieldCheck,
  ArrowsLeftRight,
  Info,
  CheckCircle,
} from "@phosphor-icons/react";
import { TrendIndicator } from "@/components/charts/TrendIndicator";
import { getProtocolLogo } from "@/lib/utils/logos";

export default function LiquidStakingPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-white">Liquid Staking</h1>
            <Badge variant="purple">Beta</Badge>
          </div>
          <p className="text-gray-400">
            Stake assets while maintaining liquidity
          </p>
        </div>
        <Button variant="primary">
          <Lightning size={18} weight="fill" />
          <span>Start Staking</span>
        </Button>
      </div>

      {/* Info Banner */}
      <Card variant="gradient">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
            <Info size={24} className="text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">
              What is Liquid Staking?
            </h4>
            <p className="text-white/70 text-sm mb-3">
              Liquid staking allows you to stake your assets while receiving a
              liquid token that represents your staked position. You can use
              these tokens in DeFi while still earning staking rewards.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} weight="fill" className="text-white" />
                <span className="text-white/90 text-sm">
                  Earn staking rewards
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} weight="fill" className="text-white" />
                <span className="text-white/90 text-sm">
                  Maintain liquidity
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} weight="fill" className="text-white" />
                <span className="text-white/90 text-sm">Use in DeFi</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Value Locked</span>
            <Lightning size={20} className="text-primary-green" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">$23.5B</p>
          <TrendIndicator value={8.5} size="sm" showIcon={false} />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Average APY</span>
            <TrendUp size={20} weight="fill" className="text-success" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">4.2%</p>
          <p className="text-sm text-gray-400">Across all protocols</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Validators</span>
            <ShieldCheck
              size={20}
              weight="fill"
              className="text-primary-green-light"
            />
          </div>
          <p className="text-2xl font-bold text-white mb-1">894,321</p>
          <p className="text-sm text-gray-400">Ethereum network</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Liquidity</span>
            <ArrowsLeftRight size={20} className="text-warning" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">$1.2B</p>
          <p className="text-sm text-gray-400">24h volume</p>
        </Card>
      </div>

      {/* Top Protocols */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Top Liquid Staking Protocols
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lido */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <LogoImage
                  src={getProtocolLogo("Lido")}
                  alt="Lido"
                  size={48}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Lido</h3>
                  <p className="text-gray-400 text-sm">stETH</p>
                </div>
              </div>
              <Badge variant="success">4.2% APY</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">TVL</p>
                <p className="text-white font-semibold">$14.8B</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Market Share</p>
                <p className="text-white font-semibold">63%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Validators</p>
                <p className="text-white font-semibold">29</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Risk</p>
                <Badge variant="success" size="sm">
                  Low
                </Badge>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Stake ETH
            </Button>
          </Card>

          {/* Rocket Pool */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <LogoImage
                  src={getProtocolLogo("Rocket Pool")}
                  alt="Rocket Pool"
                  size={48}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Rocket Pool</h3>
                  <p className="text-gray-400 text-sm">rETH</p>
                </div>
              </div>
              <Badge variant="success">3.8% APY</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">TVL</p>
                <p className="text-white font-semibold">$2.1B</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Market Share</p>
                <p className="text-white font-semibold">9%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Node Operators</p>
                <p className="text-white font-semibold">2,847</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Risk</p>
                <Badge variant="success" size="sm">
                  Low
                </Badge>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Stake ETH
            </Button>
          </Card>

          {/* Frax */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <LogoImage
                  src={getProtocolLogo("Frax")}
                  alt="Frax Finance"
                  size={48}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">Frax Finance</h3>
                  <p className="text-gray-400 text-sm">sfrxETH</p>
                </div>
              </div>
              <Badge variant="success">5.1% APY</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">TVL</p>
                <p className="text-white font-semibold">$856M</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Market Share</p>
                <p className="text-white font-semibold">3.7%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Validators</p>
                <p className="text-white font-semibold">12</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Risk</p>
                <Badge variant="warning" size="sm">
                  Medium
                </Badge>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Stake ETH
            </Button>
          </Card>

          {/* StakeWise */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <LogoImage
                  src={getProtocolLogo("StakeWise")}
                  alt="StakeWise"
                  size={48}
                />
                <div>
                  <h3 className="text-lg font-bold text-white">StakeWise</h3>
                  <p className="text-gray-400 text-sm">sETH2</p>
                </div>
              </div>
              <Badge variant="success">3.9% APY</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">TVL</p>
                <p className="text-white font-semibold">$241M</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Market Share</p>
                <p className="text-white font-semibold">1.0%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Validators</p>
                <p className="text-white font-semibold">8</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Risk</p>
                <Badge variant="success" size="sm">
                  Low
                </Badge>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              Stake ETH
            </Button>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary-green">1</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Stake Your Assets</h4>
            <p className="text-gray-400 text-sm">
              Deposit ETH or other supported assets into a liquid staking
              protocol
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-green-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary-green-light">2</span>
            </div>
            <h4 className="text-white font-semibold mb-2">
              Receive Liquid Token
            </h4>
            <p className="text-gray-400 text-sm">
              Get a liquid staking token (LST) that represents your staked
              position
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-success">3</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Use in DeFi</h4>
            <p className="text-gray-400 text-sm">
              Trade, lend, or provide liquidity with your LST while earning
              staking rewards
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
