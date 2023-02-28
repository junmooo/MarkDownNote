import React from "react";
import type { RouteObject } from "react-router-dom";

const Articles = React.lazy(() => import("@/pages/article"));
const Article = React.lazy(() => import("@/pages/article/article"));

export default [
  {
    path: "/articles",
    element: <Articles />,
  },
  {
    path: "/article",
    element: <Article />,
  },
] as RouteObject[];
