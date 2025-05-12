import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { allModelsQueryBuilder } from '@/queries/listModelsQueryOptions'

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
  const { allModelsQueryOptions } = Route.useRouteContext()
  const { data } = useQuery(allModelsQueryOptions)

  return (
    <div>
      <h1>Models:</h1>
      <ul>{data?.models.map((m) => <li key={m.model}>{m.name}</li>)}</ul>
    </div>
  )
}
