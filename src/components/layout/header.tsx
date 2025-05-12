import { Link, useMatches } from '@tanstack/react-router'
import { Fragment, useMemo } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { SidebarTrigger } from '../ui/sidebar'
import type { JSX } from 'react/jsx-runtime'

const ORHeader = () => {
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

  console.debug(breadCrumbs.length)

  return (
    <>
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>{breadCrumbs}</BreadcrumbList>
      </Breadcrumb>
    </>
  )
}

export default ORHeader
