import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "@/pages/api/firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

const HandleSignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user info in cookies (7-day expiration)
      Cookies.set("uid", user.uid, { expires: 7 });
      Cookies.set("username", user.displayName || "User");
      Cookies.set("email", user.email || "");

      // Firestore: Check if user exists
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
    } catch (error) {
      console.error("Error signing in with Google", error);
      setError("Error signing in with Google");
    }
  };

  const signInWithEmail = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Store user info in cookies
      Cookies.set("uid", user.uid, { expires: 7 });
      Cookies.set("username", user.displayName || "User");
      Cookies.set("email", user.email || "");
    } catch (error) {
      console.error("Error signing in with email & password", error);
      setError("Error signing in with email & password");
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signInWithEmail}>Sign in with Email & Password</button>
      </div>
    </div>
  );
};

export default HandleSignIn;
