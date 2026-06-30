// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaDownload } from "react-icons/fa";

// const DownloadTable = () => {
//   const [groupedFiles, setGroupedFiles] = useState({});
//   const [progress, setProgress] = useState({});
//   const [downloadingId, setDownloadingId] = useState(null);
//   const [files, setFiles] = useState([]);

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const fetchFiles = async () => {
//     const res = await axios.get("http://localhost:5000/api/files");
//     setFiles(res.data);
//   };

//   const handleDownload = async (id, name) => {
//     try {
//       setDownloadingId(id);

//       const res = await axios.get(
//         `http://localhost:5000/api/files/download/${id}`,
//         {
//           responseType: "blob",
//           onDownloadProgress: (e) => {
//             const percent = Math.round((e.loaded * 100) / e.total);
//             setProgress((prev) => ({ ...prev, [id]: percent }));
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");

//       link.href = url;
//       link.setAttribute("download", `${name}.pdf`);
//       document.body.appendChild(link);
//       link.click();

//       setDownloadingId(null);
//     } catch (err) {
//       console.error(err);
//       setDownloadingId(null);
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Download Documents</h2>

//       <table border="1" width="100%" cellPadding="10">
//         <thead>
//           <tr>
//             <th>S.No</th>
//             <th>Date</th> {/* ✅ New Column */}
//             <th>Document Name</th>
//             <th>Download</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((file, index) => (
//             <tr key={file._id}>
//               <td>{index + 1}</td>

//               {/* Date */}
//               <td>
//                 {new Date(file.createdAt).toLocaleDateString("en-IN")}
//               </td>

//               <td>{file.name}</td>

//               <td style={{ textAlign: "center" }}>
//                 {downloadingId === file._id ? (
//                   <div>
//                     <div
//                       style={{
//                         width: "100%",
//                         height: "6px",
//                         background: "#ddd",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: `${progress[file._id] || 0}%`,
//                           height: "100%",
//                           background: "green",
//                         }}
//                       ></div>
//                     </div>
//                     <small>{progress[file._id] || 0}%</small>
//                   </div>
//                 ) : (
//                   <FaDownload
//                     style={{ cursor: "pointer", color: "blue" }}
//                     onClick={() =>
//                       handleDownload(file._id, file.name)
//                     }
//                   />
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>




//       </table>
//     </div>
//   );
// };

// export default DownloadTable;

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