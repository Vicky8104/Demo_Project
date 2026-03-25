
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser, setOtpSent, setOtp }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setOtp("");
    setOtpSent(false);

    navigate("/", { replace: true }); // 🔐 back block
  };


  return (
  <div className="navbar">
    <div className="nav-left">
      <span className="active-tab">
        {user ? "Dashboard" : "Home"}
      </span>
    </div>

    {user && (
      <div className="nav-right">
        <span className="welcome">Welcome {user.name}</span>
        <span className="status"> 
          {user.formSubmitted ? "Submitted" : "Pending"}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
  </div>
);
};

export default Navbar;