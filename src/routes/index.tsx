import { createFileRoute } from "@tanstack/react-router";
import React from "react";

function IndexPage() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Reproducer"),
  );
}

export const Route = createFileRoute("/")({
  component: IndexPage,
});
