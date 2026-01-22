import "./style.css";
import Login from "./pages/login.js";
import Register from "./pages/registration.js";
import Home from "./pages/Home.js";
import { isAuthenticated } from "./auth.js";

const app = document.getElementById("app");

function router() {
  const route = window.location.hash;

  if (route === "#/register") {
    app.innerHTML = Register();
  } else if (route === "#/home") {
    if (!isAuthenticated()) {
      window.location.hash = "/login";
      return;
    }
    app.innerHTML = Home();
  } else {
    app.innerHTML = Login();
  }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

