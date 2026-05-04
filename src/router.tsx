import { RootRoute, Router as TanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const Route = new RootRoute({});

export const router = new TanStackRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
