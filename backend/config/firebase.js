// firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCpD73HZZMSNVZ-2TAfQVR83iGPJ5yOloQ",
//   authDomain: "teachercounselingproject.firebaseapp.com",
//   projectId: "teachercounselingproject",
//   storageBucket: "teachercounselingproject.firebasestorage.app",
//   messagingSenderId: "984891191013",
//   appId: "1:984891191013:web:72a9cecc425c07f531ee0c"
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);