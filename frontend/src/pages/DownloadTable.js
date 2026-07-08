import React, { useEffect, useState } from "react";
import API from "./api/axios";
import { FaDownload } from "react-icons/fa";

const DownloadTable = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await API.get("/files");
    setFiles(res.data);
  };


  const handleDownload = (file) => {
    window.open(file.pdfUrl, "_blank");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Download Documents</h2>

      <table border="1" width="100%" cellPadding="10">
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
              <td>{index + 1}</td>

              <td>
                {new Date(file.createdAt).toLocaleDateString("en-IN")}
              </td>

              <td>{file.name}</td>

              <td style={{ textAlign: "center" }}>
                <FaDownload
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => handleDownload(file)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownloadTable;
