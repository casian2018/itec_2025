import React, { useState, FormEvent ,JSX } from "react";
import { auth } from "@/pages/api/firebase/firebase";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { signInWithGoogle } from "./handleSignIn"; // Import the function
import { useRouter } from "next/router";
import Cookies from "js-cookie";



function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/app/profile");
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      await signInWithGoogle();
      router.push("/app/profile");   
      console.log("User ID:", Cookies.get("uid")); // ✅ Debugging
      console.log("Username:", Cookies.get("username"));
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 max-w-md w-full">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-gray-200 mb-6">
            Please sign in
          </h1>
          
          {error && (
            <div className="bg-red-600 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 w-full">
              {error}
            </div>
          )}
          
          <div className="w-full mb-4">
            <input
              type="email"
              className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="email"
              placeholder="Enter e-mail"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          
          <div className="w-full mb-6">
            <input
              type="password"
              className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full mb-4"
          >
            Sign in
          </button>
          
          <div className="flex items-center w-full my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-600" />
          </div>
          
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors w-full flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="mr-2">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Sign in with Google
          </button>
          
          <p className="text-gray-400 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-400 hover:text-blue-300">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;