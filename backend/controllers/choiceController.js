// controllers/choiceController.js
import Choice from "../models/Choice.js";
import Candidate from "../models/Candidate.js";

export const saveChoices = async (req, res) => {
  try {
    const { selectionId, choices } = req.body;

    // 🔒 user se candidate nikalo
    const candidate = await Candidate.findOne({
      userId: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ❌ duplicate check
    const uniqueChoices = new Set(choices);
    if (uniqueChoices.size !== choices.length) {
      return res.status(400).json({
        message: "Duplicate schools not allowed"
      });
    }

    // 🔁 already submitted?
    const existing = await Choice.findOne({
      selectionId,
      candidateId: candidate._id
    });

    if (existing) {
      existing.choices = choices;
      await existing.save();
      return res.json({ message: "Choices updated" });
    }

    // ✅ new entry
    const newChoice = new Choice({
      selectionId,
      candidateId: candidate._id,
      choices
    });

    await newChoice.save();

    res.json({ message: "Choices saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
