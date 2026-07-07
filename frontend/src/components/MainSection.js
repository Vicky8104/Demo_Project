// layout/MainLayout.jsx
import Header from "../components/Header";
import { useState } from "react";

import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import "./MainSection.css"

export default function MainSection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="app-container">
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />
    
        
          <main className="main-content" style={{ padding: "10px" }}>


            <Outlet /> {/* Yaha pages change honge */}
          </main>
        

        <Footer />
        {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      </div>
    </>
  );
}