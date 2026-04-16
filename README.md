# repro-trdevtools

Minimal reproduction for [ReferenceError: window is not defined in @tanstack/router-devtools-core during SSR](https://github.com/TanStack/router/issues/7205).

## Reproduce

```bash
npm install
node repro.mjs
```

## Why the import uses a relative path

The crash originates in an internal chunk (`BaseTanStackRouterDevtoolsPanel-*.js`) that isn't exposed by the package's `exports` map, so Node.js won't resolve it via a bare specifier. The relative `./node_modules/...` path is used here to simulate what a bundler does during SSR — bundlers like Vite resolve internal chunks directly, bypassing the `exports` map, and include them in the server bundle. When that chunk loads, top-level `delegateEvents(["click"])` calls execute immediately and access `window.document`, crashing in Node.js.
