
// import { useLocation, useNavigate } from "react-router-dom";
// import { useContext, useState } from "react";
// import API from "../api/axios";
// import { AuthContext } from "../context/AuthContext";
// import Loader from "../components/Loader";
// import OtpModal from "../components/OtpModal";
// import "./LandingPage.css";

// export default function Login() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const queryParams = new URLSearchParams(location.search);
//   const role = queryParams.get("role");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [loading, setLoading] = useState(false);

//   // OTP STATES
//   const [showOtp, setShowOtp] = useState(false);
//   const [otp, setOtp] = useState("");

//   // STEP 1: LOGIN → SEND OTP
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     console.log(email, password, role);
//     try{
//       await API.post("/login",{ 
//         email: email.toLowerCase(), 
//         password, 
//         role 
//     });

//         // SEND OTP
//       await API.post("/send-otp", { email });

//       setShowOtp(true);

//     } catch (err) {
//       alert(err.response?.data?.message || "Login Failed");
//     }

//     setLoading(false);
//   };

//   // STEP 2: VERIFY OTP → FINAL LOGIN
//   const verifyOtpHandler = async () => {
//     setLoading(true);
//     try{
//         await API.post("/verify-otp", { email, otp });

  
//       // FINAL LOGIN CALL (same old system)
//       const loginRes = await API.post("/login", {
//         email, password, role
//       });

//       const loginData = loginRes.data;

//       sessionStorage.setItem("token", loginData.token);
//       sessionStorage.setItem("user", JSON.stringify(loginData.user));

//       login({
//         token: loginData.token,
//         role: loginData.user.role,
//         email: loginData.user.email,
//         name: loginData.user.name,
//         teamNumber: loginData.user.teamNumber
//       });

//       // ROLE ROUTING (UNCHANGED)
//       if (loginData.user.role === "candidate") navigate("/candidate");
//       else if (loginData.user.role === "admin") navigate("/admin");
//       else if (loginData.user.role === "team") navigate("/team");

//     } catch (err) {
//       alert(err.response?.data.message || "OTP Verification Failed");
//     }

//     setLoading(false);
//   };

//   // RESEND OTP
//   const resendOtp = async () => {
//     try{
//     await API.post("/send-otp", { email });

//     alert("OTP Resent!");
//   }catch(err){
//     alert("Failed to resend OTP")
//   }
// };

//   return (
//     <>
//       {loading && <Loader />}

//       <div className="login-card-container">
//         <div className="login-card">
//           <h2>Login</h2>

//           {/* LOGIN FORM */}
//           <form onSubmit={handleSubmit}>
//             <div className="form-group1">
//               <input
//                 placeholder="Email"
//                 value={email}
                
//                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
//               />
//             </div>

//             <div className="form-group1">
//               <input
//                 placeholder="Password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <div className="form-group1">
//               <button type="submit" disabled={loading}>
//                 Login
//               </button>
//             </div>
//           </form>

//           {showOtp && (
//             <OtpModal
//               otp={otp}
//               setOtp={setOtp}
//               verifyOtpHandler={verifyOtpHandler}
//               resendOtp={resendOtp}
//               onClose={() => setShowOtp(false)}
//             />
//           )}

//         </div>
//       </div>
//     </>
//   );
// }





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

const queryParams = new URLSearchParams(location.search);
const role = queryParams.get("role");

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

// OTP STATES
const [showOtp, setShowOtp] = useState(false);
const [otp, setOtp] = useState("");
const [confirmationResult, setConfirmationResult] = useState(null);

// 🔥 STEP 1: LOGIN → SEND OTP (FIREBASE)
const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

```
try {
  // 🔥 backend login (only verify credentials)
  const res = await API.post("/login", {
    email: email.toLowerCase(),
    password,
    role
  });

  const phone = res.data.phone;

  // 🔥 setup recaptcha
  if (!window.recaptchaVerifier) {
window.recaptchaVerifier = new RecaptchaVerifier(
  "recaptcha-container",
  {
    size: "invisible"
  },
  auth
);
  }

  const appVerifier = window.recaptchaVerifier;

  // 🔥 send OTP via Firebase
  const result = await signInWithPhoneNumber(auth, phone, appVerifier);

  setConfirmationResult(result);
  setShowOtp(true);

} catch (err) {
  alert(err.response?.data?.message || "Login Failed");
}

setLoading(false);
```

};

// 🔥 STEP 2: VERIFY OTP → FINAL LOGIN
const verifyOtpHandler = async () => {
setLoading(true);

```
try {
 if (!confirmationResult) {
  alert("Please request OTP first");
  return;
}

  const token = await result.user.getIdToken();

  // 🔥 final backend verification
  const loginRes = await API.post("/verify-firebase", {
    token,
    email
  });

  const user = loginRes.data.user;

  login({
    token: "cookie-based",
    role: user.role,
    email: user.email,
    name: user.name,
    teamNumber: user.teamNumber
  });

  // 🔥 routing
  if (user.role === "candidate") navigate("/candidate");
  else if (user.role === "admin") navigate("/admin");
  else if (user.role === "team") navigate("/team");

} catch (err) {
  alert("Invalid OTP ❌");
}

setLoading(false);
```

};

// 🔥 RESEND OTP (Firebase)
const resendOtp = async () => {
try {
const res = await API.post("/login", {
email,
password,
role
});

```
  const phone = res.data.phone;

  if (!window.recaptchaVerifier) {
  window.recaptchaVerifier = new RecaptchaVerifier(
    "recaptcha-container",
    { size: "invisible" },
    auth
  );
}

  const result = await signInWithPhoneNumber(auth, phone, appVerifier);

  setConfirmationResult(result);

  alert("OTP Resent!");
} catch (err) {
  alert("Failed to resend OTP");
}
```

} catch (err) {
  alert("Invalid OTP ❌");
};

return (
<>
{loading && <Loader />}

```
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

      {showOtp && (
        <OtpModal
          otp={otp}
          setOtp={setOtp}
          verifyOtpHandler={verifyOtpHandler}
          resendOtp={resendOtp}
          onClose={() => setShowOtp(false)}
        />
      )}

      {/* 🔥 REQUIRED */}
      <div id="recaptcha-container"></div>
    </div>
  </div>
</>
```

);
}
