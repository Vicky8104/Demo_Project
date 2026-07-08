
import API from "../api/axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";
import Loader from "../components/Loader";

export default function CandidateDashboard() {
  const { user } = useContext(AuthContext);
  const [selections, setSelections] = useState([]);
  const navigate = useNavigate(); // 👈 add this
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    if (user && user.role === "candidate") {
      fetchSelections();

    }
  }, [user]);

  const fetchSelections = async () => {
    try {
      setLoading(true); // ✅ START
       const res = await API.get("/selections");

      // console.log("API DATA:", res.data);
      setSelections(res.data);

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to fetch selections")
    } finally {
      setLoading(false); // ✅ END
    }
  };
  // console.log("selections", selections)

  const handleClick = async (selection) => {
    try {
      setLoading(true);

        console.log("CLICKED"); // 🔥 add this

      const res = await API.post("/final-submit/check",{
        email: user.email,
        post: selection.post,
        area: selection.area,
        subject: selection.subject,
      });

      const { submitted, pdfUrl, isClosed } = res.data;

      // 🔥 CASE 1: DATE CLOSED
      if (isClosed) {
        navigate("/download", {
          state: {
            pdfUrl,
            submitted,
            isClosed: true,
             selectionData: selection   // ✅ ADD THIS
            
          },
        });
         console.log("RESPONSE:", res.data); // 🔥 add this
        return;
      }

      // 🔥 CASE 2: ALREADY SUBMITTED
      if (submitted) {
        navigate("/download", {
          state: { pdfUrl, submitted, isClosed: false,  selectionData: selection  },
        });
      } else {
        sessionStorage.setItem("selectionId", selection._id);

        navigate("/personal-details", {
          state: { selectionId: selection._id },
        });
      }

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div>
      {/* ✅ LOADER */}
      {loading && <Loader />}
      <div className="sub-header">
        <p>Welcome : {user?.name}</p>
        <p>Email: {user?.email}</p>
      </div>

      <div className="sub-heading">
        <h2>Your Selection Cards</h2>
      </div>

      <div className="sub-container">
        {selections.length === 0 ? (
          <p>No selections found</p>
        ) : (
          selections.map((item) => (
            <div key={item._id} className="sub-card" onClick={() => handleClick(item)}

            >
              <h3>{item.post}</h3>
              <p>Area: {item.area}</p>
              <p>Subject: {item.subject}</p>
            </div>
          ))
        )}

      </div>
    </div>
    </>
  );
}
