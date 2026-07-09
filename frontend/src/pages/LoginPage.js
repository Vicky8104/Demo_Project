import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./LandingPage.css";

export default function Login() {
const navigate = useNavigate();
const location = useLocation();
const { login } = useContext(AuthContext);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

// Query param (optional)
const queryParams = new URLSearchParams(location.search);
const role = queryParams.get("role");

// ================= LOGIN =================
const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

try {
  const res = await API.post("/auth/login", {
    email: email.toLowerCase(),
    password,
    role, // optional
  });
    // console.log("LOGIN RESPONSE:", res.data); // 🔥 DEBUG
 
    const { token, user } = res.data;

      localStorage.setItem("token", token);
    // console.log("TOKEN SAVED:", localStorage.getItem("token")); // 🔥

    // optional user save
    localStorage.setItem("user", JSON.stringify(user)); 

  // Save user (cookie backend में already store है)
  login({
    role: user.role,
    email: user.email,
    name: user.name,
  });

  // Role-based redirect
  if (user.role === "candidate") {
    navigate("/candidate");
  } else if (user.role === "admin") {
    navigate("/admin");
  } else if (user.role === "team") {
    navigate("/team");
  } else {
    navigate("/");
  }

} catch (err) {
  console.error("LOGIN ERROR:", err);
  alert(err?.response?.data?.message || err.message || "Login Failed");
} finally {
  setLoading(false);
}

};

return (
<>
{loading && <Loader text="Logging in..." />}

  <div className="login-card-container">
    <div className="login-card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group1">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group1">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group1">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  </div>
</>

);
}
