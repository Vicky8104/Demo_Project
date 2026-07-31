const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const startImport = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected ✅");

    const results = [];

    fs.createReadStream("users.csv")
      .pipe(csv())
      .on("data", (row) => {
        results.push(row); // पहले data collect करो
      })
      .on("end", async () => {
        console.log("CSV Loaded ✅");

        // for (let row of results) {
        //   try {
        //     const exist = await User.findOne({ email: row.email });

        //     if (!exist) {
        //       const hashedPassword = await bcrypt.hash(row.password,10);

        //       await User.create({
        //         name: row.name,
        //         email: row.email,
        //         password: hashedPassword,
        //         role: row.role || "user",
        //         mobile: row.mobile,
        //         teamNumber: row.teamNumber || null
        //       });

        //       console.log("Inserted:", row.email);
        //     } else {
        //       console.log("Already exists:", row.email);
        //     }

        //   } catch (err) {
        //     console.log("Error:", err.message);
        //   }
        // }
        for (const row of results) {
          try {
            // Debug
            console.log(row);

            // Skip invalid rows
            if (!row.email || !row.password || !row.mobile) {
              console.log("Skipping invalid row:", row);
              continue;
            }

            const exist = await User.findOne({
              email: row.email.trim().toUpperCase(),
            });

            if (exist) {
              console.log("Already exists:", row.email);
              continue;
            }

            const hashedPassword = await bcrypt.hash(row.password.trim(), 10);

            await User.create({
              name: row.name.trim(),
              email: row.email.trim().toUpperCase(),
              password: hashedPassword,
              role: row.role || "candidate",
              mobile: row.mobile.trim(),
              teamNumber: row.teamNumber ? Number(row.teamNumber) : null,
            });

            console.log("Inserted:", row.email);
          } catch (err) {
            console.log("Error in row:", row);
            console.log(err.message);
          }
        }

        console.log("Import Finished ✅");

        await mongoose.connection.close(); // 🔥 अब safe है
      });

  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

startImport();