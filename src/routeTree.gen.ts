import { Route as IndexRoute } from "./routes/index";
import { Route as RootRouteConfig } from "./routes/__root";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexRoute;
      parentRoute: typeof RootRouteConfig;
    };
  }
}

export const routeTree = RootRouteConfig.addChildren([IndexRoute]);
