import React, { useState, useEffect } from "react";
import PersonalDetails from "./PersonalDetails";
import SchoolChoices from "./SchoolChoices";
import PreviewPage from "./PreviewPage";
import "./Dashboard.css";
import API, { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, setUser }) {

  // console.log("DASHBOARD USER:", user);

  const navigate = useNavigate();

  const [cards, setCards] = useState([
    { id: 1, title: "Personal Details", unlocked: true },
    { id: 2, title: "School Choices", unlocked: false },
    { id: 3, title: "Download Form", unlocked: false },
  ]);

  // ✅ FIX: always start from personal
  const [activeForm, setActiveForm] = useState("personal");
  const [schools, setSchools] = useState([]);
  const [personalData, setPersonalData] = useState(null);
  const [schoolData, setSchoolData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  // 🔐 DIRECT ACCESS BLOCK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      navigate("/", { replace: true });
    }
  }, [navigate, setUser]);

  // 🔐 FORM SUBMITTED LOCK (SAFE CHECK)
  useEffect(() => {
    if (user && user.formSubmitted === true) {   // ✅ FIX HERE

      setCards([
        { id: 1, title: "Personal Details", unlocked: false },
        { id: 2, title: "School Choices", unlocked: false },
        { id: 3, title: "Download Form", unlocked: true },
      ]);

      setPdfUrl(
        user.pdfUrl?.startsWith("http")
          ? user.pdfUrl
          : `${BASE_URL}${user.pdfUrl}`
      );

      setActiveForm(null); // only when truly submitted
    } else {
      // ✅ FIX: ensure form opens after login
      setActiveForm("personal");
    }
  }, [user]);

  // 🔐 FETCH SCHOOLS
  useEffect(() => {
    if (!user?.post || !user?.subject) return;

    const fetchSchools = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        navigate("/", { replace: true });
        return;
      }

      try {
        const res = await fetch(
          `${API}/schools?post=${user.post}&subject=${user.subject}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/", { replace: true });
          return;
        }

        const data = await res.json();
        setSchools(data.schools || []);
      } catch (err) {
        // console.error(err);
      }
    };

    fetchSchools();
  }, [user, navigate, setUser]);

  const handleCardClick = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card.unlocked) return;

    if (cardId === 1) setActiveForm("personal");
    if (cardId === 2) setActiveForm("school");

    // if (cardId === 3) {
    //   if (pdfUrl) window.open(pdfUrl, "_blank");
    //   else alert("Form not submitted yet");
    // }
    if (cardId === 3) {
  if (pdfUrl) {
    window.open(pdfUrl, "_blank");
  } else {
    alert("PDF is not ready yet, please wait a moment.");
  }
}
  };

  // 🔐 FINAL SUBMIT
  const handleFinalSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      navigate("/", { replace: true });
      return;
    }

    if (user?.formSubmitted === true) {  // ✅ FIX
      alert("Form already submitted");
      return;
    }

    const schoolNames = schoolData.map(code => {
      const school = schools.find(s => s.code === code);
      return school ? school.name : code;
    });

    try {
      const res = await fetch(`${API}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          personalData,
          schoolData,
          schoolNames
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();

      // ✅ USER UPDATE
      setUser(prev => ({
        ...prev,
        formSubmitted: true,
        pdfUrl: data.pdfUrl
      }));

      // setPdfUrl(
      //   data.pdfUrl?.startsWith("http")
      //     ? data.pdfUrl
      //     : `${BASE_URL}${data.pdfUrl}`
      // );
      setPdfUrl(
  data.pdfUrl
    ? data.pdfUrl.startsWith("http")
      ? data.pdfUrl
      : `${BASE_URL}${data.pdfUrl}`
    : "" // agar pdfUrl undefined hai to empty string
);

      setCards([
        { id: 1, title: "Personal Details", unlocked: false },
        { id: 2, title: "School Choices", unlocked: false },
        { id: 3, title: "Download Form", unlocked: true },
      ]);

      setActiveForm(null);

      alert("Form Submitted Successfully");

    } catch (err) {
      // console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  // 🔥 SAFETY
  if (!user?.post || !user?.subject) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="dashboard-container">

      <h1>
        {user.post} {user.subject} Counseling Portal
      </h1>

      <h2>Welcome, {user.name}</h2>

      <div className="dashboard-cards">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`dashboard-card ${card.unlocked ? "unlocked" : "locked"}`}
          >
            {card.title}
          </div>
        ))}
      </div>

      {user?.formSubmitted === true && (
        <div style={{ margin: "20px auto", textAlign: "center", maxWidth: "150px" }}>
          <h3>✅ Form Submitted</h3>
          <button onClick={() =>   
          window.open(pdfUrl, "_blank")}>
            Download PDF
          </button>
        </div>
      )}

      {!user?.formSubmitted && activeForm === "personal" && (
        <PersonalDetails
          user={user}
          onSubmit={(formData) => {
            setPersonalData(formData);
            setCards(cards.map(c =>
              c.id === 2 ? { ...c, unlocked: true } : c
            ));
            setActiveForm("school");
          }}
        />
      )}

      {!user?.formSubmitted && activeForm === "school" && (
        <SchoolChoices
          user={user}
          schools={schools}
          selectedSchools={schoolData}
          onSubmit={(selectedSchools) => {
            setSchoolData(selectedSchools);
            setActiveForm("preview");
          }}
        />
      )}

      {!user?.formSubmitted && activeForm === "preview" && (
        <PreviewPage
          user={user}
          personalData={personalData}
          schoolData={schoolData}
          schools={schools}
          onEdit={() => setActiveForm("personal")}
          onFinalSubmit={handleFinalSubmit}
        />
      )}

    </div>
  );
}
