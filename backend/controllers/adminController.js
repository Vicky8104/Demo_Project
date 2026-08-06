
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import Selection from "../models/Selections.js";
import CounselingConfig from "../models/CounselingConfig.js";
import FinalSubmission from "../models/FinalSubmission.js";

// ✅ GET USERS (password bhi bhej rahe hain)
export const getUsers = async (req, res) => {
  const users = await User.find(); // password included
  res.json(users);
};

// ✅ GET USER BY ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

// ✅ UPDATE USER (TRANSACTION + HASH + SYNC)
export const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, mobile, role } = req.body;

    const user = await User.findById(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ email unique (ye rehne do)
    if (email && email !== user.email) {
      const existEmail = await User.findOne({ email }).session(session);
      if (existEmail) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // ❌ mobile unique CHECK REMOVED

    // ✅ password hash
    // let hashedPassword = user.password;
    // if (password && password.trim() !== "") {
    //   hashedPassword = await bcrypt.hash(password, 10);
    // }

    // ✅ update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        mobile,
        role,
      },
      { new: true, session }
    );

    // ✅ Candidate sync
    await Candidate.updateMany(
      { email: user.email },
      { name, email, mobile },
      { session }
    );

    // ✅ Selection sync
    await Selection.updateMany(
      { email: user.email },
      { email, mobile },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(updatedUser);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};

export const updatePassword = async (req, res) => {
  try {

    const { password } = req.body;

    if (!password || password.trim() === "") {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.params.id, {
      password: hashed,
    });

    res.json({
      message: "Password Updated Successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


// ---------------- CONFIG SAME ----------------

export const upsertCounselingConfig = async (req, res) => {
  try {
    const { post, area, subject, startDate, endDate } = req.body;

    // const config = await CounselingConfig.findOneAndUpdate(
    //   { post, area, subject },
    //   { startDate, endDate, isActive: true },
    //   { new: true, upsert: true }
    // );
    if (!post || !area || !subject) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const config = await CounselingConfig.findOneAndUpdate(
      { post, area, subject },
      {
        startDate,
        endDate,
        isActive: true,
      },
      { new: true, upsert: true }
    );
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllConfigs = async (req, res) => {
  try {
    const data = await CounselingConfig.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteConfig = async (req, res) => {
  try {
    await CounselingConfig.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ----------------Admin Candidates ----------------

export const getCandidates = async (req, res) => {
  const candidates = await Candidate.find(); // password included
  res.json(candidates);
};

// export const getCandidateById = async (req, res) => {
//   const candidate = await Candidate.findById(req.params.id);
//   res.json(candidate);
// };

export const getCandidateById = async (req, res) => {
  try {

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ email safe check
    if (!candidate.email) {
      return res.status(400).json({ message: "Candidate email missing" });
    }

    // ✅ IMPORTANT: exact match (trim भी कर दिया)
    const selections = await Selection.find({
      email: candidate.email.trim(),
    });


    res.json({
      candidate,
      selections,
    });

  } catch (err) {

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

export const deleteCandidate = async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.id);
  res.json({ message: "Candidate deleted successfully" });
};

export const updateCandidate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fatherName, gender, maritalStatus, dob, homeDistrict, category, ifOther } = req.body;

    const candidate = await Candidate.findById(req.params.id).session(session);
    if (!candidate) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ update user
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      {
        fatherName,
        gender,
        maritalStatus,
        dob,
        homeDistrict,
        category,
        ifOther,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );


    await session.commitTransaction();
    session.endSession();

    res.json(updatedCandidate);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

// ----------------Admin Selections ----------------
// export const getSelections = async (req, res) => {
//   try {
//     const selections = await Selection.find().sort({
//         status: 1,
//     });

//     res.json(selections);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const getSelections = async (req, res) => {
  try {
    const selections = await Selection.aggregate([
      {
        // 🔥 status priority define
        $addFields: {
          statusOrder: {
            $cond: [{ $eq: ["$status", "Submitted"] }, 1, 2]
          }
        }
      },
      {
        // 🔥 GROUP ORDER
        $sort: {
          post: 1,
          area: 1,
          subject: 1,
          statusOrder: 1   // Submitted first
        }
      }
    ]);

    res.json(selections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSelectionsById = async (req, res) => {
  const selections = await Selection.findById(req.params.id);
  res.json(selections);
};

export const deleteSelection = async (req, res) => {
  await Selection.findByIdAndDelete(req.params.id);
  res.json({ message: "Selection deleted successfully" });
};

export const updateSelection = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { post, area, subject, meritNo, rollNo, selCategory, splCategory, status } = req.body;

    const selection = await Selection.findById(req.params.id).session(session);
    if (!selection) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ update user
    const updatedSelection = await Selection.findByIdAndUpdate(
      req.params.id,
      {
        post,
        area,
        subject,
        meritNo,
        rollNo,
        selCategory,
        splCategory,
        status,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      }
    );


    await session.commitTransaction();
    session.endSession();

    res.json(updatedSelection);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
};

// ----------------Admin FinalSubmission ----------------
export const getFinalSubmission = async (req, res) => {
  try {
    const finalSubmitData = (await FinalSubmission.find())

    res.json(finalSubmitData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFinalSubmission = async (req, res) => {
  await FinalSubmission.findByIdAndDelete(req.params.id);
  res.json({ message: "finalSubmission deleted successfully" });
};