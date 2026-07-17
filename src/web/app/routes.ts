import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes (login/register)
  layout("shared/layouts/public-layout.tsx", [
    index("features/dashboard/pages/home.tsx"), // index route redirects appropriately
    route("login", "features/auth/pages/login.tsx"),
    route("register", "features/auth/pages/register.tsx"),
  ]),

  route("logout", "features/auth/pages/logout.tsx"),

  // Authenticated routes (dashboard)
  layout("shared/layouts/dashboard-layout.tsx", [
    route("dashboard", "features/dashboard/pages/index.tsx"),
    route("dashboard/settings", "features/dashboard/pages/settings.tsx"),
    route("dashboard/workflows", "features/workflows/pages/workflows.tsx"),
  ]),
] satisfies RouteConfig;
