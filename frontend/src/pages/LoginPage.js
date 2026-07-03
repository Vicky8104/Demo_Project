import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./LandingPage.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post(
        "/auth/login",
        {
          email: email.toLowerCase(),
          password,
        },
        {
          withCredentials: true, // 🔥 IMPORTANT (cookie ke liye)
        }
      );

      const user = res.data.user;

      // 🔥 Save user in context (NO token needed, cookie me hai)
      login({
        role: user.role,
        email: user.email,
      });

      // 🔥 ROLE BASED REDIRECT
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
      console.log("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}

      <div className="login-card-container">
        <div className="login-card">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.toLowerCase())
                }
                required
              />
            </div>

            <div className="form-group1">
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group1">
              <button type="submit" disabled={loading}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
