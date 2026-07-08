
import { replace, useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./DownloadPage.css";

export default function DownloadPage() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    alert("Session expired. Please login again.");
    navigate("/candidate");
    return null;
  }

  const { submitted, isClosed, selectionData, pdfUrl } = location.state || {};

  const handleDownload = () => {
    if (!pdfUrl) {
      alert("PDF not available");
      return;
    }

    // ✅ SAME AS TABLE
    window.open(pdfUrl, "_blank");
  };


  return (

    <div className="download-data">
      {selectionData && (
        <div className="selection-info-card">
          <p><strong>Post:</strong> {selectionData.post}</p>
          <p><strong>Area:</strong> {selectionData.area}</p>
          <p><strong>Subject:</strong> {selectionData.subject}</p>
        </div>
      )}
      <h2>Download Your PDF</h2>

      {submitted && (
        <p style={{ color: "green" }}>
          ✅ Form submitted successfully. You can download your PDF.
        </p>
      )}
      <div className="download-btn-div" >
        <div >
          <button className="download-btn" onClick={() => navigate("/candidate", { replace: true })}>
            Back
          </button>
        </div>
        <div >
          {/* 🔥 CASE 2: SUBMITTED */}
          {/* {submitted && pdfUrl && (
            // <a href={pdfUrl} target="_blank" rel="noreferrer">
            //   <button className="download-btn">Download PDF</button>
            // </a>
            <button className="download-btn" onClick={handleDownload}>
              Download PDF
            </button>
          )} */}

          {submitted ? (
            <button className="download-btn" onClick={handleDownload}>
              Download PDF
            </button>
          ) : null}


        </div>
      </div>
      <div>
        {/* 🔥 CASE 1: DATE CLOSED */}

        {isClosed && !submitted && (
          <p style={{ color: "red" }}>
            ❌ Form date closed. You have not submitted the form.
          </p>
        )}
      </div>


      <div>
        {/* 🔥 CASE 3: NOT SUBMITTED (BUT DATE OPEN) */}
        {!submitted && !isClosed && (
          <p style={{ color: "orange" }}>
            ⚠️ You have not filled the form yet.
          </p>
        )}
      </div>
    </div>
  );
}
