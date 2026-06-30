import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./Header.css";
const members = [
  {
    img: "https://i.pravatar.cc/300?img=42",
    name: "प्रियंका जोधावत",
    post: "आयुक्त",
  },
  {
    img: "https://i.pravatar.cc/300?img=2",
    name: "डाॅ. भास्कर शर्मा",
    post: "संयुक्त निदेशक",
  },
  {
    img: "https://i.pravatar.cc/300?img=4",
    name: "डाॅ. महेन्द्र कुमार शर्मा",
    post: "उपनिदेशक",
  },
];


export default function Header() {
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
          <h1 className="depName">संस्कृत-शिक्षा-विभाग-राजस्थानम्</h1>
        </div>

        {/* 🔥 NAVBAR (IMPORTANT) */}
        <div className="center-bottom">
          <Navbar />
        </div>




        {/* RIGHT */}
        <div className="right">
          <h2>पदस्थापन-परामर्श-पोर्टलम्</h2>
        </div>


      </header>
    
     

  );
}
