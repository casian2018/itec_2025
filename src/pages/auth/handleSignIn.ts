import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    // If user doesn't exist in Firestore, create a new document
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        lastLogin: new Date()
      });
    } else {
      // Update last login time
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: new Date()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};