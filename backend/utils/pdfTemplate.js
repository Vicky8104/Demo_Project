// utils/pdfTemplate.js

export const generateHTML = ({ candidate, selectionData, schools, choices }) => {
  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 80px 40px 60px 40px;
      }

      /* HEADER */
      header {
        position: fixed;
        top: -60px;
        left: 0;
        right: 0;
        height: 60px;
        text-align: center;
        border-bottom: 1px solid #000;
      }

      header img {
        height: 40px;
        position: absolute;
        left: 10px;
        top: 10px;
      }

      header h2 {
        margin: 0;
        line-height: 60px;
      }

      /* FOOTER */
      footer {
        position: fixed;
        bottom: -40px;
        left: 0;
        right: 0;
        height: 40px;
        border-top: 1px solid #000;
        text-align: center;
        font-size: 12px;
      }

      .pagenumber:after {
        content: counter(page);
      }

      .totalpages:after {
        content: counter(pages);
      }

      h3 {
        margin-top: 20px;
        border-bottom: 1px solid #ccc;
      }

      p {
        margin: 4px 0;
      }

      .section {
        page-break-inside: avoid;
      }

    </style>
  </head>

  <body>

    <header>
      <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Emblem_of_India.svg"/>
      <h2>Final Submission</h2>
    </header>

    <footer>
      Page <span class="pagenumber"></span> of <span class="totalpages"></span>
    </footer>

    <div class="section">
      <h3>Personal Details</h3>
      <p>Name: ${candidate.name}</p>
      <p>Father: ${candidate.fatherName}</p>
      <p>Email: ${candidate.email}</p>
      <p>Mobile: ${candidate.mobile}</p>
    </div>

    <div class="section">
      <h3>Selection Details</h3>
      <p>Post: ${selectionData.post}</p>
      <p>Area: ${selectionData.area}</p>
      <p>Subject: ${selectionData.subject}</p>
      <p>Roll No: ${selectionData.rollNo}</p>
    </div>

    <div class="section">
      <h3>Schools</h3>
      ${
        choices.map((id, i) => {
          const school = schools.find(s => s._id == id);
          return `<p>${i + 1}. ${school?.schoolName}</p>`;
        }).join("")
      }
    </div>

  </body>
  </html>
  `;
};