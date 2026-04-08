// const admin = require("firebase-admin");

// // 🔥 ENV से JSON read
// const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: process.env.FIREBASE_BUCKET,
// });

// const bucket = admin.storage().bucket();

// module.exports = bucket;


// const admin = require("firebase-admin");

// const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "seniotteacher2024.appspot.com",
// });

// const bucket = admin.storage().bucket();

// module.exports = { bucket };

// const admin = require("firebase-admin");

// const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "seniotteacher2024.appspot.com",
// });

// const bucket = admin.storage().bucket();

// module.exports = bucket;

const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json')); // adjust path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "seniotteacher2024.appspot.com", // तुम्हारे Firebase bucket name
});

const bucket = admin.storage().bucket();

module.exports = bucket;