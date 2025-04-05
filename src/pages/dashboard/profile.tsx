import React, { useEffect, useState } from "react";
import { auth } from "@/pages/api/firebase/firebase";
import { User } from "firebase/auth";
import Aside from "@/components/Aside";

const Dashboard = () => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [username, setUsername] = useState<string>("User");
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setCurrentUser(user);
				console.log(user);
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
		<div className="flex min-h-screen">
			<Aside />
			{/* Profile Content - left section */}
			<div className="w-full p-8 bg-gray-50">
				<div className="mb-8">
          <div className="flex justify-between mb-4">
					<h1 className="text-2xl  font-bold text-gray-800 ">
						Profilul tău, {username.split(" ").pop()}
					</h1>

              {currentUser?.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
          
              </div>
					<p className="text-gray-600 mb-6">
						Aici poți vedea informațiile despre tine.
					</p>

					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Informații personale
					</h2>
          
					<div className="flex flex-col gap-4">
						<div>
							<p className="text-gray-500 font-medium">Name:</p>
							<p className="text-gray-800">{username}</p>
						</div>
					


            <div>
							<p className="text-gray-500 font-medium">Email:</p>
							<p className="text-gray-800">{email}</p>
            </div>


            <div> 
							<p className="text-gray-500 font-medium">Profile Type:</p>
							<p className="text-gray-800">{/*to be implemented */}</p>
							{/*ne trb numa daca facem si cu profesor da nu cred */}
              </div>
						</div>

					</div>
        
				</div>
			</div>
	);
};
export default Dashboard;
