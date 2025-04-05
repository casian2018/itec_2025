// //dashboard
// import React, { useState } from "react";
// import Nav from "@/components/nav";
// import Calendar from "@/components/calendar";
// import Events from "@/components/EventList";
// import CreateEvents from "@/components/createEvent";
// import EventList from "@/components/EventList";
// export default function dashboard() {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

//   const handleDateSelect = (date: Date) => {
//     setSelectedDate(date);
//     console.log("Selected date:", date);
//   };

//   const handleOpenCreateEvent = () => {
//     setIsCreateEventOpen(true);
//   };

//   const handleCloseCreateEvent = () => {
//     setIsCreateEventOpen(false);
//   };

//   const handleSaveEvent = (eventData: { date: string; title: string; description: string }) => {
//     console.log("Event saved:", eventData);
//     setIsCreateEventOpen(false);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <Nav />

//       <EventList  /> {/* Pass an empty array for now */}
//       <CreateEvents
//         isOpen={false}
//         onClose={function (): void {
//           throw new Error("Function not implemented.");
//         }}
//         onSave={function (eventData: { date: string; title: string; description: string }): void {
//           throw new Error("Function not implemented.");
//         }}
//       />
//       <button onClick={handleOpenCreateEvent} className="add-event-button">
//         Add Event
//       </button>
//       <CreateEvents
//         isOpen={isCreateEventOpen}
//         onClose={handleCloseCreateEvent}
//         onSave={handleSaveEvent}
//       />
      
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import Nav from "@/components/nav";
import EventList from "@/components/EventList";
import CreateEvents from "@/components/createEvent";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";

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
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-10">
      <Nav />

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
  );
}
