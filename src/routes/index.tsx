import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div>
      <h1>TanStack Router DevTools SSR Reproducer</h1>
      <p>
        This app demonstrates a bug where{" "}
        <code>@tanstack/react-router-devtools</code> crashes during SSR because
        it calls <code>delegateEvents()</code> at module scope, which accesses{" "}
        <code>window</code> on the server.
      </p>
      <p>
        <strong>Expected behavior:</strong> Build succeeds, server starts, page
        renders.
      </p>
      <p>
        <strong>Actual behavior:</strong> Build or start fails with:
      </p>
      <pre>
        {`ReferenceError: window is not defined
    at delegateEvents (node_modules/@tanstack/router-devtools-core/...)
    at Module.<top-level>`}
      </pre>
      <p>See README.md for reproduction steps.</p>
    </div>
  );
}
