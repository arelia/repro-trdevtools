# TanStack Router DevTools SSR Reproducer

This is a **minimal reproducer project** for the bug reported in [TanStack Router #7205](https://github.com/TanStack/router/issues/7205).

## Bug Description

When using `@tanstack/react-router-devtools` in a TanStack Start SSR application, the server crashes during the build/SSR phase with:

```
ReferenceError: window is not defined
    at delegateEvents (node_modules/@tanstack/router-devtools-core/...)
    at Module.<top-level>
```

### Root Cause

The `@tanstack/react-router-devtools` package contains **top-level (module scope)** calls to `delegateEvents()`, which unconditionally accesses `window.document`. When the SSR bundler includes this package, these calls execute on the server during module initialization, where `window` is not defined.

## Key Concepts

**SSR Tree:** The tree of React components rendered on the server. Normally, components only render in the browser, but SSR apps render on the server first to generate HTML. If `<TanStackRouterDevtoolsPanelInProd />` is in the root layout (part of the SSR tree), the bundler must include `@tanstack/react-router-devtools` in the server bundle.

**Module Scope:** Code that runs when a module is first imported. The bug occurs because `delegateEvents()` is called at module scope (top-level), not inside a component or function. When the server loads the module, this code runs immediately and crashes.

## Exact Commands to Run

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repository:

```bash
git clone https://github.com/arelia/repro-trdevtools.git
cd repro-trdevtools
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Attempt production build (SSR bundling):

```bash
npm run build
```

**Expected:** Build completes successfully.

**Actual (with bug present):** Build fails with:

```
ReferenceError: window is not defined
    at delegateEvents (file:///...node_modules/@tanstack/router-devtools-core/dist/context-D56_tqst.js:1420:48)
    at Module.<top-level> (file:///...node_modules/@tanstack/router-devtools-core/dist/BaseTanStackRouterDevtoolsPanel-BbL4h7yi.js:1431:22)
```

This error occurs **during SSR module evaluation**, not at runtime. The bundler evaluates `@tanstack/react-router-devtools` at module scope, triggering `delegateEvents()` which accesses `window` on the server.

### 4. Verify DevTools Is the Culprit

To confirm the crash is caused by DevTools usage (not a general project issue):

**Step A:** Edit `src/routes/__root.tsx` and comment out the DevTools component:

```typescript
// Before: causes crash
// <TanStackRouterDevtoolsPanelInProd isOpen />

// Also comment out the import:
// import { TanStackRouterDevtoolsPanelInProd } from '@tanstack/react-router-devtools'
```

**Step B:** Rebuild:

```bash
npm run build
```

**Expected:** Build completes without errors.

**Step C:** Re-enable the DevTools component and re-run `npm run build` to confirm the error returns.

This A/B pattern confirms the bug is in the DevTools package, not elsewhere in the project.

## Project Structure

```
src/
  routes/
    __root.tsx           # Root layout with DevTools component (CAUSES BUG)
    index.tsx            # Simple index page
  router.tsx             # Router configuration
  routeTree.gen.ts       # Auto-generated route tree
  entry-client.tsx       # Client-side entry point
  entry-server.tsx       # Server-side SSR entry point

vite.config.ts           # Vite/TanStack Start configuration (intentionally NO SSR shim)
package.json             # Dependencies and build scripts
tsconfig.json            # TypeScript configuration
README.md                # This file
```

### Key Details

- **No SSR shim**: Unlike production apps (e.g., github-ui), this reproducer intentionally does **not** include an SSR alias shim for `@tanstack/react-router-devtools`. This allows the bug to surface.
- **DevTools in SSR tree**: The `<TanStackRouterDevtoolsPanelInProd />` component is placed in the root layout, ensuring it's part of the server-rendered component tree and thus evaluated during SSR bundling.
- **Minimal dependencies**: Only includes what's needed to demonstrate the bug—no unnecessary packages that could introduce confounding variables.

## Version Info

- `@tanstack/react-router-devtools`: ^1.166.13
- `@tanstack/react-start`: ^1.167.40
- Node.js: 18+
- npm: 8+

## How This Differs from Previous Attempts

Previous simple repros (e.g., direct `node -e "import(@tanstack/router-devtools-core...)"`) were rejected because:

- They didn't demonstrate **normal app usage** of DevTools
- They bypassed the **standard SSR bundling/rendering flow**
- They didn't show **real component usage** in an SSR application

This reproducer is a **complete SSR application** that:

- Uses DevTools the **normal way** (component in app code)
- Demonstrates the bug through **real SSR bundling and rendering**
- Shows the crash in the **actual application flow** (build, not synthetic imports)

## Workaround (for production apps)

If you need DevTools in an SSR app until this is fixed, you can create an SSR-only shim:

```typescript
// shims/react-router-devtools.tsx
export function TanStackRouterDevtoolsPanelInProd() {
  return null;
}
```

Then in your Vite config, conditionally resolve the shim during SSR:

```typescript
function ssrOnlyShims() {
  const shims: Record<string, string> = {
    "@tanstack/react-router-devtools": path.resolve(
      "src/shims/react-router-devtools.tsx",
    ),
  };

  return {
    name: "ssr-only-shims",
    enforce: "pre" as const,
    resolveId(
      id: string,
      _importer: string | undefined,
      options?: { ssr?: boolean },
    ) {
      if (options?.ssr && id in shims) {
        return shims[id];
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [ssrOnlyShims(), ...otherPlugins],
});
```

This is the pattern used in [github-ui/packages/ui-service](https://github.com/github/github-ui/blob/main/packages/ui-service/vite.config.ts#L75-L90).

## Related Issues & PRs

- **Original Issue**: https://github.com/TanStack/router/issues/7205
- **GitHub UI Workaround**: https://github.com/github/github-ui/blob/main/packages/ui-service/shims/react-router-devtools.tsx
