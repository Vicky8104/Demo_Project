import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";

const DownloadTable = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:5000/api/files");
    setFiles(res.data);
  };

  // ✅ FINAL DOWNLOAD FUNCTION
  // const handleDownload = (file) => {
  //   const link = document.createElement("a");
  //   link.href = file.pdfUrl;
  //   link.download = file.name + ".pdf";
  //   link.click();
  // };
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