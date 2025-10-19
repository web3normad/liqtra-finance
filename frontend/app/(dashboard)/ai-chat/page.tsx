// app/(dashboard)/ai-chat/page.tsx
"use client";

import { AIChatbot } from "@/components/ai/AIChatbot";
import { Card } from "@/components/common/Card";
import { Brain, Lightning, Shield, TrendUp } from "@phosphor-icons/react";

export default function AIChatPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AI Yield Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chat with our AI to discover and invest in the best yield
          opportunities
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain
                size={20}
                className="text-primary-green"
                weight="duotone"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Smart Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered yield analysis
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightning size={20} className="text-blue-500" weight="duotone" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Instant Automation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                One-click investment setup
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-purple-500" weight="duotone" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Risk Assessment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Personalized risk profiling
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendUp size={20} className="text-orange-500" weight="duotone" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Real-time Yields
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Live protocol monitoring
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-2 p-0 h-[600px] overflow-hidden">
          <AIChatbot isOpen={true} />
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              💡 How It Works
            </h3>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-green/20 text-primary-green rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </span>
                <span>Connect your wallet to start chatting</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-green/20 text-primary-green rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </span>
                <span>AI suggests top yield opportunities</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-green/20 text-primary-green rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </span>
                <span>Choose protocols and enter amount</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-green/20 text-primary-green rounded-full flex items-center justify-center text-xs font-semibold">
                  4
                </span>
                <span>Approve and deposit automatically</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Example Commands
            </h3>
            <div className="space-y-2 text-sm">
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                "Show me yield opportunities"
              </div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                "Invest in Aave and Compound"
              </div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                "I want to invest 100 USDC"
              </div>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                "Show my active positions"
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary-green/10 to-primary-green/5 border-primary-green/20">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ⚡ Pro Tip
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The AI assistant is also available as a floating sidebar on all
              pages. Look for the robot icon in the bottom-right corner!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
