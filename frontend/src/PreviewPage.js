
// import React from "react";
// import "./PreviewPage.css";

// export default function PreviewPage({
//   user,
//   personalData,
//   schoolData,
//   schools,
//   onEdit,
//   onFinalSubmit,

// }) {
//   return (
//     <div className="preview-container">

//       <h2 className="preview-title">Application Preview</h2>

//       {/* PERSONAL DETAILS */}

//       <div className="preview-section">

//         <h3>Personal Details</h3>

//         <div className="preview-grid">

//           <div><b>Post:</b><span>{user.post}</span></div>
//           <div><b>Subject:</b><span>{user.subject}</span></div>

//           <div><b>Roll No:</b><span>{user.rollno}</span></div>
//           <div><b>Merit No:</b><span>{user.meritNo}</span></div>

//           <div><b>Name:</b><span>{user.name}</span></div>
//           <div><b>Father Name:</b><span>{user.fatherName}</span></div>

//           <div><b>DOB:</b><span>{user.dob}</span></div>
//           <div><b>Gender:</b><span>{user.gender}</span></div>

//           <div><b>Marital Status:</b><span>{user.maritalStatus}</span></div>
//           <div><b>Home District:</b><span>{user.homeDistrict}</span></div>

//           <div><b>Category:</b><span>{user.category}</span></div>
//           <div><b>Selection Category: </b><span>{user.selectionCategory || "-"}</span></div>

//           <div><b>Sub Category:</b><span>{user.subCategory || "-"}</span></div>
//           <div><b>Other Category:</b><span>{user.otherCategory || "-"}</span></div>

//           <div><b>Mobile:</b><span>{user.mobile}</span></div>
//           <div><b>Email:</b><span>{user.email}</span></div>

//         </div>

//       </div>

// <div className="preview-section">

//   <h3>School Choices</h3>

//   <div className="preview-school-box">

// <ol>
//   {schoolData.map((schoolId, index) => {

//     const school = schools?.find(s => s.code === schoolId);

//     return (
//       <li key={index}>
//         <span>{index + 1}:</span>
//         <span>{school ? school.name : schoolId}</span>
//       </li>
//     );

//   })}
// </ol>

//   </div>

// </div>

//       {/* BUTTONS */}

//       <div className="preview-buttons">

//         <button className="edit-btn" onClick={onEdit}>
//           Edit
//         </button>

//         <button className="submit-btn" onClick={onFinalSubmit}>
//           Final Submit
//         </button>

//       </div>

//     </div>
//   );
// }

import React from "react";
import "./PreviewPage.css";

export default function PreviewPage({
  user,
  personalData,
  schoolData,
  schools,
  onEdit,
  onFinalSubmit
}) {

  return (

    <div className="preview-container">

      <h2 className="preview-title">Application Preview</h2>

      {/* PERSONAL DETAILS */}

      <div className="preview-section">

        <h3>Personal Details</h3>

        <div className="preview-grid">

          <div><b>Post:</b><span>{user.post}</span></div>
          <div><b>Subject:</b><span>{user.subject}</span></div>

          <div><b>Roll No:</b><span>{user.rollno}</span></div>
          <div><b>Merit No:</b><span>{user.meritNo}</span></div>

          <div><b>Name:</b><span>{user.name}</span></div>
          <div><b>Father Name:</b><span>{user.fatherName}</span></div>

          <div><b>DOB:</b><span>{user.dob}</span></div>
          <div><b>Gender:</b><span>{user.gender}</span></div>

          <div><b>Marital Status:</b><span>{personalData?.maritalStatus}</span></div>
          <div><b>Home District:</b><span>{personalData?.homeDistrict}</span></div>

          <div><b>Category:</b><span>{user.category}</span></div>
          <div><b>Selection Category:</b><span>{user.selectionCategory || "-"}</span></div>

          <div><b>Sub Category:</b><span>{user.subCategory || "-"}</span></div>
          <div><b>Other Category:</b><span>{personalData?.otherCategory || "-"}</span></div>

          <div><b>Mobile:</b><span>{user.mobile}</span></div>
          <div><b>Email:</b><span>{user.email}</span></div>

        </div>

      </div>

      {/* SCHOOL CHOICES */}

      <div className="preview-section">

        <h3>School Choices</h3>

        <div className="preview-school-box">

          <ol>

            {schoolData.map((schoolId, index) => {

              const school = schools?.find(s => s.code === schoolId);

              return (

                <li key={index}>
                  <span>{index + 1}:</span>
                  <span>{school ? school.name : schoolId}</span>
                </li>

              );

            })}

          </ol>

        </div>

      </div>

      {/* BUTTONS */}

      <div className="preview-buttons">

        <button 
        className="edit-btn" 
        onClick={onEdit}
        disabled={user.formSubmitted}>
          Edit
        </button>

        <button 
        className="submit-btn" 
        onClick={onFinalSubmit}
        disabled={user.formSubmitted}>
          Final Submit
        </button>

      </div>

    </div>

  );

}