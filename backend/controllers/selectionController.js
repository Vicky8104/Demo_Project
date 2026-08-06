import Selections from "../models/Selections.js";
import Candidate from "../models/Candidate.js";
import CounselingConfig from "../models/CounselingConfig.js";

export const getSelections = async (req, res) => {
  try {
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
  const now = new Date();

  const updateData = await Promise.all(
    data.map(async (item) => {
      
  const config=  await CounselingConfig.findOne({
    post: item.post,
    area: item.area,
    subject: item.subject,
  });
  let isOpen = false;
  if (config && config.isActive){
    isOpen =
    now >= new Date(config.startDate) &&
    now <= new Date(config.endDate);
  }

  return{
    ...item,
    isOpen,
    startDate: config?.startDate || null,
    endDate: config?.endDate || null
  };
})
);

    return res.json(updateData);

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
