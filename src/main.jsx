import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";

import SignUpForm from "./SignUpFormPage";
import UserLogin from "./UserLoginPage";

const App = () => {
  return (
    <Switch>
      <Route path="/sign_up">
        <SignUpForm />
      </Route>
      <Route path="/log_in">
        <UserLogin />
      </Route>
    </Switch>
  );
};

ReactDOM.render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>,
  document.getElementById("root")
);
