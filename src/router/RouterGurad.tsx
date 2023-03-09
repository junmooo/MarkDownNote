import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import store from "@/mobx";

type Iprops = { routes: RouteObject[] };

const RouterGurad = (props: Iprops) => {
  const { routes } = props;
  const route = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();

  const exclude = ["/login", "/register"];

  if (!exclude.includes(location.pathname) && !localStorage.getItem("token")) {
    // navigate("/login");
  }
  return route;
};

export default RouterGurad;
