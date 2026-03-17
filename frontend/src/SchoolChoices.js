import React, { useEffect, useState } from "react";
import "./SchoolChoices.css";

export default function SchoolChoices({ schools = [], selectedSchools = [], onSubmit }) {

  const [choices, setChoices] = useState([]);

  useEffect(() => {

    if (schools.length > 0) {

      if (selectedSchools.length > 0) {
        setChoices(selectedSchools);
      } else {
        setChoices(new Array(schools.length).fill(""));
      }

    }

  }, [schools, selectedSchools]);


  const handleChange = (index, value) => {

    const updated = [...choices];
    updated[index] = value;

    setChoices(updated);

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    // 🔴 validation
    for (let i = 0; i < choices.length; i++) {

      if (!choices[i]) {

        alert(`Please select school for Choice ${i + 1}`);

        // focus on empty dropdown
        const el = document.getElementById(`school-${i}`);
        if (el) el.focus();

        return;
      }

    }

    // ✅ all selected
    onSubmit(choices);

  };


  return (

    <div className="school-container">

      <h2 className="school-title">School Choice Selection</h2>

      <form onSubmit={handleSubmit}>

        {schools.length === 0 ? (
          <p>No schools found</p>
        ) : (

          schools.map((_, index) => (

            <div key={index} className="choice-row">

              <label className="choice-label">
                Choice {index + 1}
              </label>

              <select
                id={`school-${index}`}   // ⭐ focus के लिए
                className="school-select"
                value={choices[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
              >

                <option value="">Select School</option>

                {schools.map((s) => (

                  <option
                    key={s._id}
                    value={s.code}
                    disabled={
                      choices.includes(s.code) &&
                      choices[index] !== s.code
                    }
                  >
                    {s.name}
                  </option>

                ))}

              </select>

            </div>

          ))

        )}

        <button className="submit-btn" type="submit">
          Submit School Choices
        </button>

      </form>

    </div>

  );

}