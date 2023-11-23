import React from "react";
import type { RouteObject } from "react-router-dom";

const Social = React.lazy(() => import("@/pages/social"));
const Preview = React.lazy(() => import("@/pages/social/modules/Preview"));

export default [
  {
    path: "/social",
    element: <Social />,
  },
  {
    path: "/social/preview",
    element: <Preview />,
  },
] as RouteObject[];
