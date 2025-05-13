import ollama from 'ollama/browser'
import {
  queryOptions,
  experimental_streamedQuery as streamedQuery,
} from '@tanstack/react-query'

export const chatQueryOptionsBuilder = (model: string, prompt: string) =>
  queryOptions({
    queryKey: ['chat', prompt],
    queryFn: streamedQuery({
      queryFn: () =>
        ollama.generate({
          model,
          prompt,
          stream: true,
        }),
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
