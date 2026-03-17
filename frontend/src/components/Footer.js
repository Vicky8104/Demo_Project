import { useEffect, useState } from "react";
import "./Footer.css";

export default function Footer() {
  const members = [
    { name: "Bharat Kumar", post: "Senior Deputy Inspector" },
    { name: "Vishnu Kumar Jangid", post: "Senior Teacher" },
    { name: "Abhishek Paliwal", post: "Senior Assistant" },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % members.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [members.length]);

  return (
    <footer className="footer">
      <div className="footer-left">
        Help line No 0141-2704357
        <p>Time :- 9:30 AM to 06:00 PM</p>
      </div>

      <div className="footer-center">
        Merit Section
        <p>Directorate Sanskrit Education, Jaipur</p>
        <p>Email:- merit.sans@gmail.com</p>
      </div>

      <div className="footer-right">
        <div className="right-content">
          <div className="created-by">Created By</div>
          <div className="slider">
            <h4>{members[index].name}</h4>
            <p>{members[index].post}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
