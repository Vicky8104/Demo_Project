// import { createContext, useState, useEffect } from "react";
// import API from "../api/axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // 🔁 Page refresh handle (session based)
//   useEffect(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//       console.log("AUTH INIT:", storedUser);
//     }
//   }, []);
// useEffect(() => {
//   if (user && user.role !== "admin") {
//     alert("Access denied");
//     navigate("/");
//   }
// }, [user]);
//   // 🔐 LOGIN
//   const login = (data) => {
//     // TEAM VALIDATION
//     if (data.role === "team" && !data.teamNumber) {
//       console.error("Team user must have teamNumber");
//       return;
//     }

//     setUser(data);

//     // ✅ sessionStorage (auto clear on browser close)
//     sessionStorage.setItem("user", JSON.stringify(data));
//   };

//   // 🚪 LOGOUT
//   const logout = async () => {
//     try {
//       // 🔥 backend cookie clear
//       await API.post("/auth/logout", {}, { withCredentials: true });
//     } catch (err) {
//       console.log("LOGOUT API ERROR:", err);
//     }

//     setUser(null);

//     // ✅ clear session
//     sessionStorage.removeItem("user");
//   };

//   // 🎯 ROLE FLAGS
//   const isCandidate = user?.role === "candidate";
//   const isAdmin = user?.role === "admin";
//   const isTeam = user?.role === "team";

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         isCandidate,
//         isAdmin,
//         isTeam,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Page refresh handle
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // console.log("AUTH INIT:", storedUser);
    }
  }, []);

  // 🔐 LOGIN
  const login = (data) => {
    if (data.role === "team" && !data.teamNumber) {
      console.error("Team user must have teamNumber");
      return;
    }

    setUser(data);

    // ✅ SAVE BOTH (IMPORTANT 🔥)
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      // console.log("LOGOUT API ERROR:", err);
    }

    setUser(null);

    // ✅ clear storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🎯 ROLE FLAGS
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