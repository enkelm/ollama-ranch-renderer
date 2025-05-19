import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err) => {
      if (err.name === 'AbortError') {
        toast(err.message)
      }
    },
  }),
  mutationCache: new MutationCache(),
})

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
