import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  loader: () => ({ crumb: 'Chat' }),
  component: RouteComponent,
})

function RouteComponent() {
  return <h1>hello world!</h1>
}
