import { createFileRoute } from '@tanstack/react-router'
import { allModelsQueryBuilder } from '@/queries/allModelsQuery'
import Chat from '@/components/chat'

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

function RouteComponent() {
  return <Chat />
}
