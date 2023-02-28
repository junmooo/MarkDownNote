import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import article from "./module/article";
import login from "./module/login";
import NotFound from "@/pages/error/NotFound";

const routeConfig = [
  ...login,
  ...article,
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
] as RouteObject[];

export default routeConfig;
