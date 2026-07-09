import Selections from "../models/Selections.js";
import Candidate from "../models/Candidate.js";

export const getSelections = async (req, res) => {
  try {

    // console.log("===== SELECTION API HIT =====");

    // 🔥 TOKEN CHECK
    // console.log("REQ.HEADERS.AUTH:", req.headers.authorization);
    // console.log("REQ.USER:", req.user);
    // user se candidate profile find karo
    const candidate = await Candidate.findOne({
      userId: req.user.id
    });
      // console.log("FOUND CANDIDATE:", candidate);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found"
      });
    }

    // candidateId se selections fetch karo
    const data = await Selections.find({
      candidateId: candidate._id
    })
      .select("email post area subject meritNo rollNo")
      .lean();
  //  console.log("SELECTION DATA:", data); // 🔥 DEBUG
    return res.json(data);

  } catch (error) {
      //  console.log("SELECTION ERROR:", error.message); // 🔥 DEBUG
    return res.status(500).json({
      error: error.message
    });
  }


};
export const getSelectionWithUser = async (req, res) => {
  try {
    const selection = await Selections.findById(req.params.id);

    if (!selection) {
      return res.status(404).json({ message: "Selection not found" });
    }

    // 👉 candidate fetch
    const candidate = await Candidate.findById(selection.candidateId);

    res.json({
      ...selection.toObject(),
      candidateId: candidate
    });

  } catch (error) {
    // console.log("ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
