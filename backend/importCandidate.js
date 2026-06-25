const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Candidate = require("./models/Candidate");

const startImport = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected ✅");

    const results = [];

    fs.createReadStream("candidates.csv")
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        console.log("CSV Loaded ✅");

        for (let row of results) {
          try {
            const user = await User.findOne({ email: row.email });

            if (!user) {
              console.log("User not found:", row.email);
              continue;
            }

            // duplicate check
            const exist = await Candidate.findOne({ userId: user._id });

            if (!exist) {
              await Candidate.create({
                userId: user._id,   // 🔥 main link
                name: row.name,
                fname: row.fname,
                dob:row.dob,
                email:row.email.trim().toLowerCase(),
                gender:row.gender,
                maritalStatus:row.maritalStatus,
                homeDistrict:row.homeDistrict,
                category:row.category,
                mobile:row.mobile

              });

              console.log("Candidate added:", row.email);
            } else {
              console.log("Already exists:", row.email);
            }

          } catch (err) {
            console.log("Error:", err.message);
          }
        }

        console.log("Candidate Import Finished ✅");
        await mongoose.connection.close();
      });

  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

startImport();