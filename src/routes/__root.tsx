import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanelInProd } from "@tanstack/react-router-devtools";

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
