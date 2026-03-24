// import "./Navbar.css";

// const Navbar = ({ isLoggedIn, setIsLoggedIn, username }) => {
//   return (
//     <div className="navbar">
//       <div className="nav-left">
//         {!isLoggedIn ? (
//           <span className="active-tab">Home</span>
//         ) : (
//           <span className="active-tab">Dashboard</span>
//         )}
//       </div>

//       {isLoggedIn && (
//         <>
//           <div className="nav-center">
//             <span>Form Status: Pending</span>
//           </div>

//           <div className="nav-right">
//             <span>Welcome {username}</span>
//             <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
//               Logout
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Navbar;

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