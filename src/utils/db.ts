import { getFirestore } from "firebase/firestore";
import firebaseApp from "@/utils/firebase";

const db = getFirestore(firebaseApp);
export default db;
