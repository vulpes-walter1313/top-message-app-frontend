import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "../components/Navbar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Navbar />
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
