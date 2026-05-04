import { createRootRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanelInProd } from "@tanstack/react-router-devtools";
import React from "react";

function RootComponent() {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Outlet, null),
    React.createElement(TanStackRouterDevtoolsPanelInProd, { isOpen: true }),
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
