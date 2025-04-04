import React, { useState, FormEvent, JSX } from "react";
import { auth, db } from "@/pages/api/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile, User, AuthError } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

function Register(): JSX.Element {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const Router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update display name
            await updateProfile(user, { displayName: username });
            
            // Store username in Firestore
            await setDoc(doc(db, "users", user.uid), {
                username,
                email
            });
            
            alert("User registered successfully!");
            Router.push("/");
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
                        Create an Account
                    </h1>
                    
                    {error && (
                        <div className="bg-red-600 bg-opacity-20 border border-red-500 text-red-400 p-3 rounded-lg mb-4 w-full">
                            {error}
                        </div>
                    )}
                    
                    <div className="w-full mb-4">
                        <input
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="w-full mb-4">
                        <input
                            type="email"
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="w-full mb-4">
                        <input
                            type="password"
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="w-full mb-6">
                        <input
                            type="password"
                            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full"
                    >
                        Register
                    </button>
                    
                    <p className="text-gray-400 mt-4">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-400 hover:text-blue-300">
                            Sign in
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;