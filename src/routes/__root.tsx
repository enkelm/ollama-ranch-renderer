import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import ORSidebar from '@/components/layout/sidebar'
import ORHeader from '@/components/layout/header'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <SidebarProvider defaultOpen>
        <ORSidebar />

        <SidebarInset>
          <Card className="h-full">
            <CardHeader className="border-b-2 pb-3">
              <CardTitle className="flex h-5 items-center space-x-4 text-sm">
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
            <TanStackRouterDevtools />
            <TanstackQueryLayout />
          </>
        )}
      </SidebarProvider>
    )
  },
})
