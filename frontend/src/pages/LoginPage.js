import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import OtpModal from "../components/OtpModal";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "./LandingPage.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  // ✅ LOGIN + SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/login", {
        email: email.toLowerCase(),
        password,
      });

      const phone = res.data.phone;

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
      }

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }

    setLoading(false);
  };

  // ✅ VERIFY OTP
  const verifyOtpHandler = async () => {
    setLoading(true);

    try {
      if (!confirmationResult) {
        alert("Please request OTP first");
        setLoading(false);
        return;
      }

      // ⚠️ FIXED: correct firebase confirmationResult usage
      const token = await confirmationResult.confirm(otp);
      const idToken = await token.user.getIdToken();

      const loginRes = await API.post("/verify-firebase", {
        token: idToken,
        email,
      });

      const user = loginRes.data.user;

      login({
        token: "cookie-based",
        role: user.role,
        email: user.email,
        name: user.name,
        teamNumber: user.teamNumber,
      });

      if (user.role === "candidate") navigate("/candidate");
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "team") navigate("/team");
    } catch (err) {
      alert("Invalid OTP ❌");
    }

    setLoading(false);
  };

  // ✅ RESEND OTP
  const resendOtp = async () => {
    try {
      const res = await API.post("/login", {
        email,
        password,
        role,
      });

      const phone = res.data.phone;

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          { size: "invisible" },
          auth
        );
      }

      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        appVerifier
      );

      setConfirmationResult(result);

      alert("OTP Resent!");
    } catch (err) {
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
              />
            </div>

            <div className="form-group1">
              <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
