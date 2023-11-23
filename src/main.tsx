import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import "./styles.css";

ReactDOM.render(
  <div>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>,
  document.getElementById("root")
);
