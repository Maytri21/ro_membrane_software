import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");
  
  const [isSignup, setIsSignup] =
    useState(false);

  const handleLogin = async (e) => {

    if (e) e.preventDefault();

  try {

    const endpoint = isSignup
      ? "signup"
      : "login";

    const response = await axios.post(
  `https://ro-membrane-software.onrender.com/${endpoint}`,
  {
    username,
    password
  }
);
    
    if (isSignup) {

      alert("Account Created Successfully");

    }

    if (!isSignup) {

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      localStorage.setItem(
        "username",
        username
      );

      onLogin();

    }

    else {

      setIsSignup(false);

    }

  }

  catch (error) {

    alert(

      error.response?.data?.message
      || "Authentication Failed"

    );

  }

};

    // SIMPLE AUTH

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <div style={styles.title}>
          RO Projection Login
        </div>

        <div style={styles.sub}>
          Industrial RO Simulation Platform
        </div>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="button"
          style={styles.button}
          onClick={(e) => handleLogin(e)}
        >
          {
            isSignup
            ? "Create Account"
            : "Login"
          }

        </button>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "#0f766e",
            cursor: "pointer",
            fontWeight: "600"
          }}

          onClick={() =>
            setIsSignup(!isSignup)
          }
        >

          {
            isSignup
              ? "Already have an account? Login"
              : "Create New Account"
          }

        </div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#0f172a,#1e293b)"
  },

  card: {
    width: "400px",
    background: "white",
    padding: "40px",
    borderRadius: "24px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "10px",
    textAlign: "center"
  },

  sub: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "30px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#0f766e,#115e59)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer"
  }

};

export default Login;