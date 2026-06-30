

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios"
import Loader from "../components/Loader";

export default function SchoolChoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const selectionData = location.state?.selectionData;
  const candidate = location.state?.candidate;

  const post = selectionData?.post;
  const area = selectionData?.area;
  const subject = selectionData?.subject;
  const selectionId = selectionData?._id;

  const [schools, setSchools] = useState([]);
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (!selectionData || !candidate) {
      navigate("/candidate");
    }
  }, [selectionData, candidate, navigate]);

  // ✅ FETCH SCHOOLS
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true); // ✅ START

        if (!selectionId) {
          alert("Invalid selection");
          navigate("/candidate");
          return;
        }


        // const res = await axios.get(
        //   `http://localhost:5000/api/schools?post=${post}&area=${area}&subject=${subject}`
        // );

        const res = await API.get(`/schools?post=${post}&area=${area}&subject=${subject}`);

        const data = res.data || [];
        setSchools(data);

        // 👉 SESSION CHECK
        const saved = sessionStorage.getItem(`schoolChoice_${selectionId}`);

        // if (saved) {
        //   setChoices(JSON.parse(saved));
        // } else {
        //   setChoices(Array(data.length).fill(""));
        // }

        if (saved) {
          const parsed = JSON.parse(saved);

          if (parsed.length === data.length) {
            setChoices(parsed);
          } else {
            setChoices(Array(data.length).fill(""));
          }
        } else {
          setChoices(Array(data.length).fill(""));
        }

      } catch (err) {
        console.log(err);
        alert(err.response?.data?.message || "Failed to load schools");
      } finally {
        setLoading(false);
      }
    };

    if (post && area && subject && selectionId) {
      fetchSchools();
    }
  }, [post, area, subject, selectionId]);

  // ✅ HANDLE CHANGE + SESSION SAVE
  const handleChange = (index, value) => {
    const updated = [...choices];
    updated[index] = value;

    setChoices(updated);

    sessionStorage.setItem(
      `schoolChoice_${selectionId}`,
      JSON.stringify(updated)
    );
  };

  // ✅ NO DUPLICATE SCHOOLS
  const getAvailableSchools = (currentIndex) => {
    return schools.filter((school) => {
      const selectedElsewhere = choices.some(
        (c, i) => c === school._id && i !== currentIndex
      );
      return !selectedElsewhere;
    });
  };

  // ✅ FORM SUBMIT (NOT FINAL)
  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyIndex = choices.findIndex((c) => !c);

    if (emptyIndex !== -1) {
      alert(`Please select school for Choice ${emptyIndex + 1}`);

      // ✅ FOCUS US DROPDOWN PE
      const el = document.getElementById(`choice-${emptyIndex}`);
      if (el) el.focus();

      return;
    }

    setLoading(true);

    navigate("/preview", {
      state: {
        selectionId,
        selectionData,
        choices,
        schools,
        candidate,
      },
    });
  };

  return (
    <>
      <div className="personal-data">
        {loading && <Loader />}
        <div className="form-container">
          <h2>School Choice Form</h2>
          <div className="school-form-header">
            <div className="form-group">
              <label>Post:</label>
              <input value={post} readOnly />
            </div>
            <div className="form-group">
              <label>Area:</label>
              <input value={area} readOnly />
            </div>
            <div className="form-group">
              <label>subject:</label>
              <input value={subject} readOnly />
            </div>
          </div>


          {/* ✅ FORM START */}
          <form onSubmit={handleSubmit}>
            <h2>Choice Your Schools</h2>

            {schools.length === 0 && !loading && (
              <p>No schools available for this selection</p>
            )}
            <div className="school-form-grid">

              {choices.map((choice, index) => (

                <div key={index} className="form-group">
                  <label>Choice {index + 1}</label>

                  <select
                    id={`choice-${index}`}
                    value={choices[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select School</option>

                    {getAvailableSchools(index).map((school) => (
                      <option key={school._id} value={school._id}>
                        {school.schoolName || school.name}
                      </option>
                    ))}
                  </select>
                </div>

              ))}

            </div>



            <div className="button-grid">
              <div>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
              <div>
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save & Next"}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}