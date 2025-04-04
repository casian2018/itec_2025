import React, { useEffect, useState } from 'react';
import { getAuth, User } from 'firebase/auth'; // Ensure correct import
import { auth } from '@/pages/api/firebase/firebase'; // Ensure auth is correctly exported


const Profile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");


  useEffect(() => {
    const authInstance = getAuth(); // Ensure auth is correctly initialized
    const user = authInstance.currentUser;
    console.log(user); // Logs the current user

    if (user) {
      setCurrentUser(user);
      setUsername(user.displayName || "User");
      setEmail(user.email || "");
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Welcome to the Profile Page</h1>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <div>
      </div>
    </div>
  );
};

export default Profile;