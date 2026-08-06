import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminCandidates.css";

export default function AdminCandidates() {

  const [candidates, setCandidates] = useState([]);
  const [editCandidate, setEditCandidate] = useState(null);
  const [viewCandidate, setViewCandidate] = useState(null);

  const fetchCandidates = async () => {

    try {
      const res = await API.get("/admin/candidates");

      setCandidates(res.data);
    } catch (err) {
      console.log(err);
      alert("API Error");
    }
  };

  useEffect(() => {

    fetchCandidates();
  }, []);

  const handleView = async (id) => {
    try {
      const res = await API.get(`/admin/candidates/${id}`);
      setViewCandidate(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load details");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this candidate?")) return;

      await API.delete(`/admin/candidates/${id}`);
      fetchCandidates();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  const handleUpdate = async () => {
    await API.put(`/admin/candidates/${editCandidate._id}`, editCandidate);
    setEditCandidate(null);
    fetchCandidates();
  };

  const columns = [
    "name",
    "fatherName",
    "dob",
    "gender",
    "maritalStatus",
    "homeDistrict",
    "category",
    "ifOther",
    "email",
    "mobile",
  ];

  // ✅ restricted fields (IMPORTANT)
  const restrictedFields = ["name", "email", "mobile"];

  return (
    <div className="admin-container">
      <h2>Candidates Management</h2>

      <table border="1" cellPadding="10" className="admin-candidate-table">
        <thead>
          <tr>
            <th>S.NO.</th>
            {columns.map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c, index) => (
            <tr key={c._id}>
              <td>{index + 1}</td>

              {columns.map((col) => (
                <td key={col}>
                  {typeof c[col] === "object"
                    ? JSON.stringify(c[col])
                    : c[col]}
                </td>
              ))}

              <td>
                <button onClick={() => handleView(c._id)}>View</button>
                <button onClick={() => setEditCandidate(c)}>Update</button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ EDIT MODAL */}
      {editCandidate && (
        <div className="admin-candidate-modal">
          <div className="admin-candidate-card">
            <span className="close" onClick={() => setEditCandidate(null)}>
              ❌
            </span>

            <h3>Edit Candidate</h3>

            <div className="admin-candidate-card-content">
              {Object.keys(editCandidate)
                .filter(
                  (key) =>
                    key !== "_id" &&
                    key !== "__v" &&
                    !restrictedFields.includes(key)
                )
                .map((key) => (
                  <div className="row" key={key}>
                    <label>{key}</label>

                    <input
                      value={editCandidate[key] || ""}
                      onChange={(e) =>
                        setEditCandidate({
                          ...editCandidate,
                          [key]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
            </div>

            <div className="admin-candidate-btns">
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditCandidate(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ VIEW MODAL */}
      {viewCandidate && (
        <div className="admin-candidate-modal">
          <div className="admin-candidate-card">
            <span className="close" onClick={() => setViewCandidate(null)}>
              ❌
            </span>

            <h2 className="title">Candidate Details</h2>

            <div className="candidate-grid">
              {Object.keys(viewCandidate.candidate).map((key) => (
                <div className="grid-item" key={key}>
                  <span className="label">{key}:</span>
                  <span className="value">
                    {/* {typeof viewCandidate[key] === "object"
                      ? JSON.stringify(viewCandidate[key])
                      : viewCandidate[key]} */}
                    {viewCandidate.candidate[key]}
                  </span>
                </div>
              ))}
            </div>
            <h2 className="title">Selections</h2>
            {viewCandidate.selections.length === 0 ? (
              <p className="no-data">No selections found</p>
            ) : (
              <div className="selection-container">
                {viewCandidate.selections.map((sel) => (
                  <div
                    className={`selection-card ${sel.status === "Submitted" ? "submitted" : "pending"
                      }`}
                    key={sel._id}
                  >
                    <div className="card-header">
                      <b>{sel.post}</b> | {sel.subject}
                    </div>
                    <div className="card-body">
                    <p><b>Area:</b> {sel.area}</p>
                    <p><b>Roll No:</b> {sel.rollNo}</p>
                    <p><b>Merit:</b> {sel.meritNo}</p>
                    <p><b>Category:</b> {sel.selCategory}</p>
                    <p><b>Special:</b> {sel.splCategory || "-"}</p>
                  </div>
                  <div className="card-footer">
                     <span>Status:   {sel.status}</span>
                  </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}