import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./LandingPage.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN =================
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
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
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

          {/* {showOtp && (
            <OtpModal
              otp={otp}
              setOtp={setOtp}
              verifyOtpHandler={verifyOtpHandler}
              resendOtp={resendOtp}
              onClose={() => setShowOtp(false)}
            />
          )} */}

>>>>>>> ebfd83f97da3eec23c147c17cdcc7e2daa721312
        </div>
      </div>
    </>
  );
}
