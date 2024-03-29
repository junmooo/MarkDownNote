import React from "react";
import type { RouteObject } from "react-router-dom";

const Articles = React.lazy(() => import("@/pages/article"));

export default [
  {
    path: "/articles",
    element: <Articles />,
  },
] as RouteObject[];
