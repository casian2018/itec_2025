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
						</div>
						<div className="md:w-2/3 md:pl-8">
							<div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-green-600">
								<div className="flex justify-between items-center mb-4">
									<h2 className="text-2xl font-serif text-green-800">Profile Information</h2>
									<button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
										Edit Profile
									</button>
								</div>
								<p className="text-gray-600 pb-4 border-b border-gray-100">
									Manage your account details and preferences
								</p>

								<div className="mt-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="bg-green-50 rounded-lg p-4">
											<h3 className="font-medium text-green-800 mb-3 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
												</svg>
												Personal Details
											</h3>
											<div className="space-y-3">
												<div className="flex flex-col">
													<span className="text-xs text-gray-500">Full Name</span>
													<span className="font-medium text-gray-800">{username}</span>
												</div>
												<div className="flex flex-col">
													<span className="text-xs text-gray-500">Email Address</span>
													<span className="font-medium text-gray-800">{email}</span>
												</div>
												<div className="flex flex-col">
													<span className="text-xs text-gray-500">Member Since</span>
													<span className="font-medium text-gray-800">January 2023</span>
												</div>
											</div>
										</div>

										<div className="bg-green-50 rounded-lg p-4">
											<h3 className="font-medium text-green-800 mb-3 flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
												</svg>
												Account Status
											</h3>
											<div className="space-y-3">
												<div className="flex items-center">
													<div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
													<span className="text-gray-800">Active</span>
												</div>
												<div className="flex items-center">
													<span className="text-xs text-gray-500 mr-2">Account Type:</span>
													<span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded">Student</span>
												</div>
											</div>
										</div>
									</div>

									<div className="mt-6 bg-white border border-gray-100 rounded-lg p-5">
										<h3 className="font-medium text-green-800 mb-3 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
												<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
											</svg>
											Contact Information
										</h3>
										<div className="bg-gray-50 p-4 rounded-lg">
											<div className="flex items-center mb-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-3" viewBox="0 0 20 20" fill="currentColor">
													<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
													<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
												</svg>
												<span className="text-gray-800">{email || "Not Available"}</span>
											</div>
											<div className="flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700 mr-3" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
												</svg>
												<span className="text-gray-800">Not Available</span>
											</div>
										</div>
									</div>

									<div className="mt-6 bg-white border border-gray-100 rounded-lg p-5">
										<h3 className="font-medium text-green-800 mb-3 flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
											</svg>
											Preferences
										</h3>
										<div className="mt-2 space-y-3">
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Email Notifications</span>
												<label className="relative inline-flex items-center cursor-pointer">
													<input type="checkbox" value="" className="sr-only peer" defaultChecked />
													<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Two-Factor Authentication</span>
												<label className="relative inline-flex items-center cursor-pointer">
													<input type="checkbox" value="" className="sr-only peer" />
													<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;