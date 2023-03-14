import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import article from "./module/article";
import login from "./module/login";
import social from "./module/social";
import NotFound from "@/pages/error/NotFound";
import Demo from "@/pages/demo";

const routeConfig = [
  ...login,
  ...article,
  ...social,
  {
    path: "/",
    element: <Navigate to="/articles" replace />,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
] as RouteObject[];

export default routeConfig;
