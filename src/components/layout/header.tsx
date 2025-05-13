import { Link, useLocation, useMatches } from '@tanstack/react-router'
import { Fragment, useMemo } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '../ui/navigation-menu'
import { Button } from '../ui/button'
import type { JSX } from 'react/jsx-runtime'
import { ModeToggle } from '@/integrations/color-shemes/mode-toggle'

const MinimizedHeader = () => {
  const matches = useMatches()

  const breadCrumbs = useMemo(
    () =>
      matches
        .reduce<Array<JSX.Element>>((acc, curr) => {
          const crumb = curr.loaderData?.crumb
          if (!crumb) return acc

          return acc.concat([
            <BreadcrumbItem key={`${crumb}-breadcrumb-label`}>
              <BreadcrumbLink asChild>
                <Link
                  to={curr.pathname}
                  params={curr.params}
                  search={curr.search}
                  className="font-bold text-lg"
                >
                  {crumb}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>,
          ])
        }, [])
        .map((bc, i, arr) => (
          <Fragment key={`header-breadCrumb-${i}`}>
            {bc}
            {i !== arr.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        )),
    [matches],
  )

  return (
    <nav className="flex items-center space-x-4 text-sm">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>{breadCrumbs}</BreadcrumbList>
      </Breadcrumb>
    </nav>
  )
}

const MaximizedHeader = () => {
  const location = useLocation()

  return (
    <section className="w-full animate-in flex flex-row justify-between items-center">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <SidebarTrigger />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              <Button variant={location.pathname !== '/' ? 'ghost' : 'outline'}>
                <Link className="font-bold text-lg" to="/">
                  Home
                </Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem asChild>
              <Button
                variant={location.pathname !== '/chat' ? 'ghost' : 'outline'}
              >
                <Link className="font-bold text-lg" to="/chat">
                  Chat
                </Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div>
        <ModeToggle />
      </div>
    </section>
  )
}

const ORHeader = () => {
  const { open } = useSidebar()

  return !open ? <MaximizedHeader /> : <MinimizedHeader />
}

export default ORHeader
