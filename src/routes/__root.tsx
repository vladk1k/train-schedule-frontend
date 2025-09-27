import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ErrorComponent } from '@/components/ErrorComponent/ErrorComponent'

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
  notFoundComponent: ErrorComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
