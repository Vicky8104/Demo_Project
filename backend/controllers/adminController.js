// import Candidate from "../models/Candidate.js";
// import User from "../models/User.js";
// import CounselingConfig from "../models/CounselingConfig.js";


// export const getUsers = async (req, res)=>{
//   const users = await User.find().select("-password");
//   res.json(users);
// };

// export const getUserById = async (req,res) =>{
//   const user = await User.findById(req.params.id).select("-password");
//   res.json(user);
// };

// export const updateUser = async (req,res) =>{
//   try{
//     const {name, email, role} = req.body;
//     const updateUser = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {   returnDocument: "after",}
//     ).select("-password");

//     res.json(updateUser);

//   }catch(err){
//     res.status(500).json({error:err.message});

//   }
// };

// export const deleteUser = async (req,res)=>{
//   await User.findByIdAndDelete(req.params.id);
//   res.json({message: "User deleted successfully"});
// };


// export const upsertCounselingConfig = async (req, res) => {
//   try{
//     const {post, area, subject, startDate, endDate} = req.body;

//     const config = await CounselingConfig.findOneAndUpdate(
//       {post, area, subject},
//       { startDate, endDate, isActive: true},
//       { new:true, upsert:true}
//     );
//     res.json(config);
//   }catch(err){
//     res.status(500).json ({error: err.message})
//   }
// };

// export const getAllConfigs = async (req, res) => {
//   try{
//     const data= await CounselingConfig
//       .find()
//       .sort({ createAt: -1});
//     res.json(data);
//   } catch (err) {
//     console.error("Get config Error:", err)
//     res.status(500).json({error:err.message});
//   }
// };


// export const deleteConfig = async (req, res) => {
//   try{
//     await CounselingConfig.findByIdAndDelete(req.params.id);
//     res.json({ message:"Deleted Successfully"});
//   } catch (err) {
//     res.status(500).json ({error : err.message});
//   }
// };


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import Selection from "../models/Selections.js";
import CounselingConfig from "../models/CounselingConfig.js";

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
    const { name, email, mobile, password, role } = req.body;

    const user = await User.findById(req.params.id).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ email unique
    if (email && email !== user.email) {
      const existEmail = await User.findOne({ email }).session(session);
      if (existEmail) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // ✅ mobile unique
    if (mobile && mobile !== user.mobile) {
      const existMobile = await User.findOne({ mobile }).session(session);
      if (existMobile) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Mobile already exists" });
      }
    }

    // ✅ password hash
    let hashedPassword = user.password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // ✅ update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        mobile,
        role,
        password: hashedPassword,
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

// ---------------- CONFIG SAME ----------------

export const upsertCounselingConfig = async (req, res) => {
  try {
    const { post, area, subject, startDate, endDate } = req.body;

    const config = await CounselingConfig.findOneAndUpdate(
      { post, area, subject },
      { startDate, endDate, isActive: true },
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