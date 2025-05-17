import { useActionState, useDeferredValue, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ChatMessage from './message'
import PromptInput from './prompt-input'
import ModelSelector from './model-selector'
import type { IChatMessage } from './message'
import { chatQueryOptionsBuilder } from '@/queries/chatQuery'

const useChat = (model: string, prompt: string) => {
  const [chat, setChat] = useState<Array<IChatMessage>>([])
  const chatQuery = useQuery(chatQueryOptionsBuilder(model, prompt))

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

  return [chatDeferred, setChat] as const
}

const Chat = () => {
  const [model, setModel] = useState('qwen2.5-coder:1.5b')
  const [prompt, action] = useActionState(
    (
      _: string,
      { formData, chat }: { formData: FormData; chat: Array<IChatMessage> },
    ) => {
      const newPrompt = formData.get('prompt')?.toString() ?? ''
      setChat((c) =>
        c.concat([
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: newPrompt,
            generating: false,
          },
        ]),
      )
      return chat.map((c) => c.content) + newPrompt
    },
    '',
  )
  const [chat, setChat] = useChat(model, prompt)

  return (
    <div className="h-full flex flex-col justify-between">
      <section>
        {chat.map((c) => (
          <ChatMessage
            key={c.id}
            role={c.role}
            content={c.content}
            generating={c.generating}
          />
        ))}
      </section>

      <form
        action={(formData) => action({ formData, chat })}
        className="flex flex-row gap-4"
      >
        <PromptInput />
        <ModelSelector selectedModel={model} onChange={setModel} />
      </form>
    </div>
  )
}

export default Chat
