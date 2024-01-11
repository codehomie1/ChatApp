import "./login.css";
import React from "react";
import Cookies from "universal-cookie";
import HomePage from "../home/home";

const cookies = new Cookies();

function App() {
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  async function handleSubmit() {
    setIsLoading(true);
    setErrorMessage(""); // fresh error message each time
    const body = {
      userName: userName,
      password: password,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: "POST",
    };
    const result = await fetch("/createUser", httpSettings);
    const apiRes = await result.json();
    console.log(apiRes);
    if (apiRes.status) {
      // user was created
      setErrorMessage(apiRes.message);
    } else {
      // some error message
      setErrorMessage(apiRes.message);
    }
    setIsLoading(false);
  }

  async function handleLogIn() {
    setIsLoading(true);
    setErrorMessage(""); // fresh error message each time
    const body = {
      userName: userName,
      password: password,
    };
    const httpSettings = {
      body: JSON.stringify(body),
      method: "POST",
    };
    const result = await fetch("/login", httpSettings);
    if (result.status === 200) {
      // login worked
      setIsLoggedIn(true);
      //getConversations();
    } else {
      // login did not work
      setErrorMessage(`Username or password incorrect.`);
    }

    setIsLoading(false);
  }

  if (isLoggedIn) {
    return (
      <HomePage
        cookies={cookies}
        userName={userName}
        setIsLoading={setIsLoading}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <div className="App">
      <div className="login-page">
        <div className="main-container">
          <h1 className="app-title">Chat App</h1>
          Username:
          <input
            className="homepage-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          Password:{" "}
          <input
            className="homepage-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <div></div>
          <div className="buttons">
            <button
              className="margin-left"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Register
            </button>
            <button onClick={handleLogIn} disabled={isLoading}>
              Log in
            </button>
          </div>
          <div className="center-text top-space">
            {isLoading ? "Loading ..." : null}
          </div>
          <div className="center-text">{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
