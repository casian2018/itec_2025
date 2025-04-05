import React, { useEffect, useState } from "react";
import {  useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "@/pages/api/firebase/firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import Aside from "@/components/Aside";


interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  attendees?: string[];
  uploadedFiles?: string[];
}

const EventDetails: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [attending, setAttending] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [activeLink, setActiveLink] = useState(router.pathname);
    
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
    ];

    useEffect(() => {
        const cookieUserId = Cookies.get("uid");
        const cookieUsername = Cookies.get("username");
        
        if (cookieUserId) {
            setUserId(cookieUserId);
            if (cookieUsername) {
                setUsername(cookieUsername);
            }
        } else {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                    setUsername(user.displayName || user.email?.split('@')[0] || null);
                } else {
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
            const eventDocRef = doc(db, "events", id as string);
            await updateDoc(eventDocRef, {
                attendees: arrayUnion(userId)
            });
            
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
        return (
            <div className="flex min-h-screen">
                <SideNav activeLink={activeLink} setActiveLink={setActiveLink} handleSignOut={handleSignOut} />
                <div className="flex-1 min-h-screen bg-gray-50 p-8">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-green-100 rounded w-1/2 mx-auto mb-4"></div>
                            <div className="h-4 bg-green-50 rounded w-1/3 mx-auto mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-green-50 rounded"></div>
                                <div className="h-4 bg-green-50 rounded w-5/6"></div>
                                <div className="h-4 bg-green-50 rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="flex min-h-screen">
                <SideNav activeLink={activeLink} setActiveLink={setActiveLink} handleSignOut={handleSignOut} />
                <div className="flex-1 min-h-screen bg-gray-50 p-8">
                    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-2xl font-bold text-green-800 mb-2">Event Not Found</h2>
                        <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
                        <button 
                            onClick={() => router.push("/events")}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Browse Events
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <SideNav activeLink={activeLink} setActiveLink={setActiveLink} handleSignOut={handleSignOut} />
            
            <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Event Header */}
                    <div className="bg-green-700 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">{event.title}</h1>
                        <div className="flex items-center text-green-100 mt-2">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                    
                    {/* Event Content */}
                    <div className="p-6">
                        <div className="prose max-w-none text-gray-700 mb-8">
                            <p className="whitespace-pre-line">{event.description}</p>
                        </div>
                        
                        {/* Attendees Section */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-green-800 mb-3">Attendees</h3>
                            {event.attendees && event.attendees.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {event.attendees.map((attendee, index) => (
                                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                            {attendee === userId ? "You" : `Attendee ${index + 1}`}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No attendees yet. Be the first!</p>
                            )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {userId && (
                                <button
                                    onClick={handleAttend}
                                    disabled={attending}
                                    className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                                        attending 
                                            ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed" 
                                            : "bg-green-600 text-white hover:bg-green-700"
                                    }`}
                                >
                                    {attending ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            You're Attending
                                        </span>
                                    ) : (
                                        "Attend This Event"
                                    )}
                                </button>
                            )}
                            
                            {!userId && (
                                <button
                                    onClick={() => router.push("/login?redirect=" + router.asPath)}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    Login to Attend
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SideNav = ({ activeLink, setActiveLink, handleSignOut }: { 
    activeLink: string; 
    setActiveLink: (link: string) => void; 
    handleSignOut: () => void 
}) => {
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
        onClick: handleSignOut,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    };

    return (
        <Aside/>
    );
};

export default EventDetails;
