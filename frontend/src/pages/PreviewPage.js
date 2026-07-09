import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";
import API from "../api/axios";
import "./PreviewPage.css";


export default function PreviewPage() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // console.log("PREVIEW STATE:", location.state);
    const navigate = useNavigate();

    if (!location.state) {
        alert("Session expired. Please start again.");
        navigate("/candidate");
        return null;
    }


    const { selectionId, choices, schools, selectionData, candidate } =
        location.state || {};

    // 🔥 SAFETY FIX (avoid crash)
    const safeChoices = Array.isArray(choices) ? choices : [];
    const safeSchools = Array.isArray(schools) ? schools : [];

    const handleFinalSubmit = async () => {
        try {
            
            if (loading) return;

            if (safeChoices.length !== safeSchools.length) {
                alert("Please select all schools before final submit");
                return;
            }

            setLoading(true);

            const selectedSchoolNames = safeChoices.map((id) => {
                const school = safeSchools.find((s) => s._id === id);
                return school?.schoolName || "Unknown";
            });

            const res = await API.post("/final-submit", {
                selectionId,
                candidate,
                selectionData,
                schools,
                choices: selectedSchoolNames
            });


            alert("Final Submitted Successfully");

            // navigate("/download", {
            //     state: { pdfUrl: res.data.pdfUrl }
            // });
            navigate("/download", {
                state: {
                    pdfUrl: res.data.pdfUrl,
                    submitted: true,     // 🔥 ADD THIS
                    isClosed: false,      // optional but better
                    selectionData,
                    
                }
            });
            

        } catch (err) {
            // console.log(err);
            alert(err.response?.data?.message || "Submission Failed");
        } finally {
            setLoading(false); // ✅ END
        }
    };

    return (
        <>
            <div className="preview-personal-data">


                {/* ✅ LOADER */}
                {loading && (
                    <div className="overlay-loader">
                        <Loader />
                    </div>
                )}
                <div className="form-container">
                    <h2>Preview Page</h2>


                    <div className="preview-form-grid">
                        <div className="form-group">
                            <label>Post :</label>
                            <input value={selectionData?.post || ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label>Area :</label>
                            <input value={selectionData?.area || ""} readOnly />
                        </div>
                        <div className="form-group">
                            <label>subject :</label>
                            <input value={selectionData?.subject || ""} readOnly />
                        </div>
                    </div>

                    <div className="preview-personal-detail">
                        <h2>Personal Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Roll No :</label>
                                <input value={selectionData?.rollNo} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Merit No :</label>
                                <input value={selectionData?.meritNo} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Name :</label>
                                <input value={candidate?.name} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Father Name :</label>
                                <input value={candidate?.fatherName} readOnly />
                            </div>

                            <div className="form-group">
                                <label>DOB :</label>
                                <input value={candidate?.dob} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Gender :</label>
                                <input value={candidate?.gender} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Marital Status :</label>
                                <input value={candidate?.maritalStatus} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Home District :</label>
                                <input value={candidate?.homeDistrict} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Category :</label>
                                <input value={candidate?.category} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Selection Category :</label>
                                <input value={selectionData?.selCategory} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Special Category :</label>
                                <input value={selectionData?.splCategory} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Email :</label>
                                <input value={candidate?.email} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Mobile :</label>
                                <input value={candidate?.mobile} readOnly />
                            </div>
                            <div className="form-group">
                                <label>If Other :</label>
                                <input value={candidate?.ifOther} readOnly />
                            </div>

                        </div>
                    </div>

                    <div className="preview-school-detail">
                        {/* SCHOOL CHOICES */}
                        <h2>Selected Schools</h2>
                        <div className="school-form-grid">
                            {safeChoices.map((id, index) => {
                                const school = safeSchools.find(s => s._id === id);

                                return (
                                    <div className="form-group" key={index}>
                                        <label>Choice {index + 1}:</label>
                                        <input value={school?.schoolName} readOnly />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="button-grid">
                        {/* BUTTONS */}
                        <div>
                            <button onClick={() => navigate(-2)}>
                                Edit
                            </button>
                        </div>

                        <div>

                            <button
                                onClick={handleFinalSubmit}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Final Submit"}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
