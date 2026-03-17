import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn, username }) => {
  return (
    <div className="navbar">
      <div className="nav-left">
        {!isLoggedIn ? (
          <span className="active-tab">Home</span>
        ) : (
          <span className="active-tab">Dashboard</span>
        )}
      </div>

      {isLoggedIn && (
        <>
          <div className="nav-center">
            <span>Form Status: Pending</span>
          </div>

          <div className="nav-right">
            <span>Welcome {username}</span>
            <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
