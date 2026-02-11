import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("results", "routes/results.tsx"),
    route("data", "routes/data.tsx"),
    route("about", "routes/about.tsx"),
    route("report", "routes/report.tsx"),
] satisfies RouteConfig;
