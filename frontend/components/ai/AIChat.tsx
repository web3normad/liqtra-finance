'use client'

import { useState, useRef, useEffect } from 'react'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { Card } from '@/components/common/Card'
import { ChatMessage } from './ChatMessage'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI portfolio manager. I can help you optimize yields, assess risks, and manage your DeFi positions. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Based on current market conditions, I recommend reallocating 30% of your USDC to Aave on Arbitrum for 6.8% APY. This would increase your portfolio yield by approximately 2.3% while maintaining your risk profile.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-green-light rounded-md flex items-center justify-center">
          <Sparkle size={20} weight="fill" className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold">AI Assistant</h3>
          <p className="text-xs text-gray-400">Always learning, always optimizing</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-primary-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about yields, risks, or strategies..."
              className="resize-none"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="md"
            variant="primary"
          >
            <PaperPlaneRight size={16} weight="fill" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
