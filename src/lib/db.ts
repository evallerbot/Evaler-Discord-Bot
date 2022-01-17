import * as admin from "firebase-admin";

// @ts-ignore
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY!)) });

export default admin.firestore();