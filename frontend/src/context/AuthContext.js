import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Page refresh handle
  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      console.log("AUTH CONTEXT INIT USER:", storedUser);

    }
  }, []);

  // 🔐 LOGIN
  const login = (data) => {
    // 🔥 TEAM VALIDATION
    if (data.role === "team" && !data.teamNumber) {
      console.error("Team user must have teamNumber");
      return;
    }

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  // 🎯 HELPER FLAGS (BEST PRACTICE)
  const isCandidate = user?.role === "candidate";
  const isAdmin = user?.role === "admin";
  const isTeam = user?.role === "team";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isCandidate,
        isAdmin,
        isTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};