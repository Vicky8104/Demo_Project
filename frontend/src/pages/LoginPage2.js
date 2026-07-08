
// pages/Login.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import { useState } from "react";
import "./LandingPage.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await API.post("/login", {
      email,
      password,
      role,
    });

    const data = await res.json();



    // 🔥 FIX ONLY THIS PART
    if (res.ok) {

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      login({
        token: data.token,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        teamNumber: data.user.teamNumber   // 🔥 IMPORTANT
      });

      if (data.user.role === "candidate") navigate("/candidate");
      else if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "team") navigate("/team");

    } else {
      alert(data.message);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="card-container">
        <div className="card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group1">
              <input
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group1">
              <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}  </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}