import { User, Robot } from '@phosphor-icons/react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
        ${isUser ? 'bg-primary-green-light/20' : 'bg-primary-green/20'}
      `}>
        {isUser ? (
          <User size={16} weight="fill" className="text-primary-green-light" />
        ) : (
          <Robot size={16} weight="fill" className="text-primary-green" />
        )}
      </div>

      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div className={`
          inline-block px-4 py-2 rounded-md max-w-[80%]
          ${isUser 
            ? 'bg-primary-green-light/20 text-white' 
            : 'bg-gray-800 text-gray-200'
          }
        `}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
