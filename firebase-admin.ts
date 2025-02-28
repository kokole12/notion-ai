import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceKey from "./service_key.json";

const initFirebaseAdmin = () => {
  if (getApps().length === 0) {
    return initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: cert(serviceKey as any),
    });
  }
  return getApps()[0];
};

const adminApp = initFirebaseAdmin();
const adminDb = getFirestore(adminApp);

export { adminDb, adminApp };
