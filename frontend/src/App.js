import React, { useState } from "react";
import Layout from "./layout/Layout";
import Dashboard from "./Dashboard";

function App() {
  const [form, setForm] = useState({
    post: "",
    subject: "",
    rollno: "",
    email: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subjectOptions = {
    "Teacher Level-1": ["Sanskrit", "General"],
    "Teacher Level-2": [
      "Sanskrit",
      "Hindi",
      "English",
      "Science-Maths",
      "Social Science",
    ],
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rollno") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      setForm({ ...form, rollno: digitsOnly });
      return;
    }

    if (name === "email") {
      setForm({ ...form, email: value.toLowerCase() });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const sendOtp = async () => {
    if (!form.post || !form.subject || !form.rollno || !form.email) {
      setError("Please fill all fields");
      return;
    }

    if (form.rollno.length !== 6) {
      setError("Roll No must be exactly 6 digits");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 200) setOtpSent(true);
      else setError(data.message);
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: form.post,
          subject: form.subject,
          email: form.email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setUser(data.user);
        localStorage.setItem("token", data.token);
      } else setError(data.message);
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  if (user)
    return (
      <Layout>
        <Dashboard user={user} />
      </Layout>
    );

  return (
    <Layout>
      <div
        className="login-card"
        style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}
      >
        {!otpSent ? (
          <>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <select name="post" value={form.post} onChange={handleChange}>
              <option value="">Select Post</option>
              <option value="Teacher Level-1">Teacher Level-1</option>
              <option value="Teacher Level-2">Teacher Level-2</option>
            </select>
            <br />
            <br />

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.post}
            >
              <option value="">Select Subject</option>
              {form.post &&
                subjectOptions[form.post].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
            <br />
            <br />

            <input
              name="rollno"
              placeholder="Roll No (6 digits)"
              value={form.rollno}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={6}
            />
            <br />
            <br />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              type="email"
            />
            <br />
            <br />

            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <h2>Enter OTP</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
            />
            <br />
            <br />

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;

// import React, { useState } from "react";
// import Layout from "./layout/Layout";
// import Dashboard from "./Dashboard";

// function App() {

//   // 🔹 TEST USER (development testing)
//   const testUser = {
//     name: "Test User",
//     email: "vkumarjangid7543@gmail.com",
//     rollno: "101234",
//     post: "Teacher Level-1",
//     subject: "Sanskrit"
//   };

//   // 🔹 login bypass flag
//   const bypassLogin = true;

//   const [form, setForm] = useState({
//     post: "",
//     subject: "",
//     rollno: "",
//     email: "",
//   });

//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const subjectOptions = {
//     "Teacher Level-1": ["Sanskrit", "General"],
//     "Teacher Level-2": [
//       "Sanskrit",
//       "Hindi",
//       "English",
//       "Science-Maths",
//       "Social Science",
//     ],
//   };

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "rollno") {
//       const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
//       setForm({ ...form, rollno: digitsOnly });
//       return;
//     }

//     if (name === "email") {
//       setForm({ ...form, email: value.toLowerCase() });
//       return;
//     }

//     setForm({ ...form, [name]: value });
//   };

//   const sendOtp = async () => {
//     if (!form.post || !form.subject || !form.rollno || !form.email) {
//       setError("Please fill all fields");
//       return;
//     }

//     if (form.rollno.length !== 6) {
//       setError("Roll No must be exactly 6 digits");
//       return;
//     }

//     if (!emailRegex.test(form.email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.status === 200) setOtpSent(true);
//       else setError(data.message);
//     } catch {
//       setError("Server error");
//     }

//     setLoading(false);
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           post: form.post,
//           subject: form.subject,
//           email: form.email,
//           otp,
//         }),
//       });

//       const data = await res.json();

//       if (res.status === 200) {
//         setUser(data.user);
//         localStorage.setItem("token", data.token);
//       } else setError(data.message);
//     } catch {
//       setError("Server error");
//     }

//     setLoading(false);
//   };


//   // 🔹 bypass login for testing
//   if (bypassLogin)
//     return (
//       <Layout>
//         <Dashboard user={testUser} />
//       </Layout>
//     );


//   // 🔹 normal login flow
//   if (user)
//     return (
//       <Layout>
//         <Dashboard user={user} />
//       </Layout>
//     );

//   return (
//     <Layout>
//       <div
//         className="login-card"
//         style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}
//       >
//         {!otpSent ? (
//           <>
//             <h2>Login</h2>
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <select name="post" value={form.post} onChange={handleChange}>
//               <option value="">Select Post</option>
//               <option value="Teacher Level-1">Teacher Level-1</option>
//               <option value="Teacher Level-2">Teacher Level-2</option>
//             </select>
//             <br /><br />

//             <select
//               name="subject"
//               value={form.subject}
//               onChange={handleChange}
//               disabled={!form.post}
//             >
//               <option value="">Select Subject</option>

//               {form.post &&
//                 subjectOptions[form.post].map((sub) => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//             </select>

//             <br /><br />

//             <input
//               name="rollno"
//               placeholder="Roll No (6 digits)"
//               value={form.rollno}
//               onChange={handleChange}
//               inputMode="numeric"
//               maxLength={6}
//             />

//             <br /><br />

//             <input
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               type="email"
//             />

//             <br /><br />

//             <button onClick={sendOtp} disabled={loading}>
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </>
//         ) : (
//           <>
//             <h2>Enter OTP</h2>
//             {error && <p style={{ color: "red" }}>{error}</p>}

//             <input
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="OTP"
//             />

//             <br /><br />

//             <button onClick={verifyOtp} disabled={loading}>
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// }

// export default App;