import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { FaDownload } from "react-icons/fa";
import "./DownloadTable.css";

const DownloadTable = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = (file) => {
    window.open(file.pdfUrl, "_blank");
  };

  return (

    <div className="download-container">
      <h2>Download Documents</h2>

      {loading ? (
        <p>Loading documents...</p>
      ) : (

        <table border="1" width="100%" cellPadding="10" className="download-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Document Name</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file, index) => (
              <tr key={file._id}>
                <td className="download-cell">{index + 1}</td>

                <td className="download-cell">
                  {new Date(file.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="download-cell">{file.name}</td>

                <td style={{ textAlign: "center" }} className="download-btn">
                  <FaDownload
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => handleDownload(file)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DownloadTable;
