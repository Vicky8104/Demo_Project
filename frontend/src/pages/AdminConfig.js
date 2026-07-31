import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminConfig() {
    const [configs, setConfigs] = useState([]);
    const [form, setForm] = useState({
        post: "",
        area: "",
        subject: "",
        startDate: "",
        lastDate: "",
    });

    const [editId, setEditId] = useState(null);

    // ✅ FETCH ALL
    const fetchConfigs = async () => {
        try {
            const res = await API.get("/admin/counseling-config");
            setConfigs(res.data);
        } catch (err) {
            alert("Error fetching config");
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    // ✅ HANDLE CHANGE
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ ADD / UPDATE
    const handleSubmit = async () => {
        try {
            if (editId) {
                await API.post("/admin/counseling-config", {
                    ...form,
                    _id: editId
                });
                alert("Updated successfully");
            } else {
                await API.post("/admin/counseling-config", form);
                alert("Added successfully");
            }

            setForm({ post: "", area: "", subject: "", lastDate: "" });
            setEditId(null);
            fetchConfigs();
        } catch (err) {
            alert("Error saving data");
        }
    };

    // ✅ EDIT
    const handleEdit = (item) => {
        setForm({
            post:item.post,
            area:item.area,
            subject:item.subject,
            startDate:item.startDate?.slice(0,10),
            endDate:item.endDate?.slice(0,10),
        });
        setEditId(item._id);
    };

    // ✅ DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this config?")) return;

        try {
            await API.delete(`/admin/counseling-config/${id}`);
            fetchConfigs();
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Manage Counseling Config</h2>
            {/* FORM */}
            <input name="post" placeholder="Post" value={form.post} onChange={handleChange} />
            <input name="area" placeholder="Area" value={form.area} onChange={handleChange} />
            <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
            <label  >Start Date:-
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} /></label>
            <label>End Date:-
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} /></label>

            <br /><br />

            <button onClick={handleSubmit}>
                {editId ? "Update" : "Add"}
            </button>

            <hr />

            {/* LIST */}
            {configs.map((item) => (
                <div key={item._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
                    <p>{item.post} | {item.area} | {item.subject} | start:{item.startDate?.slice(0,10)} | End: {item.endDate?.slice(0,10)}</p>
                    {/* <p>Last Date: {item.lastDate?.slice(0, 10)}</p> */}

                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}