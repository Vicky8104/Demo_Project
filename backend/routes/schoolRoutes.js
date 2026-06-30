// // routes/schoolRoutes.js
// import express from "express";
// import School from "../models/School.js";

// const router = express.Router();

// // GET /api/schools?post=&area=&subject=
// router.get("/", async (req, res) => {
//   try {
//     const { post, area, subject } = req.query;

//     const schools = await School.find({
//       post,
//       area,
//       subject
//     });

//     res.json(schools);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
import express from "express";
import { getSchools } from "../controllers/schoolController.js";

const router = express.Router();

router.get("/", getSchools);

export default router;