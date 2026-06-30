// layout/MainLayout.jsx
import Header from "../components/Header";

import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import "./MainSection.css"

export default function MainSection() {
  return (
    <>
      <div className="all-content">
        <Header />

        <main className="content" style={{ padding: "10px" }}>
      
          <Outlet /> {/* Yaha pages change honge */}
        </main>

        <Footer />
      </div>
    </>
  );
}