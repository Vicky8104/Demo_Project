import React, { useState, useEffect, useMemo } from "react";
import Layout from "./layout/Layout";
import Dashboard from "./Dashboard";
import API from "./config";

function App() {
  const [form, setForm] = useState({
    post: "",
    subject: "",
    rollno: "",
    mobile: "",
    email: "",
    dob: ""
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormActive, setIsFormActive] = useState(false);
  const [timeMessage, setTimeMessage] = useState("");
  

  // ✅ Date safe
  const startDate = useMemo(() => {
    return process.env.REACT_APP_FORM_START
      ? new Date(process.env.REACT_APP_FORM_START)
      : new Date("2000-01-01");
  }, []);

  const endDate = useMemo(() => {
    return process.env.REACT_APP_FORM_END
      ? new Date(process.env.REACT_APP_FORM_END)
      : new Date("2100-01-01");
  }, []);

  const subjectOptions = {
    "Teacher Level-1": ["Sanskrit", "General"],
    "Teacher Level-2": [
      "Sanskrit",
      "English",
      "Hindi",
      "Science-Maths",
      "Social Science"
    ],
    "Senior Teacher 2024": [
      "Sanskrit",
      "English",
      "Hindi",
      "Science",
      "Mathematics",
      "Maths-tsp",
      "SS"
    ]
  };

  // ✅ Time check
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

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  // ✅ Auto login (FIXED)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${API}/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            localStorage.removeItem("token");
            setUser(null);
            return null;
          }
          return res.json();
        })
       .then(data => {
  if (data) {
    setUser(data.user || data);   // 🔥 दोनों case handle करेगा
  }
})
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);


  // ✅ Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "post") {
      setForm({ ...form, post: value, subject: "" });
      return;
    }

    if (name === "rollno") {
      setForm({ ...form, rollno: value.replace(/\D/g, "").slice(0, 7) });
      return;
    }

    if (name === "mobile") {
      setForm({ ...form, mobile: value.replace(/\D/g, "").slice(0, 10) });
      return;
    }

    if (name === "dob") {
      const [year, month, day] = value.split("-");
      const formattedDOB = `${day}-${month}-${year}`;
      setForm({ ...form, dob: formattedDOB });
      return;
    }

    setForm({ ...form, [name]: value });
  };


useEffect(() => {
  if (!user) {
    setForm({
      post: "",
      subject: "",
      rollno: "",
      mobile: "",
      email: "",
      dob: ""
    });
  }
}, [user]);



  // ✅ LOGIN (FINAL FIXED)
  const handleLogin = async () => {
    // console.log("API:", API);

    if (!isFormActive) {
      setError(timeMessage);
      return;
    }

    const { post, subject, rollno, mobile, email, dob } = form;

    if (!post || !subject || !rollno || !mobile || !email || !dob) {
      setError("All fields required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      // console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }
      // console.log("LOGIN USER:", data.user);
      // ✅ SUCCESS
      localStorage.setItem("token", data.token);
      setUser(data.user);

    } catch (err) {
      // console.log(err);
      setError("Server error");
    } finally {
      setLoading(false); // 🔥 FIX
    }
  };

  // ✅ Logged in
  if (user) {
    return (
      <Layout user={user} setUser={setUser}>
        <Dashboard user={user} setUser={setUser} />
      </Layout>
    );
  }

  // ✅ UI
  return (
    <Layout>
      <div className="login-container">

        {!isFormActive ? (
          <h2 style={{ color: "red" }}>{timeMessage}</h2>
        ) : (
          <div className="login-card">

            <h2>Login</h2>
            {error && <p className="error">{error}</p>}

            <select name="post" value={form.post} onChange={handleChange}>
              <option value="">Select Post</option>
              <option value= "Senior Teacher 2024">Senior Teacher 2024</option>
              {/* <option value="Teacher Level-1">Teacher Level-1</option>
              <option value="Teacher Level-2">Teacher Level-2</option> */}
            </select>

            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.post}
            >
              <option value="">Select Subject</option>
              {form.post &&
                subjectOptions[form.post].map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
            </select>

            <input name="rollno" placeholder="Roll No" onChange={handleChange} />
            <input type="date" name="dob" onChange={handleChange} />
            <input name="mobile" placeholder="Mobile" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />

            {/* 🔥 IMPORTANT FIX */}
            <button type="button" onClick={handleLogin}>
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;
