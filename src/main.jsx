import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";

import SignUpForm from "./SignUpFormPage";

const App = () => {
  return (
    <Switch>
      <Route path="/sign_up">
        <SignUpForm />
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
