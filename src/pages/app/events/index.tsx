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

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: { date: string; title: string; description: string }) => void;
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

  const handleSaveEvent = (eventData: Record<string, any>) => {
    console.log("Event saved:", eventData);
    setIsCreateEventOpen(false);
    // Re-fetch events after adding a new one
    fetchEvents();
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-green-50">
      <Aside />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto ml-48">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-800 to-green-700 h-3"></div>
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-serif text-green-800 mb-1">Academic Events</h1>
              <p className="text-gray-600">Browse and manage all academic events</p>
            </div>
            <button
              onClick={handleOpenCreateEvent}
              className="mt-4 md:mt-0 flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Event
            </button>
          </div>
        </div>

        {/* Events Section */}
        <div className="w-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : events.length > 0 ? (
            <EventList events={events} />
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-medium text-green-800 mb-2">No events found</h2>
              <p className="text-gray-600 mb-6">Create your first academic event to get started</p>
              <button
                onClick={handleOpenCreateEvent}
                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Event
              </button>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        <CreateEvents
          isOpen={isCreateEventOpen}
          onClose={handleCloseCreateEvent}
          onSave={handleSaveEvent}
        />
      </div>
    </div>
  );
}
