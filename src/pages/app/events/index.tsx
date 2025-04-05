import React, { useEffect, useState } from "react";
import EventList from "@/components/EventList";
import CreateEvents from "@/components/createEvent";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";
import Aside from "@/components/Aside";

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

export default function Dashboard() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const handleOpenCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleCloseCreateEvent = () => {
    setIsCreateEventOpen(false);
  };

  const handleSaveEvent = (eventData: { date: string; title: string; description: string }) => {
    console.log("Event saved:", eventData);
    setIsCreateEventOpen(false);
    // You can optionally re-fetch events here
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData: Event[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Event, "id">),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Aside />
      <div className="w-full p-8 bg-gray-50">
        <div className="flex flex-col items-center justify-start min-h-screen py-10">
          <div className="w-full max-w-4xl px-4">
            {loading ? (
              <p className="text-gray-500">Loading events...</p>
            ) : (
              <EventList events={events} />
            )}
          </div>

          <button
            onClick={handleOpenCreateEvent}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Event
          </button>

          <CreateEvents
            isOpen={isCreateEventOpen}
            onClose={handleCloseCreateEvent}
            onSave={handleSaveEvent}
          />
        </div>
      </div>
    </div>
  );
}
