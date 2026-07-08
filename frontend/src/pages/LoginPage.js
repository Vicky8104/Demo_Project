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
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  // ================= LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log(email, password, role);
    // try {
    //  const res = await API.post("/login", {
    //     email: email.toLowerCase(),
    //     password,
    //     role
    //   });

    //   const loginData = await res.data;

    //   // SEND OTP
    //   // await API.post("/send-otp", { email });

    //   // setShowOtp(true);

    //   login({
    //     token: loginData.token,
    //     role: loginData.user.role,
    //     email: loginData.user.email,
    //     name: loginData.user.name,
    //     teamNumber: loginData.user.teamNumber
    //   });


    //       // ROLE ROUTING (UNCHANGED)
    //       if (loginData.user.role === "candidate") navigate("/candidate");
    //       else if (loginData.user.role === "admin") navigate("/admin");
    //       else if (loginData.user.role === "team") navigate("/team");

    //     } catch (err) {
    //       alert(err.response?.data.message);
    //     }

    //     setLoading(false);
    //   };

    try {
      const res = await API.post(
        "/auth/login",
        {
          email: email.toLowerCase(),
          password,
          role,
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
     alert(err?.response?.data?.message || err.message || "Login Failed");
  } finally {
  setLoading(false); // ✅ safe
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
                placeholder="Email"
                value={email}
               onChange={(e) => setEmail(e.target.value)}
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

          {/* {showOtp && (
            <OtpModal
              otp={otp}
              setOtp={setOtp}
              verifyOtpHandler={verifyOtpHandler}
              resendOtp={resendOtp}
              onClose={() => setShowOtp(false)}
            />
          )} */}
        </div>
      </div>
    </>
  );
}
