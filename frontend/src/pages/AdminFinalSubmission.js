import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminFinalSubmission.css";


export default function AdminFinalSubmission() {
    const [finalSubmission, setFinalSubmission] = useState([]);
    const [viewFinalSubmission, setViewFinalSubmission] = useState(null);

    const fetchFinalSubmission = async () => {
        try {
            const res = await API.get("/admin/getFinalSubmission");
            setFinalSubmission(res.data);
        } catch (err) {
            console.log(err);
            alert("API Error");
        }
    };

    useEffect(() => {
        fetchFinalSubmission();
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete this Selection?")) return;
            await API.delete(`/admin/getFinalSubmission/${id}`);
            fetchFinalSubmission();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Delete failed")
        }
    };

    const columns = [
        "name",
        "fatherName",
        "post",
        "area",
        "subject",
        "rollNo",
        "meritNo",
        "status",
        "mobile",
    ];

    return (
        <div className="admin-container">
            <h2>Final Submission Management</h2>
            <table border="1" cellPadding="10" className="admin-finalSubmission-table">
                <thead>
                    <tr>
                        <th>S.No.</th>
                        {columns.map((col) => (
                            <th key={col}>{col.toUpperCase()}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {finalSubmission.map((f, index) => (
                        <tr key={f._id}>
                            <td>{index + 1}</td>
                            {columns.map((col) => (
                                <td key={col}>
                                    {typeof f[col] === "object"
                                        ? JSON.stringify(f[col])
                                        : f[col]}
                                </td>
                            ))}
                            <td>
                                <button onClick={() => setViewFinalSubmission(f)}>View</button>
                                <button onClick={() => handleDelete(f._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {viewFinalSubmission && (
                <div className="admin-finalSubmission-modal">
                    <div className="admin-finalSubmission-card">
                        <span className="close" onClick={() => setViewFinalSubmission(null)}>
                            ❌
                        </span>
                        <h3>Final Submission Details</h3>
                        <div className="admin-finalSubmission-card-content">
                            {/* {Object.keys(viewFinalSubmission).map((key)=>(
                                <div className="row" key={key}>
                                    <b>{key}:</b>
                                    <span>
                                        {typeof viewFinalSubmission[key]==="object"
                                            ? JSON.stringify(viewFinalSubmission[key])
                                                :viewFinalSubmission[key]}
                                    </span>
                                </div>
                            ))} */}
                            {Object.keys(viewFinalSubmission).map((key) => (
                                <div className="row" key={key}>
                                    <b>{key}:</b>
                                    <span>
                                        {key === "choices" && Array.isArray(viewFinalSubmission[key])
                                            ? viewFinalSubmission[key].map((choice, i) => (
                                                <div key={i}>
                                                    <b>Choice {i + 1}:</b> {choice.school || choice}
                                                </div>
                                            ))
                                            : key === "pdfUrl" && viewFinalSubmission[key]
                                                ? (
                                                    <a
                                                        href={viewFinalSubmission[key]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View PDF
                                                    </a>
                                                )
                                                : typeof viewFinalSubmission[key] === "object"
                                                    ? JSON.stringify(viewFinalSubmission[key])
                                                    : viewFinalSubmission[key]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}