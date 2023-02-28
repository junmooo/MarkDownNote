import React from "react";
import type { RouteObject } from "react-router-dom";

const Login = React.lazy(() => import("@/pages/login"));
const Register = React.lazy(() => import("@/pages/login/register"));

export default [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
] as RouteObject[];
