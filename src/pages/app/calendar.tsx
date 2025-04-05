// //dashboard
// import React, { useEffect, useState } from "react";
// import Nav from "@/components/nav";
// import Calendar from "@/components/calendar";
// import Events from "@/components/EventList";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "@/pages/api/firebase/firebase";
// export default function dashboard() {
// 	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
// 	const [events, setEvents] = useState<Event[]>([]);
//       const [loading, setLoading] = useState(true);
  

// 	interface Event {
// 		id: string;
// 		title: string;
// 		date: string;
// 		description: string;
// 	}

// 	const fetchEvents = async (selectedDate: Date | null) => {  
// 		try {
// 			const querySnapshot = await getDocs(collection(db, "events"));
// 			const eventsData: Event[] = querySnapshot.docs.map((doc) => ({
// 				id: doc.id,
// 				...doc.data(),
// 			})) as Event[];
// 			setEvents(eventsData);
// 			console.log("Fetched events:", eventsData);
// 		} catch (error) {
// 			console.error("Error fetching events:", error);
// 		}
// 	};

// 	const handleDateSelect = (date: Date) => {
// 		setSelectedDate(date);
// 		fetchEvents(date);
// 		console.log("Selected date:", date);
// 	};

//   if (loading) {
//     return <div>Loading events...</div>;
//   }
// 	return (
// 		<>
// 			<Nav />
// 			<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
// 				<Calendar onDateSelect={handleDateSelect } />
// 				{selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
// 			</div>
// 		</>
// 	);
// }

import React, { useEffect, useState } from "react";
import Nav from "@/components/nav";
import Calendar from "@/components/calendar";
import EventList from "@/components/EventList";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          new Date(event.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>

        <Calendar onDateSelect={handleDateSelect} />

        {selectedDate && (
          <div className="mt-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-2">
              Events on {selectedDate.toDateString()}
            </h2>
            {loading ? (
              <p>Loading events...</p>
            ) : (
              <EventList events={filteredEvents} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CalendarPage;
//ca sa functioneze tre sa fie data de format yyyy-mm-dd