import React from "react";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./index.css";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import { request } from "./request";
import SignUpForm from "./SignUpFormPage";
import UserLogin from "./UserLoginPage";
import Dashboard from "./DashboardPage";
import Subreddit from "./SubredditPage";
import Post from "./PostPage";

async function validateToken(user) {
  const res = await request.get(`/users/${user.id}`);
  if (res.status === 200) {
    return res.data;
  } else {
    return false;
  }
}

const App = () => {
  const [user, setUser] = useState(() => {
    let u = localStorage.getItem("user");
    if (u) {
      return JSON.parse(u);
    }
  });

  useEffect(() => {
    if (user) {
      request.secret = user.token;
    } else {
      request.secret = null;
    }
  }, [user]);

  useEffect(() => {
    async function validate() {
      if (user) {
        let validUser = await validateToken(user);
        if (validUser === false) {
          setUser(undefined);
          localStorage.removeItem("user");
        }
      }
    }
    validate();
  }, []);

  return (
    <div>
      <Stack sx={{ mt: 2, ml: 5 }} direction="row" alignItems="center">
        <Avatar alt={user.name} src={user.avatar} sx={{ mr: 1.5 }} />
        <h4>{`u/${user.name}`}</h4>
      </Stack>
      <Switch>
        <Route path="/sign_up">
          <SignUpForm />
        </Route>
        <Route path="/log_in">
          <UserLogin setUser={setUser} />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/r/:nick" exact>
          <Subreddit currentUser={user} />
        </Route>
        <Route path="/r/:nick/posts/:postId" exact>
          <Post currentUser={user} />
        </Route>
      </Switch>
    </div>
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
