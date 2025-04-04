import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";
import { auth } from "@/pages/api/firebase/firebase";
import Cookies from "js-cookie";

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
    attendees?: string[];
}

const EventDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [attending, setAttending] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    
    // Check for authenticated user on component mount
    useEffect(() => {
        // Try to get user ID from cookies first (as set in your login component)
        const cookieUserId = Cookies.get("uid");
        const cookieUsername = Cookies.get("username");
        
        if (cookieUserId) {
            setUserId(cookieUserId);
            if (cookieUsername) {
                setUsername(cookieUsername);
            }
        } else {
            // Fallback to checking Firebase auth state
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                    setUsername(user.displayName || user.email?.split('@')[0] || null);
                } else {
                    // If not logged in, redirect to login page
                    router.push("/login?redirect=" + router.asPath);
                }
            });
            
            return () => unsubscribe();
        }
    }, [router]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id || !userId) return;
            
            try {
                const docRef = doc(db, "events", id as string);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const eventData = { id: docSnap.id, ...docSnap.data() } as Event;
                    setEvent(eventData);
                    
                    // Check if user is already attending
                    if (eventData.attendees?.includes(userId)) {
                        setAttending(true);
                    }
                } else {
                    console.error("No such event!");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            fetchEvent();
        }
    }, [id, userId]);

    const handleAttend = async () => {
        if (!id || !event || !userId) {
            if (!userId) {
                alert("Please log in to attend this event");
                router.push("/login?redirect=" + router.asPath);
            }
            return;
        }
        
        try {
            // 1. Update the event document to add the user to attendees
            const eventDocRef = doc(db, "events", id as string);
            await updateDoc(eventDocRef, {
                attendees: arrayUnion(userId)
            });
            
            // 2. Update the user document to add the event to events_attended
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                events_attended: arrayUnion({
                    eventId: id,
                    eventTitle: event.title,
                    eventDate: event.date,
                    attendedAt: new Date().toISOString()
                })
            });
            
            setAttending(true);
            alert("You are now attending this event!");
        } catch (error) {
            console.error("Error attending event:", error);
            alert("An error occurred while trying to attend the event.");
        }
    };

    if (loading || !userId) {
        return <div className="p-4 text-center">Loading event details...</div>;
    }

    if (!event) {
        return <div className="p-4 text-center">Event not found.</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                <div className="text-gray-600 mb-4">
                    <span className="font-medium">Date: </span>
                    {new Date(event.date).toLocaleDateString()}
                </div>
                <p className="text-gray-700 mb-6">{event.description}</p>
                
                {userId && (
                    <button
                        onClick={handleAttend}
                        disabled={attending}
                        className={`px-4 py-2 rounded font-medium ${
                            attending 
                                ? "bg-green-100 text-green-800 cursor-not-allowed" 
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        {attending ? "You are attending" : "Attend Event"}
                    </button>
                )}
                
                {!userId && (
                    <button
                        onClick={() => router.push("/login?redirect=" + router.asPath)}
                        className="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Login to Attend
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventDetails;