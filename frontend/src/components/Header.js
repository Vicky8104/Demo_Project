import { useEffect, useState } from "react";

import "./Header.css";
const members = [
  {
    img: "https://i.pravatar.cc/300?img=42",
    name: "Priyanka Jodhawar",
    post: "Commissioner",
  },
  {
    img: "https://i.pravatar.cc/300?img=2",
    name: "Dr. Jitendra Agarwal",
    post: "Joint Director",
  },
  {
    img: "https://i.pravatar.cc/300?img=4",
    name: "Dr. Mahender Kumar Sharma",
    post: "Deputy Director",
  },
];


export default function Header() {
  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username] = useState("Rahul");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % members.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      {/* LEFT */}
      <div className="left">
        <img src={members[index].img} alt="Person" />
        <div className="info">
          <h4>{members[index].name}</h4>
          <p>{members[index].post}</p>
        </div>
      </div>

      {/* CENTER TOP */}
      <div className="center-top">
        <h2 className="depName">SANSKRIT EDUCATION DEPARTMENT</h2>
      </div>

      {/* NAVBAR */}
      <div className="center-bottom">
        {!isLoggedIn ? (
          /* 🔹 Logged OUT */
          <nav className="simple-nav">
            <span className="active-tab">Home</span>
          </nav>
        ) : (
          /* 🔹 Logged IN */
          <div className="dashboard-nav">
            <span className="active-tab">Dashboard</span>

            <span className="welcome">Welcome, {username}</span>

            <span className="logout" onClick={() => setIsLoggedIn(false)}>
              Logout
            </span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="right">
        <h2>COUNSELING PORTAL</h2>
      </div>
    </header>
  );
}
