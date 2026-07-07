import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApps()[0];

export const auth = getAuth(app);

export default app;
