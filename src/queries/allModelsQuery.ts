import ollama from 'ollama/browser'
import { queryOptions } from '@tanstack/react-query'

const QUERY_KEY = 'all-models'

export const allModelsKeys = {
  all: [QUERY_KEY],
}

export const allModelsQueryBuilder = () =>
  queryOptions({
    queryKey: allModelsKeys.all,
    queryFn: () => ollama.list(),
  })
