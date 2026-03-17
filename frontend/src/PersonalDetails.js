import React, { useState } from "react";
import "./PersonalDetails.css";

export default function PersonalDetails({ user, onSubmit }) {

  const [form, setForm] = useState({
    maritalStatus: user.maritalStatus || "",
    homeDistrict: user.homeDistrict || "",
    otherCategory: user.otherCategory || ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="personal-container">

      <h2>Personal Details</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Post:</label>
            <input value={user.post} readOnly />
          </div>

          <div className="form-group">
            <label>Subject:</label>
            <input value={user.subject} readOnly />
          </div>

          <div className="form-group">
            <label>Roll No:</label>
            <input value={user.rollno} readOnly />
          </div>

          <div className="form-group">
            <label>Merit No.:</label>
            <input value={user.meritNo} readOnly />
          </div>

          <div className="form-group">
            <label>Name:</label>
            <input value={user.name} readOnly />
          </div>

          <div className="form-group">
            <label>Father Name:</label>
            <input value={user.fatherName} readOnly />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <input value={user.gender} readOnly />
          </div>

          <div className="form-group">
            <label>DOB:</label>
            <input value={user.dob} readOnly />
          </div>

          <div className="form-group">
            <label>Marital Status:</label>
            <input
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Home District: </label>
            <input
              name="homeDistrict"
              value={form.homeDistrict}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category:</label>
            <input value={user.category} readOnly />
          </div>

          <div className="form-group">
            <label>Selection Category:</label>
            <input value={user.selectionCategory} readOnly />
          </div>

          <div className="form-group">
            <label>Special Category:</label>
            <input value={user.specialCategory} readOnly />
          </div>

          <div className="form-group">
            <label>If Other:</label>
            <input
              name="otherCategory"
              value={form.otherCategory}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile:</label>
            <input value={user.mobile} readOnly />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input value={user.email} readOnly />
          </div>

        </div>

        <button type="submit">Submit Personal Details</button>

      </form>

    </div>
  );
}