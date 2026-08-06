import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Loader from "../components/Loader";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  // ✅ Fetch files safely
  const fetchFiles = async () => {
    try {
      const res = await API.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Failed to load files");
    }
  };

  // ✅ Upload with full error handling
  const handleUpload = async () => {
    if (!name || !file) {
      alert("Enter file name & select file");
      return;
    }

    // ✅ Frontend file size validation (10MB)
    if (file.size > 20 * 1024 * 1024) {
      alert("File must be less than 20MB");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      await API.post("/files/upload", formData);

      alert("✅ Uploaded successfully");

      setFile(null);
      setName("");
      fetchFiles();

    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      const msg =
        error.response?.data?.message ||
        "Upload failed. Try again";

      alert("❌ " + msg);

    } finally {
      setLoading(false); // ✅ always stop loader
    }
  };

  // ✅ Delete with error handling
  const handleDelete = async (id) => {
    try {
      await API.delete(`/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert("Delete failed");
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="admin-panel-container">
        <h2>Admin Upload Panel</h2>

        <div className="upload-box">
          <input
            type="text"
            placeholder="File Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            key={file ? file.name : ""}
          />

          <button onClick={handleUpload}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <hr />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="3">No files uploaded</td>
              </tr>
            ) : (
              files.map((f) => (
                <tr key={f._id}>
                  <td>{f.name}</td>
                  <td>
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(f._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;