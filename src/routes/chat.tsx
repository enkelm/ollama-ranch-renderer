import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  memo,
  useActionState,
  useDeferredValue,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2Icon } from 'lucide-react'
import Markdown from 'react-markdown'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import type { ModelResponse } from 'ollama'
import { allModelsQueryBuilder } from '@/queries/allModelsQuery'
import { chatQueryOptionsBuilder } from '@/queries/chatQuery'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/chat')({
  beforeLoad: () => ({
    allModelsQueryOptions: allModelsQueryBuilder(),
  }),
  loader: ({ context: { queryClient, allModelsQueryOptions } }) => {
    queryClient.prefetchQuery(allModelsQueryOptions)
    return { crumb: 'Chat' }
  },
  component: RouteComponent,
})

const PromptInput = memo(() => {
  const { pending } = useFormStatus()

  return <Input name="prompt" disabled={pending} type="text" />
})

type IModelSelectorProps = {
  selectedModel: string
  onChange: (model: string) => void
}

const ModelSelector = memo(
  ({ selectedModel, onChange }: IModelSelectorProps) => {
    const { allModelsQueryOptions } = Route.useRouteContext()
    const { data: { models: allModels } = { models: [] } } = useQuery(
      allModelsQueryOptions,
    )
    const { pending } = useFormStatus()

    const groupedModels = Object.entries(
      allModels.reduce(
        (acc, curr) => {
          const family = curr.details.family
          const grouping = acc[family]
          return { ...acc, [family]: grouping ? grouping.concat(curr) : [curr] }
        },
        {} as Record<string, Array<ModelResponse> | undefined>,
      ),
    ).map(([family, models]) => (
      <DropdownMenuContent key={family + '-model-selector'} className="w-56">
        <DropdownMenuLabel>{family}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedModel} onValueChange={onChange}>
          {models?.map((m) => (
            <DropdownMenuRadioItem key={m.name} value={m.name}>
              {m.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    ))

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={pending}>
            {pending && <Loader2Icon />} Model: {selectedModel}
          </Button>
        </DropdownMenuTrigger>
        {groupedModels}
      </DropdownMenu>
    )
  },
)

type IChatMessage = {
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
        <CardTitle>{role === 'assistant' ? 'Assistant' : 'User'}</CardTitle>
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

function RouteComponent() {
  const [chat, setChat] = useState<Array<IChatMessage>>([])
  const [formState, action] = useActionState<
    { model: string; prompt: string },
    FormData
  >(
    (prevState, formData) => {
      const prompt = formData.get('prompt')?.toString() ?? ''
      setChat((c) =>
        c.concat([
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: prompt,
            generating: false,
          },
        ]),
      )
      return {
        model: formData.get('model')?.toString() ?? prevState.model,
        prompt: chat.map((c) => c.content) + prompt,
      }
    },
    { model: 'qwen2.5-coder:1.5b', prompt: '' },
  )

  const chatQuery = useQuery(
    chatQueryOptionsBuilder(formState.model, formState.prompt),
  )

  const chatDeferred = useDeferredValue<Array<IChatMessage>>(
    chatQuery.isPending ||
      !chat.find((c) => chatQuery.data?.at(-1)?.id === c.id)
      ? chat.concat([
          {
            id: chatQuery.data?.at(-1)?.id ?? crypto.randomUUID(),
            role: 'assistant',
            content:
              chatQuery.data
                ?.map((d) => {
                  return d.message.content
                })
                .join('') ?? '',
            generating: !(chatQuery.data?.at(-1)?.done ?? false),
          },
        ])
      : chat,
  )

  useEffect(() => {
    if (chatQuery.data?.at(-1)?.done) {
      setChat((c) =>
        c.concat([
          {
            id: chatQuery.data.at(-1)!.id,
            role: 'assistant',
            content: chatDeferred.at(-1)!.content,
            generating: false,
          },
        ]),
      )
    }
  }, [chatQuery.data?.at(-1)?.done, chatQuery.data?.at(-1)!.id, setChat])

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="h-full flex flex-col justify-between">
      <section>
        {chatDeferred.map((c) => (
          <ChatMessage
            key={c.id}
            role={c.role}
            content={c.content}
            generating={c.generating}
          />
        ))}
      </section>

      <form ref={formRef} action={action} className="flex flex-row gap-4">
        <PromptInput />
        <ModelSelector
          selectedModel={formState.model}
          onChange={(model) => {
            if (formRef.current) {
              const formData = new FormData(formRef.current)
              formData.set('model', model)
              action(formData)
            }
          }}
        />
      </form>
    </div>
  )
}
