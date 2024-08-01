import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../pantry-pal-8c785-firebase-adminsdk-l5ucx-1492985278.json";

const json = serviceAccount as ServiceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(json),
  });
}

export const db = admin.firestore();
