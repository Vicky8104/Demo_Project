import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AdminUsers.css";

export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);

    const fetchUsers = async () => {
        const res = await API.get("/admin/users");
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            if (!window.confirm("Delete this user?")) return;

            await API.delete(`/admin/users/${id}`);

            fetchUsers(); // refresh
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Delete failed");
        }
    };

    const handleUpdate = async () => {
        await API.put(`/admin/users/${editUser._id}`, editUser);
        setEditUser(null);
        fetchUsers();
    };

    const columns = 
        users.length > 0
            ? Object.keys(users[0]).filter((key) => key !== "_v")
        .slice(0, 6) : [];


    return (
        <div className="admin-container">
            <h2>Users Management</h2>
            <table border="1" cellpadding="10" className="admin-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col.toUpperCase()}</th>
                        ))}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            {columns.map((col) => (
                                <td key={col}>
                                    {typeof u[col] === "object"
                                        ? JSON.stringify(u[col])
                                        : u[col]}
                                </td>
                            ))}
                            <td>
                                <button onClick={() => setViewUser(u)}>View</button>
                                <button onClick={() => setEditUser(u)}>Update</button>
                                <button onClick={() => handleDelete(u._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editUser && (
                <div className="admin-user-modal">
                    <div className="admin-user-card">

                        {/* ❌ Close */}
                        <span className="close" onClick={() => setEditUser(null)}>×</span>

                        <h3>Edit User</h3>

                        <div className="admin-user-card-content">
                            {Object.keys(editUser)
                                .filter((key) => key !== "_id" && key !== "__v")
                                .map((key) => (
                                    <div className="row" key={key}>
                                        <label>{key}</label>
                                        {key === "password" ?(
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, password: e.target.value})
                                                }
                                                />
                                
                                        ):(
                                            <input 
                                                value={editUser[key] || ""}
                                                onChange={(e) =>
                                                    setEditUser({ ...editUser, [key]: e.target.value})
                                                }
                                                />
                                        )}
                                        {/* <input
                                            value={editUser[key] || ""}
                                            onChange={(e) =>
                                                setEditUser({ ...editUser, [key]: e.target.value })
                                            }
                                        /> */}
                                    </div>
                                ))}
                        </div>

                        <div className="admin-user-btns">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setEditUser(null)}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}

            {viewUser && (
                <div className="admin-user-modal">
                    <div className="admin-user-card">

                        {/* ❌ Close Button */}
                        <span className="close" onClick={() => setViewUser(null)}>×</span>

                        <h3>User Details</h3>

                        <div className="admin-user-card-content">
                            {Object.keys(viewUser).map((key) => (
                                <div className="row" key={key}>
                                    <b>{key}:</b>
                                    <span>
                                        {typeof viewUser[key] === "object"
                                            ? JSON.stringify(viewUser[key])
                                            : viewUser[key]}
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