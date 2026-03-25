import React, { useState, useEffect } from "react";
import PersonalDetails from "./PersonalDetails";
import SchoolChoices from "./SchoolChoices";
import PreviewPage from "./PreviewPage";
import "./Dashboard.css";
import API, { BASE_URL } from "./config";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, setUser, setOtpSent, setOtp }) {

  // const [formStatus, setFormStatus] = useState(null);
  const navigate = useNavigate();

  const [cards, setCards] = useState([
    { id: 1, title: "Personal Details", unlocked: true },
    { id: 2, title: "School Choices", unlocked: false },
    { id: 3, title: "Download Form", unlocked: false },
  ]);

  const [activeForm, setActiveForm] = useState("personal");
  const [schools, setSchools] = useState([]);
  const [personalData, setPersonalData] = useState(null);
  const [schoolData, setSchoolData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [userState, setUserState] = useState(user);

  useEffect(() => {
//   const fetchFormStatus = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/form-status`);
//       const data = await res.json();
//       setFormStatus(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchFormStatus();
//  }, [setFormStatus]);

//   useEffect(() => {
  setUserState(user);
  }, [user]);

  // 🔐 DIRECT ACCESS BLOCK (VERY IMPORTANT)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      navigate("/", { replace: true });
    }
  }, [navigate, setUser]);

  // 🔐 FORM SUBMITTED LOCK
  useEffect(() => {
    if (userState?.formSubmitted) {
      setCards([
        { id: 1, title: "Personal Details", unlocked: false },
        { id: 2, title: "School Choices", unlocked: false },
        { id: 3, title: "Download Form", unlocked: true },
      ]);

      // setPdfUrl(`http://localhost:5000${userState.pdfUrl}`);
      setPdfUrl(
      userState.pdfUrl?.startsWith("http")
        ? userState.pdfUrl
        : `${BASE_URL}${userState.pdfUrl}`
      );
      setActiveForm(null);
    }
  }, [userState]);

  // 🔐 FETCH SCHOOLS (SECURE)
  useEffect(() => {
    if(!user) return;
    const fetchSchools = async () => {
      

      const token = localStorage.getItem("token");

      // 🔥 SECURITY CHECK
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
          // setUserState(null);
          navigate("/", { replace: true });
          return;
          }
        const data = await res.json();
        setSchools(data.schools || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSchools();
  }, [user, navigate, setUser]);

  const handleCardClick = (cardId) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card.unlocked) return;

    if (cardId === 1) setActiveForm("personal");
    if (cardId === 2) setActiveForm("school");

    if (cardId === 3) {
      if (pdfUrl) window.open(pdfUrl, "_blank");
      else alert("Form not submitted yet");
    }
  };

  // 🔐 FINAL SUBMIT (SECURE)
  const handleFinalSubmit = async () => {

    const token = localStorage.getItem("token");

    // 🔥 SECURITY CHECK
    if (!token) {
      setUser(null);
      navigate("/", { replace: true });
      return;
    }

    if (userState.formSubmitted) {
      alert("Form already submitted");
      return;
    }

    const schoolNames = schoolData.map(code => {
      const school = schools.find(s => s.code === code);
      return school ? school.name : code;
    });
 
    try {
      const res = await fetch(`${API}/submit-form`, {
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
        if (res.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          // setUserState(null);
          navigate("/", { replace: true });
          return;
        }
      const data = await res.json();

      setUserState({
        ...userState,
        formSubmitted: true,
        pdfUrl: data.pdfUrl
      });
      setUser((prev) => ({
      ...prev,
      formSubmitted: true,
      }));

      // setPdfUrl(`http://localhost:5000${data.pdfUrl}`);
    setPdfUrl(
    data.pdfUrl.startsWith("http")
    ? data.pdfUrl
    : `${BASE_URL}${data.pdfUrl}`
    );

      setCards([
        { id: 1, title: "Personal Details", unlocked: false },
        { id: 2, title: "School Choices", unlocked: false },
        { id: 3, title: "Download Form", unlocked: true },
      ]);

      setActiveForm(null);

      alert("Form Submitted Successfully");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="dashboard-container">

      {user && (
      <>
      <h1>
      {user.post} {user.subject} Counseling Portal
      </h1>

        <h2>Welcome, {user.name}</h2>
      </>
      )}

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

      {userState?.formSubmitted && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>✅ Form Submitted</h3>
          <button style={{maxWidth:"150px"}} onClick={() => window.open(pdfUrl, "_blank")}>
            Download PDF
          </button>
        </div>
      )}

      {!userState?.formSubmitted && activeForm === "personal" && (
        <PersonalDetails
          user={user}
          onSubmit={(formData) => {
            setPersonalData(formData);
            setCards(
              cards.map((c) =>
                c.id === 2 ? { ...c, unlocked: true } : c
              )
            );
            setActiveForm("school");
          }}
        />
      )}

      {!userState?.formSubmitted && activeForm === "school" && (
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

      {!userState?.formSubmitted && activeForm === "preview" && (
        <PreviewPage
          user={userState}
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