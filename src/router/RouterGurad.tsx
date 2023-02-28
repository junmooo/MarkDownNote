import Cookies from "js-cookie";
import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";

type Iprops = { routes: RouteObject[] };
const RouterGurad = (props: Iprops) => {
  const { routes } = props;
  const route = useRoutes(routes);
  const location = useLocation();
  const navigate = useNavigate();
  const token = Cookies.get("token");

  const exclude = ["/login", "/register", "/upload"];

  if (!exclude.includes(location.pathname) && !token) {
    navigate("/login");
  }
  return route;
};

export default RouterGurad;
