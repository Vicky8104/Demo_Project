const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const School = require("./models/School.js");


const startImport = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");

    const results = [];

    fs.createReadStream("schools.csv")
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        console.log("CSV Loaded ✅");

        for (let row of results) {
          try {
            // 🔥 duplicate check (code unique)
            const exists = await School.findOne({ 
              code: row.code,
              post:row.post,
              subject:row.subject,
              area:row.area
             });

            if (exists) {
              console.log("⚠️ Already exists:", row.code);
              continue;
            }

            await School.create({
              code: row.code,
              schoolName: row.schoolName,
              post: row.post,
              subject: row.subject,
              area: row.area,
            });

            console.log("✅ Inserted:", row.schoolName);

          } catch (err) {
            console.log("❌ Error:", err.message);
          }
        }

        console.log("🎉 School Import Completed");
        process.exit();
      });

  } catch (err) {
    console.log("❌ DB Error:", err.message);
  }
};

startImport();