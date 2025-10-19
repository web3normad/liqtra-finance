'use client'

import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { ArrowsLeftRight, Plus, Minus } from '@phosphor-icons/react'
import { PositionMetrics } from './PositionMetrics'
import { MomentumCard } from './MomentumCard'
import { GeneralOverview } from './GeneralOverview'
import { RiskAssessment } from './RiskAssessment'
import { RewardProjection } from './RewardProjection'

export function PositionDetails() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-green to-primary-green-light rounded-md flex items-center justify-center text-3xl">
              🏦
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-white">Aave V3 USDC</h1>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <p className="text-gray-400">Ethereum Mainnet • Lending Position</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" leftIcon={<Plus size={16} weight="bold" />}>
              Deposit
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Minus size={16} weight="bold" />}>
              Withdraw
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<ArrowsLeftRight size={16} weight="bold" />}>
              Manage
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <PositionMetrics />
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MomentumCard />
        <GeneralOverview />
        <RiskAssessment />
        <RewardProjection />
      </div>
    </div>
  )
}