import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("inspiration", "routes/inspiration.tsx"),
  route("giveaway", "routes/giveaway.tsx"),
  route("recycling", "routes/recycling.tsx"),
] satisfies RouteConfig;
