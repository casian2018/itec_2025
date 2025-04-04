import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";


export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Store user info in cookies (7-day expiration)
    Cookies.set("uid", user.uid, { expires: 7 });
    Cookies.set("username", user.displayName || "User");
    Cookies.set("email", user.email || "");

    // 🔹 Firestore: Check if user exists
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        email: user.email,
        lastLogin: new Date(),
      });
    } else {
      await setDoc(
        doc(db, "users", user.uid),
        { lastLogin: new Date() },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// 🔹 Email & Password Sign-In Function
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Store user info in cookies
    Cookies.set("uid", user.uid, { expires: 7 });
    Cookies.set("username", user.displayName || "User");
    Cookies.set("email", user.email || "");

    return user;
  } catch (error) {
    console.error("Error signing in with email & password", error);
    throw error;
  }
};