import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css"

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/candidate" },
    { name: "Download", path: "/download" },
  ];

  const handleClick = (path) => {
    navigate(path);
    setIsOpen(false); // 🔥 mobile pe auto close
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      {menu.map((item) => (
        <div
          key={item.name}
          className={`menu-item ${
            location.pathname === item.path ? "active" : ""
          }`}
          onClick={() => handleClick(item.path)}
        >
          {item.name}
        </div>
      ))}

    </div>
  );
}