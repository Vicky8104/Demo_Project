// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useContext, useEffect, useState } from "react";
// import API from "../api/axios";
// import "./AdminDashboard.css";
// import AdminPanel from "./AdminPanel";
// import AdminUsers from "./AdminUsers";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const [reports, setReports] = useState([]);
//   const [activeTab, setActiveTab] = useState("reports");

//   // useEffect(() => {
//   //   if (activeTab === "reports") {
//   //     fetchReport();
//   //   }
//   // }, [activeTab]);
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     // console.log("INIT TOKEN:", token); // 🔥

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     if (activeTab === "reports") {
//       const fetchReport = async () => {
//         try {
//           const token = localStorage.getItem("token");


//           if (!token) {
//             navigate("/login");
//             return;
//           }

//           // console.log("ADMIN TOKEN:", token); // 🔥
//           // console.log("USER:", user); // 
//           const res = await API.get("/admin/report");
//           // console.log("REPORT RESPONSE:", res.data); // 
//           setReports(res.data);
//         } catch (err) {
//           console.error("ADMIN ERROR:", err.response?.data || err.message);
//           console.error(err);
//           alert("Error fetching reports");
//         }
//       };
//       fetchReport();
//     }
//   }, [activeTab, navigate]);


//   return (
//     <div className="dashboard-container">

//       {/* HEADER */}
//       <div className="user-info">
//           <div className="sub-header">
//         <p>Welcome {user?.name}</p>
//         <p>Email: {user?.email}</p>
//         </div>
//       </div>

//       {/* TOP BUTTONS */}
//       <div className="top-buttons">
//         <button
//           className={activeTab === "users" ? "active" : ""}
//           onClick={() => setActiveTab("users")}
//         >
//           Users
//         </button>

//         <button
//           className={activeTab === "selections" ? "active" : ""}
//           onClick={() => setActiveTab("selections")}
//         >
//           Selections
//         </button>

//         <button
//           className={activeTab === "reports" ? "active" : ""}
//           onClick={() => setActiveTab("reports")}
//         >
//           Reports
//         </button>

//         <button
//           className={activeTab === "upload" ? "active" : ""}
//           onClick={() => setActiveTab("upload")}
//         >
//           Upload
//         </button>
//       </div>

//       {/* CONTENT */}
//       <div className="content">

//         {/* REPORTS TAB */}
//         {activeTab === "reports" && (
//           <>
//             <h2 className="report">Report Selection</h2>

//             <div className="cards-container">
//               {reports.map((item, index) => (
//                 <div className="card" key={index}>
//                   <h3>{item.subject}</h3>
//                   <p><b>Post:</b> {item.post}</p>
//                   <p><b>Area:</b> {item.area}</p>
//                   <p>Total Selection : {item.totalSelections}</p>

//                   <p style={{ color: "green" }}>
//                     Submitted: {item.submitted}
//                   </p>

//                   <p style={{ color: "red" }}>
//                     Pending: {item.pending}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* UPLOAD TAB */}
       
//         {activeTab === "upload" && <AdminPanel />}
        

//         {/* USERS TAB */}
//         {/* {activeTab === "users" && (
//           <h2 style={{ textAlign: "center" }}>Users Data (Coming Soon)</h2>
//         )} */}
//         {activeTab === "users" && <AdminUsers />}

//         {/* SELECTION TAB */}
//         {activeTab === "selections" && (
//           <h2 style={{ textAlign: "center" }}>
//             Selections Data (Coming Soon)
//           </h2>
//         )}

//       </div>
//     </div>
//   );
// }

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminDashboard.css";
import AdminConfig from "./AdminConfig";
import AdminPanel from "./AdminPanel";
import AdminUsers from "./AdminUsers";
import Loader from "../components/Loader";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const [loading, setLoading] = useState(false);

  // ✅ ROLE CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!user) return;

    if (user.role !== "admin") {
      alert("Unauthorized");
      navigate("/");
    }
  }, [user]);

  // ✅ FETCH REPORT
  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/report");
      setReports(res.data);
    } catch (err) {
      alert("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReport();
    }
  }, [activeTab]);

  return (
    <div className="dashboard-container">
      {loading && <Loader />}

      {/* HEADER */}
      <div className="sub-header">
        <p>Welcome {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>

      {/* BUTTONS */}
      <div className="top-buttons">
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("selections")}>
          Selections
        </button>
        <button onClick={() => setActiveTab("reports")}>
          Reports
        </button>
        <button onClick={() => setActiveTab("upload")}>
          Upload
        </button>
        <button onClick={() => setActiveTab("config")}>Config</button>
      </div>

      {/* CONTENT */}
      <div className="content">
        {/* REPORTS */}
        {activeTab === "reports" && (
          <>
            <h2>Report Selection</h2>

            <div className="cards-container">
              {reports.map((item, index) => (
                <div className="card" key={index}>
                  <h3>{item.subject}</h3>
                  <p>Post: {item.post}</p>
                  <p>Area: {item.area}</p>
                  <p>Total: {item.totalSelections}</p>
                  <p style={{ color: "green" }}>
                    Submitted: {item.submitted}
                  </p>
                  <p style={{ color: "red" }}>
                    Pending: {item.pending}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && <AdminUsers />}

        {/* UPLOAD */}
        {activeTab === "upload" && <AdminPanel />}

         {activeTab === "config" && <AdminConfig />}

        {/* SELECTION */}
        {activeTab === "selections" && (
          <h2 style={{ textAlign: "center" }}>
            Selections Coming Soon
          </h2>
        )}
       
      </div>
    </div>
  );
}