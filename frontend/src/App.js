
import React, { useState, useEffect } from "react"; 
// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
import Layout from "./layout/Layout";
import Dashboard from "./Dashboard";
import API from "./config";
import { useMemo } from "react";

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
  const [isFormActive, setIsFormActive] = useState(false);
  const [timeMessage, setTimeMessage] = useState("");

  // ✅ Start & End Date
  // const startDate = new Date(process.env.REACT_APP_FORM_START);
  // const endDate = new Date(process.env.REACT_APP_FORM_END);
  const startDate = useMemo(
  () => new Date(process.env.REACT_APP_FORM_START),
  []
  );
  const endDate = useMemo(
  () => new Date(process.env.REACT_APP_FORM_END),
  []
  );

  // ✅ Check form timing
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();

      if (now < startDate) {
        setIsFormActive(false);
        setTimeMessage("Form अभी शुरू नहीं हुआ है ⏳");
      } else if (now > endDate) {
        setIsFormActive(false);
        setTimeMessage("Form बंद हो चुका है ❌");
      } else {
        setIsFormActive(true);
        setTimeMessage("");
      }
    };

    checkTime(); // page load
    const interval = setInterval(checkTime, 1000); // realtime update

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  // ✅ Check token & auto login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${API}user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            setUser(null);
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (data?.user) setUser(data.user);
          else setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ✅ Reset form when user logs out
  useEffect(() => {
    if (!user) {
      setForm({ post: "", subject: "", rollno: "", email: "" });
      setOtp("");
      setOtpSent(false);
      setError("");
    }
  }, [user]);

  const subjectOptions = {
    "Teacher Level-1": ["Sanskrit", "General"],
    "Teacher Level-2": ["Sanskrit", "Hindi", "English", "Science-Maths", "Social Science"],
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rollno") {
      setForm({ ...form, rollno: value.replace(/\D/g, "").slice(0, 6) });
      return;
    }
    if (name === "email") {
      setForm({ ...form, email: value.toLowerCase().trim() });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  // ✅ SEND OTP with timing check
  const sendOtp = async () => {
    if (!isFormActive) {
      setError(timeMessage || "Form is not active");
      return;
    }

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
      const res = await fetch(`${API}/send-otp`, {
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
      const res = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: form.post,
          subject: form.subject,
          rollno: form.rollno,
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

  if (loading) return <h2 style={{ textAlign: "center" }}>{loading ? "Processing..." : ""}</h2>;

  if (user && localStorage.getItem("token"))
    return (
      <Layout user={user} setUser={setUser} setOtpSent={setOtpSent} setOtp={setOtp}>
        <Dashboard user={user} setUser={setUser} setOtpSent={setOtpSent} setOtp={setOtp} />
      </Layout>
    );

  return (
    <Layout>
      <div className="login-card" style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
        {/* ✅ FORM TIMING MESSAGE */}
        {!isFormActive ? (
          <h2 style={{ color: "red" }}>{timeMessage}</h2>
        ) : !otpSent ? (
          <>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <select name="post" value={form.post} onChange={handleChange}>
              <option value="">Select Post</option>
              <option value="Teacher Level-1">Teacher Level-1</option>
              <option value="Teacher Level-2">Teacher Level-2</option>
            </select>
            <br /><br />

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.post}
            >
              <option value="">Select Subject</option>
              {form.post && subjectOptions[form.post].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <br /><br />

            <input
              name="rollno"
              placeholder="Roll No (6 digits)"
              value={form.rollno}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
            />
            <br /><br />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              type="email"
              autoComplete="off"
            />
            <br /><br />

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
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="OTP"
              autoComplete="off"
            />
            <br /><br />

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