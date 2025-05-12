import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, useSidebar } from '@/components/ui/sidebar'
import ORSidebar from '@/components/layout/sidebar'
import ORHeader from '@/components/layout/header'
import { cn } from '@/lib/utils'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const { open } = useSidebar()
    return (
      <>
        <ORSidebar />

        <SidebarInset>
          <Card className={cn('h-full', { 'rounded-none': !open })}>
            <CardHeader className="border-b-2 pb-3">
              <CardTitle>
                <ORHeader />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        </SidebarInset>

        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <TanstackQueryLayout />
          </>
        )}
      </>
    )
  },
})
