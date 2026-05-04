import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanelInProd } from "@tanstack/react-router-devtools";

/**
 * Root route with DevTools in the SSR tree.
 * This ensures @tanstack/react-router-devtools is evaluated at module scope during SSR.
 */
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtoolsPanelInProd isOpen />
    </>
  );
}
