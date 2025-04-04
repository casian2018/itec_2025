import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase"; // Ensure your Firebase config is correctly set up

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

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, "events", id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
                } else {
                    console.error("No such event!");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleAttend = async () => {
        if (!id || !event) return;

        try {
            const docRef = doc(db, "events", id as string);
            await updateDoc(docRef, {
                attendees: arrayUnion("currentUserId"), // Replace "currentUserId" with the actual user ID
            });

            setAttending(true);
            alert("You are now attending this event!");
        } catch (error) {
            console.error("Error attending event:", error);
            alert("An error occurred while trying to attend the event.");
        }
    };

    if (loading) {
        return <div>Loading event details...</div>;
    }

    if (!event) {
        return <div>Event not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
            <p className="text-gray-600 italic mt-2">
                {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">{event.description}</p>
            <button
                onClick={handleAttend}
                disabled={attending}
                className={`mt-6 px-6 py-2 text-white rounded-md shadow-sm ${
                    attending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
                {attending ? "You are attending" : "Attend Event"}
            </button>
        </div>
    );
};

export default EventDetails;