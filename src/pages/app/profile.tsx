import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/pages/api/firebase/firebase'; // ✅ Use the shared auth instance

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setUsername(user.displayName || "User");
        setEmail(user.email || "");
      } else {
        setCurrentUser(null);
        setUsername("Guest");
        setEmail("");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p><span className="font-semibold">Username:</span> {username}</p>
      <p><span className="font-semibold">Email:</span> {email}</p>
      {currentUser?.photoURL && (
        <img
          src={currentUser.photoURL}  // Display user's profile picture if available  
        />
      )}
      <p className="mt-4">Welcome to your profile!</p>
    </div>
  );
};

export default Profile;
