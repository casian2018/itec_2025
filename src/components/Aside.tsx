import { useState } from "react";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { auth } from "@/pages/api/firebase/firebase";
import { useRouter } from "next/router";
function Aside() {
	const router=useRouter();
    
    const [activeLink, setActiveLink] = useState("/dashboard");
    

    const handleSignOut = async () => {
        try {
          await signOut(auth); // Firebase sign out
      
          // Optional: Call your API to do server-side cleanup if needed
          await fetch("/api/Auth/logout", { method: "POST" });
      
          // Client-side cookie cleanup using js-cookie
          Cookies.remove("uid");
          Cookies.remove("username");
          Cookies.remove("email");
      
          // Redirect
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
				{/* Logo and Title */}
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

				{/* Main nav items */}
				<nav className="flex flex-col gap-2">
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							onClick={() => setActiveLink(item.href)}
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

			{/* Logout at bottom */}
			<div>
				<a
                    href=""
                    onClick={handleSignOut}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-green-800`}
                >
                    {logoutItem.icon}
                    <p>{logoutItem.label}</p>
                </a>
			</div>
		</div>
	);
}

export default Aside;
