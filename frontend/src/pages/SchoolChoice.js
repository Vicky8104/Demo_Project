import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import Loader from "../components/Loader";
import "./SchoolChoice.css";

/* =========================================================
   CUSTOM SCHOOL DROPDOWN
   ========================================================= */

function SchoolDropdown({
  index,
  value,
  schools,
  availableSchools,
  onChange,
  disabled,
}) {
  const [open, setOpen] = useState(false);

  // Initially 20 schools
  const [visibleSchools, setVisibleSchools] = useState(20);

  // Search
  const [search, setSearch] = useState("");

  /* =======================================================
     RESET WHEN DROPDOWN OPENS
     ======================================================= */

  useEffect(() => {
    if (open) {
      setVisibleSchools(20);
      setSearch("");
    }
  }, [open]);

  /* =======================================================
     SCHOOL NAME
     ======================================================= */

  const getSchoolName = (school) => {
    return school.schoolName || school.name || "";
  };

  /* =======================================================
     SEARCH FILTER
     ======================================================= */

  const filteredSchools = availableSchools.filter(
    (school) => {
      const name = getSchoolName(school);

      return name
        .toLowerCase()
        .includes(search.toLowerCase());
    }
  );

  /* =======================================================
     ONLY SHOW VISIBLE SCHOOLS
     ======================================================= */

  const displayedSchools = filteredSchools.slice(
    0,
    visibleSchools
  );

  /* =======================================================
     SELECT SCHOOL
     ======================================================= */

  const handleSelect = (school) => {
    onChange(index, school._id);

    setOpen(false);
    setSearch("");
  };

  /* =======================================================
     DROPDOWN INTERNAL SCROLL
     NEXT 20 SCHOOLS
     ======================================================= */

  const handleDropdownScroll = (e) => {
    const element = e.currentTarget;

    const nearBottom =
      element.scrollTop + element.clientHeight >=
      element.scrollHeight - 30;

    if (nearBottom) {
      setVisibleSchools((prev) => {
        if (prev >= filteredSchools.length) {
          return prev;
        }

        return Math.min(
          prev + 20,
          filteredSchools.length
        );
      });
    }
  };

  /* =======================================================
     SELECTED SCHOOL
     ======================================================= */

  const selectedSchool = schools.find(
    (school) => school._id === value
  );

  const selectedSchoolName = selectedSchool
    ? getSchoolName(selectedSchool)
    : "";

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="school-dropdown-wrapper">
      <label>Choice {index + 1}</label>

      {/* ================================================
          DROPDOWN BUTTON
          ================================================ */}

      <button
        type="button"
        className={`school-dropdown-button ${
          open ? "active" : ""
        }`}
        onClick={() => {
          if (!disabled) {
            setOpen((prev) => !prev);
          }
        }}
        disabled={disabled}
      >
        <span>
          {selectedSchoolName || "Select School"}
        </span>

        <span className="dropdown-arrow">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* ================================================
          DROPDOWN MENU
          ================================================ */}

      {open && (
        <div className="school-dropdown-menu">
          {/* SEARCH */}

          <div className="school-search-box">
            <input
              type="text"
              placeholder="Search school..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleSchools(20);
              }}
              autoFocus
            />
          </div>

          {/* SCHOOL LIST */}

          <div
            className="school-dropdown-list"
            onScroll={handleDropdownScroll}
          >
            {displayedSchools.length > 0 ? (
              displayedSchools.map((school) => {
                const schoolName =
                  getSchoolName(school);

                const isSelected =
                  value === school._id;

                return (
                  <div
                    key={school._id}
                    className={`school-option ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleSelect(school)
                    }
                  >
                    <span>{schoolName}</span>

                    {isSelected && (
                      <span className="selected-tick">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-school">
                No school found
              </div>
            )}

            {/* ==========================================
                MORE SCHOOLS AVAILABLE
                ========================================== */}

            {displayedSchools.length <
              filteredSchools.length && (
              <div className="load-more-schools">
                Scroll down for next 20 schools...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MAIN SCHOOL CHOICE PAGE
   ========================================================= */

export default function SchoolChoice() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const selectionData =
    location.state?.selectionData;

  const candidate =
    location.state?.candidate;

  const post = selectionData?.post;
  const area = selectionData?.area;
  const subject = selectionData?.subject;
  const selectionId = selectionData?._id;

  const [schools, setSchools] = useState([]);
  const [choices, setChoices] = useState([]);

  /* =========================================================
     CHOICE BATCH SIZE
     20 DROPDOWNS AT A TIME
     ========================================================= */

  const CHOICE_BATCH_SIZE = 20;

  const [visibleCount, setVisibleCount] =
    useState(CHOICE_BATCH_SIZE);

  /* =========================================================
     CHECK DATA
     ========================================================= */

  useEffect(() => {
    if (!selectionData || !candidate) {
      navigate("/candidate");
    }
  }, [
    selectionData,
    candidate,
    navigate,
  ]);

  /* =========================================================
     FETCH SCHOOLS
     ========================================================= */

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);

        if (!selectionId) {
          alert("Invalid selection");
          navigate("/candidate");
          return;
        }

        const res = await API.get(
          `/schools?post=${encodeURIComponent(
            post
          )}&area=${encodeURIComponent(
            area
          )}&subject=${encodeURIComponent(
            subject
          )}`
        );

        const data = res.data || [];

        setSchools(data);

        /* ================================================
           SESSION STORAGE
           ================================================ */

        const saved = sessionStorage.getItem(
          `schoolChoice_${selectionId}`
        );

        if (saved) {
          try {
            const parsed = JSON.parse(saved);

            if (
              Array.isArray(parsed) &&
              parsed.length === data.length
            ) {
              setChoices(parsed);
            } else {
              setChoices(
                Array(data.length).fill("")
              );
            }
          } catch (error) {
            console.error(
              "Invalid saved school choices:",
              error
            );

            setChoices(
              Array(data.length).fill("")
            );
          }
        } else {
          setChoices(
            Array(data.length).fill("")
          );
        }

        // Start with 20 choices
        setVisibleCount(
          CHOICE_BATCH_SIZE
        );
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to load schools"
        );
      } finally {
        setLoading(false);
      }
    };

    if (
      post &&
      area &&
      subject &&
      selectionId
    ) {
      fetchSchools();
    }
  }, [
    post,
    area,
    subject,
    selectionId,
    navigate,
  ]);

  /* =========================================================
     PAGE SCROLL
     NEXT 20 CHOICES
     ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight;

      const nearBottom =
        scrollTop + windowHeight >=
        documentHeight - 300;

      if (nearBottom) {
        setVisibleCount((prev) => {
          if (prev >= choices.length) {
            return prev;
          }

          return Math.min(
            prev + CHOICE_BATCH_SIZE,
            choices.length
          );
        });
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [
    choices.length,
    loading,
  ]);

  /* =========================================================
     HANDLE CHANGE
     ========================================================= */

  const handleChange = (
    index,
    value
  ) => {
    const updated = [...choices];

    updated[index] = value;

    setChoices(updated);

    sessionStorage.setItem(
      `schoolChoice_${selectionId}`,
      JSON.stringify(updated)
    );
  };

  /* =========================================================
     NO DUPLICATE SCHOOL
     ========================================================= */

  const getAvailableSchools = (
    currentIndex
  ) => {
    return schools.filter((school) => {
      const selectedElsewhere =
        choices.some(
          (c, i) =>
            c === school._id &&
            i !== currentIndex
        );

      return !selectedElsewhere;
    });
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyIndex =
      choices.findIndex(
        (c) => !c
      );

    /* ================================================
       EMPTY CHOICE
       ================================================ */

    if (emptyIndex !== -1) {
      alert(
        `Please select school for Choice ${
          emptyIndex + 1
        }`
      );

      /* ==============================================
         CHOICE NOT CURRENTLY RENDERED
         ============================================== */

      if (emptyIndex >= visibleCount) {
        setVisibleCount(
          Math.min(
            emptyIndex + 1,
            choices.length
          )
        );

        setTimeout(() => {
          const el =
            document.getElementById(
              `choice-${emptyIndex}`
            );

          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);

        return;
      }

      /* ==============================================
         FOCUS CURRENT CHOICE
         ============================================== */

      const el =
        document.getElementById(
          `choice-${emptyIndex}`
        );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    /* ================================================
       ALL CHOICES COMPLETE
       ================================================ */

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

  /* =========================================================
     UI
     ========================================================= */

  return (
    <>
      <div className="personal-data">

        {loading && <Loader />}

        <div className="form-container">

          <h2>
            School Choice Form
          </h2>

          {/* ==============================================
              HEADER
              ============================================== */}

          <div className="school-form-header">

            <div className="form-group">
              <label>Post:</label>

              <input
                value={post || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Area:</label>

              <input
                value={area || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Subject:</label>

              <input
                value={subject || ""}
                readOnly
              />
            </div>

          </div>

          {/* ==============================================
              FORM
              ============================================== */}

          <form onSubmit={handleSubmit}>

            <h2>
              Choice Your Schools
            </h2>

            {schools.length === 0 &&
              !loading && (
                <p>
                  No schools available
                  for this selection
                </p>
              )}

            {/* ==========================================
                ONLY 20 CHOICES AT A TIME
                ========================================== */}

            <div className="school-form-grid">

              {choices
                .slice(
                  0,
                  visibleCount
                )
                .map(
                  (
                    choice,
                    index
                  ) => (
                    <div
                      key={index}
                      id={`choice-${index}`}
                      className="form-group"
                    >
                      <SchoolDropdown
                        index={index}
                        value={
                          choices[index] ||
                          ""
                        }
                        schools={schools}
                        availableSchools={getAvailableSchools(
                          index
                        )}
                        onChange={
                          handleChange
                        }
                        disabled={
                          loading
                        }
                      />
                    </div>
                  )
                )}

            </div>

            {/* ==========================================
                MORE CHOICES
                ========================================== */}

            {visibleCount <
              choices.length && (
              <div className="more-choices">
                Scroll down for next 20
                choices...
              </div>
            )}

            {/* ==========================================
                ALL CHOICES LOADED
                ========================================== */}

            {visibleCount >=
              choices.length &&
              choices.length > 0 && (
              <div className="all-choices">
                All {choices.length} choices
                loaded
              </div>
            )}

            {/* ==========================================
                BUTTONS
                ========================================== */}

            <div className="button-grid">

              <div>
                <button
                  type="button"
                  onClick={() =>
                    navigate(-1)
                  }
                  disabled={loading}
                >
                  Back
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save & Next"}
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>
    </>
  );
}
