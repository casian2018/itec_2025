import React, { useState, FormEvent, JSX } from "react";
import { auth, db } from "@/pages/api/firebase/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

function Register(): JSX.Element {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      alert("User registered successfully!");
      router.push("/dashboard");
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold text-gray-600 text-center mb-2">
            Register on Academix
          </h1>

          {error && (
            <div className="bg-red-600/20 border border-red-500 text-red-400 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Register
          </button>

          <p className="text-gray-600 text-sm text-center mt-4">
            Already have an account?{" "}
            <a
              onClick={() => router.push("/auth/login")}
              href="#"
              className="text-green-400 hover:underline"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
