import School from "../models/School.js";

export const getSchools = async (req, res) => {
  try {
    const { post, area, subject } = req.query;

    // console.log("QUERY RECEIVED:", post, area, subject);

    // ✅ Validation
    if (!post || !area || !subject) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // ✅ Case-insensitive filter (IMPORTANT FIX)
    const schools = await School.find({
      post: { $regex: `^${post}$`, $options: "i" },
      area: { $regex: `^${area}$`, $options: "i" },
      subject: { $regex: `^${subject}$`, $options: "i" }
    });

    // console.log("FILTERED SCHOOLS:", schools);

    res.json(schools);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
