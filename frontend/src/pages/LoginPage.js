import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import OtpModal from "../components/OtpModal";
import "./LandingPage.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  // ================= LOGIN + SEND OTP =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Backend login → OTP send
      const res = await API.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      setShowOtp(true);
      alert(res.data.message); // OTP sent

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  // ================= VERIFY OTP =================
  const verifyOtpHandler = async () => {
    setLoading(true);

    try {
      // 🔥 Backend OTP verify
      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      const user = res.data.user;

      // 🔥 Save user
      login({
        token: "session",
        role: user.role,
        email: user.email,
        name: user.name,
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
      console.log("OTP ERROR:", err);
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }

    setLoading(false);
  };

  // ================= RESEND OTP =================
  const resendOtp = async () => {
    try {
      if (!email || !password) {
        alert("Enter email & password first");
        return;
      }

      await API.post("/auth/login", {
        email: email.toLowerCase(),
        password,
      });

      alert("OTP Resent ✅");

    } catch (err) {
      console.log("RESEND ERROR:", err);
      alert("Failed to resend OTP");
    }
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

          {showOtp && (
            <OtpModal
              otp={otp}
              setOtp={setOtp}
              verifyOtpHandler={verifyOtpHandler}
              resendOtp={resendOtp}
              onClose={() => setShowOtp(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}
