import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminSchools.css";

export default function AdminSchools() {
    const [schools, setSchools] = useState([]);
    const [viewSchools, setViewSchools] = useState(null);
    const [editSchools, setEditSchools] = useState(null);

    const fetchSchools = async () => {
        try {
            const res = await API.get("/admin/getSchools");
            setSchools(res.data);
        } catch (err) {
            // console.log(err);
            alert("API Error");
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete this School?")) return;
            await API.delete(`/admin/getSchools/${id}`);
            fetchSchools();
        } catch (err) {
            // console.error (err.response?.data || err.message);
            alert("Delete failed")
        }
    };

    const handleUpdate = async (id) => {
        await API.put(`/admin/getSchools/${editSchools._id}`, editSchools);
        setEditSchools(null);
        fetchSchools();
    };

    const columns = [
        "post",
        "area",
        "subject",
        "code",
        "schoolName",
    ];

    return (
        <div className="admin-container">
            <h2>School Management</h2>

            <table border="1" cellPadding="10" className="admin-selection-table">
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
                    {schools.map((s, index) => (
                        <tr key={s._id}>
                            <td>{index + 1}</td>
                            {columns.map((col) => (
                                <td key={col}>
                                    {typeof s[col] === "object"
                                        ? JSON.stringify(s[col])
                                        : s[col]}
                                </td>
                            ))}
                            <td>
                                <button onClick={() => setViewSchools(s)}>View</button>
                                <button onClick={() => setEditSchools(s)}>Update</button>
                                <button onClick={() => handleDelete(s._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editSchools && (
                <div className="admin-selection-modal">
                    <div className="admin-selection-card">
                        <span className="close" onClick={() => setEditSchools(null)}>
                            ❌
                        </span>
                        <h3>Edit School</h3>
                        <div className="admin-selection-card-content">
                            {Object.keys(editSchools)
                                .filter(
                                    (key) =>
                                        key !== "_id" &&
                                        key !== "__v"
                                )
                                .map((key) => (
                                    <div className="row" key={key}>
                                        <label>{key}</label>
                                        <input
                                            value={editSchools[key] || ""}
                                            onChange={(e) =>
                                                setEditSchools({
                                                    ...editSchools,
                                                    [key]: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                ))}
                        </div>

                        <div className="admin-selection-btns">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setEditSchools(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {viewSchools && (
                <div className="admin-selection-modal">
                    <div className="admin-selection-card">
                        <span className="close" onClick={() => setViewSchools(null)}>
                            ❌
                        </span>
                        <h3>School Details</h3>

                        <div className="admin-selection-card-content">
                            {Object.keys(viewSchools).map((key) => (
                                <div className="row" key={key}>
                                    <b>{key}:</b>
                                    <span>
                                        {typeof viewSchools[key] === "object"
                                            ? JSON.stringify(viewSchools[key])
                                            : viewSchools[key]}
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

