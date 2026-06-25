import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminDashboard.css";
import AdminPanel from "./AdminPanel";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");

  useEffect(() => {
    if (activeTab === "reports") {
      fetchReport();
    }
  }, [activeTab]);

  const fetchReport = async () => {
    try {
      // const token = sessionStorage.getItem("token");

      // const res = await axios.get(
      //   "http://localhost:5000/api/admin/report",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      const res = await API.get("/admin/report");


      setReports(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching reports");
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* HEADER */}
      <div className="sub-header">
        <p>Welcome {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>

      {/* TOP BUTTONS */}
      <div className="top-buttons">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>

        <button
          className={activeTab === "selections" ? "active" : ""}
          onClick={() => setActiveTab("selections")}
        >
          Selections
        </button>

        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>

        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload
        </button>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <>
            <h2 className="report">Report Selection</h2>

            <div className="cards-container">
              {reports.map((item, index) => (
                <div className="card" key={index}>
                  <h3>{item.subject}</h3>
                  <p><b>Post:</b> {item.post}</p>
                  <p><b>Area:</b> {item.area}</p>
                  <p>Total Selection : {item.totalSelections}</p>

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

        {/* UPLOAD TAB */}
        {activeTab === "upload" && <AdminPanel />}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <h2 style={{ textAlign: "center" }}>Users Data (Coming Soon)</h2>
        )}

        {/* SELECTION TAB */}
        {activeTab === "selections" && (
          <h2 style={{ textAlign: "center" }}>
            Selections Data (Coming Soon)
          </h2>
        )}

      </div>
    </div>
  );
}