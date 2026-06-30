
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  // console.log("NAVBAR USER:", user);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goHome = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login"); // ✅ sirf ek navigation
  };

  const goToDownloads = () => {
    // navigate("/downloadFile");
     window.open("/downloadFile", "_blank");
  };


  return (
    <div className="navbar">
      {/* LEFT */}
      <div>
        {!user && <button className="nav-btn" onClick={goHome}>Home</button>}
        {user?.role === "candidate" && <button className="nav-btn" >Candidate Dashboard</button>}
        {user?.role === "admin" && <button className="nav-btn">Admin Dashboard</button>}
        {user?.role === "team" && <button className="nav-btn">Team Dashboard</button>}
      </div>

      {/* CENTER */}
      <div>{user && <span>Welcome - {user.name}</span>}</div>
      <div><button className="nav-btn" onClick={goToDownloads}>Download</button></div>

      {/* RIGHT */}
      <div>
        {!user ? (
          <button className="nav-btn" onClick={handleLoginClick}>
            Login
          </button>
        ) : (
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}