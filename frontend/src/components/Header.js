
import { useEffect, useState } from "react";
import Navbar from "./Navbar"; // 🔥 ADD THIS
import "./Header.css";

const members = [
  {
    img: "https://i.pravatar.cc/300?img=42",
    name: "Priyanka Jodhawat",
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

export default function Header({ user, setUser, setOtpSent, setOtp }) {
  const [index, setIndex] = useState(0);

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

      {/* 🔥 NAVBAR (IMPORTANT) */}
      <div className="center-bottom">
        <Navbar
          user={user}
          setUser={setUser}
          setOtpSent={setOtpSent}
          setOtp={setOtp}
        />
      </div>

      {/* RIGHT */}
      <div className="right">
        <h2>COUNSELING PORTAL</h2>
      </div>
    </header>
  );
}