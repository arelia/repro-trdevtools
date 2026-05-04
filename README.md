# TanStack Router DevTools SSR Reproducer

Minimal reproduction for https://github.com/TanStack/router/issues/7205

## Steps to Reproduce

```bash
npm install
npm run build
```

Expected: Build completes successfully.

Actual: `ReferenceError: window is not defined` in `@tanstack/react-router-devtools` during SSR bundling.

### Verify DevTools Is the Culprit

1. Comment out `<TanStackRouterDevtoolsPanelInProd isOpen />` in `src/routes/__root.tsx`
2. Run `npm run build` — succeeds
3. Re-enable the component and rebuild — fails again
