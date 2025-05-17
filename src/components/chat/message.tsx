import Markdown from 'react-markdown'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Loader2Icon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'

export type IChatMessage = {
  id: `${string}-${string}-${string}-${string}-${string}`
  role: 'assistant' | 'user'
  content: string
  generating: boolean
}
type IChatMessageProps = Omit<IChatMessage, 'id'>
const ChatMessage = ({ generating, content, role }: IChatMessageProps) => {
  if (!content.trim()) {
    return null
  }
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className={cn({ 'text-end': role === 'user' })}>
          {role === 'assistant' ? 'Assistant' : 'User'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {generating && (
          <span className="flex gap-2 font-bold animate-pulse">
            <Loader2Icon className="animate-spin" /> Generating...
          </span>
        )}
        <Markdown
          components={{
            code: ({ children, className, node, ref, ...props }) => {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  {...props}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={dark}
                />
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            },
          }}
        >
          {content}
        </Markdown>
      </CardContent>
    </Card>
  )
}

export default ChatMessage
