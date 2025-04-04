import { useEffect, useState, JSX} from "react";
import { auth, db } from "@/pages/api/firebase/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { signOut } from "firebase/auth";

function LogOut(): JSX.Element {
	const [username, setUsername] = useState<string>("");

	useEffect(() => {
		const fetchUsername = async (): Promise<void> => {
			if (auth.currentUser) {
				const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
				if (userDoc.exists()) {
					const userData = userDoc.data() as DocumentData;
					setUsername(userData.username);
				}
			}
		};
		fetchUsername();
	}, []);

	const handleSignOut = async (): Promise<void> => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<div>
			<button 
				onClick={handleSignOut} 
				className="hover:text-blue-400 p-2 text-sm group flex flex-col justify-center items-center"
			>
				<svg
					fill="currentColor"
					viewBox="0 0 24 24"
					className="w-5 h-5 group-hover:fill-blue-400"
					xmlns="http://www.w3.org/2000/svg"
					data-darkreader-inline-fill=""
				>
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
					<g
						id="SVGRepo_tracerCarrier"
						strokeLinecap="round"
						strokeLinejoin="round"
					></g>
					<g id="SVGRepo_iconCarrier">
						<path d="M7.707,8.707,5.414,11H17a1,1,0,0,1,0,2H5.414l2.293,2.293a1,1,0,1,1-1.414,1.414l-4-4a1,1,0,0,1,0-1.414l4-4A1,1,0,1,1,7.707,8.707ZM21,1H13a1,1,0,0,0,0,2h7V21H13a1,1,0,0,0,0,2h8a1,1,0,0,0,1-1V2A1,1,0,0,0,21,1Z"></path>
					</g>
				</svg>
				Log Out
			</button>
			<p>{username}</p>
		</div>
	);
}

export default LogOut;