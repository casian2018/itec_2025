import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { auth } from "@/pages/api/firebase/firebase";
import { useRouter } from "next/router";

function Aside() {
	const router = useRouter();
	const [activeLink, setActiveLink] = useState("");

	useEffect(() => {
		setActiveLink(router.pathname);
	}, [router.pathname]);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			await fetch("/api/Auth/logout", { method: "POST" });

			Cookies.remove("uid");
			Cookies.remove("username");
			Cookies.remove("email");

			router.push("/auth/login");
		} catch (err) {
			console.error("Error signing out:", err);
		}
	};

	const navItems = [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
				</svg>
			),
		},
		{
			label: "Profil",
			href: "/dashboard/profile",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
				</svg>
			),
		},
		{
			label: "Calendar",
			href: "/dashboard/calendar",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10m-9 4h4m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			),
		},
		{
			label: "Events",
			href: "/app/events",
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 8v8m4-4H8" />
				</svg>
			),
		},
	];
	const logoutItem = {
		label: "Ieși din cont",
		onClick: "/api/logout",
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
			</svg>
		),
	};
	return (
		<div className="bg-green-700 min-h-screen w-50 min-w-50 max-w-50 p-4 text-white flex flex-col justify-between">
			<div>
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
						<div className="w-8 h-8 rounded-full overflow-hidden relative">
							<div className="absolute font-bold text-xs flex flex-col h-full w-full">
								<div className="h-1/2 flex items-center justify-center">0</div>
								<div className="h-1/2 flex items-center justify-center">1</div>
							</div>
						</div>
					</div>
					<h1 className="text-xl font-bold">Academix</h1>
				</div>

				<nav className="flex flex-col gap-2">
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
								activeLink === item.href ? "bg-green-900" : "hover:bg-green-800"
							}`}
						>
							{item.icon}
							<p>{item.label}</p>
						</a>
					))}
				</nav>
			</div>

			<div>
				<a
					onClick={handleSignOut}
					className="flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-green-800"
				>
					{logoutItem.icon}
					<p>{logoutItem.label}</p>
				</a>
			</div>
		</div>
	);
}

export default Aside;
