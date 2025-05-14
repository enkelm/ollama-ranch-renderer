import ollama from 'ollama/browser'
import {
  queryOptions,
  experimental_streamedQuery as streamedQuery,
} from '@tanstack/react-query'
import type { ChatResponse } from 'ollama/browser'

export const chatQueryOptionsBuilder = (
  model: string,
  content: string | undefined,
) =>
  queryOptions({
    queryKey: ['chat', model, content],
    queryFn: streamedQuery({
      queryFn: async function* () {
        if (content?.trim()) {
          const chatStream = await ollama.chat({
            model,
            messages: [{ role: 'user', content }],
            stream: true,
          })

          const id = crypto.randomUUID()
          for await (const chunk of chatStream) {
            yield { id, ...chunk }
          }
        } else {
          return yield Promise.reject({ done: true } as ChatResponse)
        }
      },
      // refetchMode: 'append',
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 5,
  })
