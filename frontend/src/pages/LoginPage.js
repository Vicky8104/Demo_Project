
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import OtpModal from "../components/OtpModal";
import "./LandingPage.css";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  // OTP STATES
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");

  // STEP 1: LOGIN → SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(email, password, role);
    try {
     const res = await API.post("/login", {
        email: email.toLowerCase(),
        password,
        role
      });

      const loginData = await res.data;

      // SEND OTP
      // await API.post("/send-otp", { email });

      // setShowOtp(true);

      login({
        token: loginData.token,
        role: loginData.user.role,
        email: loginData.user.email,
        name: loginData.user.name,
        teamNumber: loginData.user.teamNumber
      });


          // ROLE ROUTING (UNCHANGED)
          if (loginData.user.role === "candidate") navigate("/candidate");
          else if (loginData.user.role === "admin") navigate("/admin");
          else if (loginData.user.role === "team") navigate("/team");

        } catch (err) {
          alert(err.response?.data.message);
        }

        setLoading(false);
      };


  //   } catch (err) {
  //     alert(err.response?.data?.message || "Login Failed");
  //   }

  //   setLoading(false);
  // };

  // STEP 2: VERIFY OTP → FINAL LOGIN
  // const verifyOtpHandler = async () => {
  //   setLoading(true);
  //   try{
  //       await API.post("/verify-otp", { email, otp });


  //     // FINAL LOGIN CALL (same old system)
  //     const loginRes = await API.post("/login", {
  //       email, password, role
  //     });

  //     const loginData = loginRes.data;

  //     sessionStorage.setItem("token", loginData.token);
  //     sessionStorage.setItem("user", JSON.stringify(loginData.user));

  //     login({
  //       token: loginData.token,
  //       role: loginData.user.role,
  //       email: loginData.user.email,
  //       name: loginData.user.name,
  //       teamNumber: loginData.user.teamNumber
  //     });

  //     // ROLE ROUTING (UNCHANGED)
  //     if (loginData.user.role === "candidate") navigate("/candidate");
  //     else if (loginData.user.role === "admin") navigate("/admin");
  //     else if (loginData.user.role === "team") navigate("/team");

  //   } catch (err) {
  //     alert(err.response?.data.message || "OTP Verification Failed");
  //   }

  //   setLoading(false);
  // };

  // RESEND OTP
  //   const resendOtp = async () => {
  //     try{
  //     await API.post("/send-otp", { email });

  //     alert("OTP Resent!");
  //   }catch(err){
  //     alert("Failed to resend OTP")
  //   }
  // };

  return (
    <>
      {loading && <Loader />}

      <div className="login-card-container">
        <div className="login-card">
          <h2>Login</h2>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <input
                placeholder="Email"
                value={email}

                onChange={(e) => setEmail(e.target.value.toLowerCase())}
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