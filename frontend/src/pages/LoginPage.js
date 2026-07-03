import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import OtpModal from "../components/OtpModal";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./LandingPage.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // ================= LOGIN + SEND OTP =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Step 1: Verify email/password from backend
      const res = await API.post("/login", {
        email: email.toLowerCase(),
        password,
      });

      const phone = res.data.mobile;

      if (!phone) {
        alert("Phone number not found");
        setLoading(false);
        return;
      }

      // 🔥 Step 2: Setup reCAPTCHA
      if (!window.recaptchaVerifier) {
     window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  { size: "invisible" }
);
      }

      const appVerifier = window.recaptchaVerifier;

      // 🔥 Step 3: Send OTP
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);
      setShowOtp(true);

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
      if (!confirmationResult) {
        alert("Please request OTP first");
        setLoading(false);
        return;
      }

      // 🔥 Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      // 🔥 Final login (backend JWT + cookie)
      const loginRes = await API.post("/verify-otp", {
        token: idToken,
        email,
      });

      const user = loginRes.data.user;

      // 🔥 Save in context
      login({
        token: "cookie-based",
        role: user.role,
        email: user.email,
        name: user.name,
        teamNumber: user.teamNumber,
      });

      // 🔥 Redirect based on role
      if (user.role === "candidate") navigate("/candidate");
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "team") navigate("/team");

    } catch (err) {
      console.log("OTP ERROR:", err);
      alert("Invalid OTP ❌");
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

      const res = await API.post("/login", {
        email: email.toLowerCase(),
        password,
      });

      const phone = res.data.phone;

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);

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

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </>
  );
}
