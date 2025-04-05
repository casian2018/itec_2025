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
			<div className="flex-1 bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center p-4">
				<div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 transition-all duration-300">
					<div className="flex flex-col md:flex-row">
						<div className="md:w-1/3 text-center mb-8 md:mb-0">
							{currentUser?.photoURL ? (
								<img
									src={currentUser.photoURL}
									alt="Profile Picture"
									className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-green-600 transition-transform duration-300 hover:scale-105"
								/>
							) : (
								<div className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-green-600 bg-gray-200 flex items-center justify-center text-gray-500">
									No Image
								</div>
							)}
							<h1 className="text-2xl font-bold text-green-800 mb-2">{username}</h1>
							<p className="text-gray-600">User</p>
							<button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300">
								Edit Profile
							</button>
						</div>
						<div className="md:w-2/3 md:pl-8">
							<h2 className="text-xl font-semibold text-green-800 mb-4">About Me</h2>
							<p className="text-gray-700 mb-6">
								Welcome to your profile page. Here you can view and manage your personal information.
							</p>
							<h2 className="text-xl font-semibold text-green-800 mb-4">Personal Information</h2>
							<div className="space-y-4">
								<div>
									<p className="text-gray-500 font-medium">Name:</p>
									<p className="text-gray-800">{username}</p>
								</div>
								<div>
									<p className="text-gray-500 font-medium">Email:</p>
									<p className="text-gray-800">{email}</p>
								</div>
							</div>
							<h2 className="text-xl font-semibold text-green-800 mt-6 mb-4">Contact Information</h2>
							<ul className="space-y-2 text-gray-700">
								<li className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 mr-2 text-green-800"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
									{email || "Not Available"}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
