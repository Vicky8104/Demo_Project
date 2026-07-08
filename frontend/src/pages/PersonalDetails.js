import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./PersonalDetails.css";

export default function PersonalDetail() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const [selectionData, setSelectionData] = useState(null);

    const selectionId =
        location.state?.selectionId ||
        sessionStorage.getItem("selectionId");

    const candidate = selectionData?.candidateId;

    const [editedData, setEditedData] = useState({
        maritalStatus: "",
        homeDistrict: "",
        ifOther: ""
    });

    // ✅ FETCH DATA
    useEffect(() => {
        const fetchSelectionDetails = async () => {
            try {
                setLoading(true); // ✅ START
                // const res = await axios.get(
                //     `http://localhost:5000/api/selections/${selectionId}/details`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${user.token}`
                //         }
                //     }
                // );

                const res = await API.get(`/selections/${selectionId}/details`);

                setSelectionData(res.data);
            } catch (err) {
                console.log("Selection Error:", err);
                alert(err.response?.data?.message || "Failed to load Data")
            } finally {
                setLoading(false); // ✅ END
            }
        };

        if (selectionId && user) {
            fetchSelectionDetails();
        }
    }, [selectionId, user]);

    // ✅ LOAD FROM SESSION OR DEFAULT
    useEffect(() => {
        if (candidate && selectionId) {
            const saved = sessionStorage.getItem(`personalEdit_${selectionId}`);

            if (saved) {
                setEditedData(JSON.parse(saved));
            } else {
                setEditedData({
                    maritalStatus: candidate.maritalStatus || "",
                    homeDistrict: candidate.homeDistrict || "",
                    ifOther: candidate.ifOther || ""
                });
            }
        }
    }, [candidate, selectionId]);

    // ✅ HANDLE CHANGE + SESSION SAVE
    const handleChange = (e) => {
        const { name, value } = e.target;

        const updated = {
            ...editedData,
            [name]: value
        };

        setEditedData(updated);

        sessionStorage.setItem(
            `personalEdit_${selectionId}`,
            JSON.stringify(updated)
        );
    };

    // ✅ FORM SUBMIT (NOT FINAL)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !editedData.maritalStatus.trim() ||
            !editedData.homeDistrict.trim() ||
            !editedData.ifOther.trim()
        ) {
            alert("Please fill all required fields!");
            return;
        }

        setLoading(true); // ✅ START

        navigate("/school-choice", {
            state: {
                selectionId,
                selectionData,
                candidate: {
                    ...candidate,
                    ...editedData
                }
            }
        });
    };

    return (
        <>
            <div className="personal-data">
                {/* ✅ LOADER */}
                {loading && <Loader />}
                <div className="form-container">

                    <h2>Personal Details Form</h2>

                    {/* ✅ FORM START */}
                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Post :</label>
                                <input value={selectionData?.post || ""} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Area :</label>
                                <input value={selectionData?.area} readOnly />
                            </div>
                            <div className="form-group">
                                <label>subject :</label>
                                <input value={selectionData?.subject} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Roll No:</label>
                                <input value={selectionData?.rollNo} readOnly />
                            </div>
                            <div className="form-group">
                                <label> Merit No:</label>
                                <input value={selectionData?.meritNo} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Name :</label>
                                <input value={candidate?.name} readOnly />
                            </div>
                            <div className="form-group">
                                <label> Father Name :</label>
                                <input value={candidate?.fatherName} readOnly />
                            </div>

                            <div className="form-group">
                                <label> DOB :</label>
                                <input value={candidate?.dob} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Gender :</label>
                                <input value={candidate?.gender} readOnly />
                            </div>

                            <div className="form-group">
                                <label> Merital Status :</label>
                                <input
                                    type="text"
                                    name="maritalStatus"
                                    value={editedData.maritalStatus}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Home District :</label>
                                <input
                                    type="text"
                                    name="homeDistrict"
                                    value={editedData.homeDistrict}
                                    onChange={handleChange}
                                />
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
                                <input
                                    type="text"
                                    name="ifOther"
                                    value={editedData.ifOther}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>
                        {/* ✅ BUTTONS */}
                        <div className="button-grid">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => navigate("/candidate")}
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
