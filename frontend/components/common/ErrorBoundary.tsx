'use client'

import { Component, ReactNode } from 'react'
import { WarningCircle } from '@phosphor-icons/react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <WarningCircle size={32} className="text-danger" weight="fill" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>
            
            <p className="text-gray-400 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              variant="primary"
            >
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}