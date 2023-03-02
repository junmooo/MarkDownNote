import React from "react";
import type { RouteObject } from "react-router-dom";

const Articles = React.lazy(() => import("@/pages/article"));
const Article = React.lazy(() => import("@/pages/article/editor"));

export default [
  {
    path: "/articles",
    element: <Articles />,
  },
] as RouteObject[];
