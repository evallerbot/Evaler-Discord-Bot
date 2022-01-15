import * as admin from "firebase-admin";
import key from "../key.json";

// @ts-ignore
admin.initializeApp({ credential: admin.credential.cert(key) });

export default admin.firestore();