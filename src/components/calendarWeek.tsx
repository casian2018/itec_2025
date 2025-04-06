import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase";
import EventList from "@/components/EventList";

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
}

const CalendarWeek: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

    const startOfWeek = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const filteredEvents = selectedDate
        ? events.filter(
                (event) =>
                    new Date(event.date).toDateString() === selectedDate.toDateString()
            )
        : [];

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col gap-8">
            {/* Week View Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() =>
                            setCurrentDate(
                                new Date(currentDate.setDate(currentDate.getDate() - 7))
                            )
                        }
                        className="text-xl w-10 h-10 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
                    >
                        &lt;
                    </button>
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Week of {startOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </h2>
                    <button
                        onClick={() =>
                            setCurrentDate(
                                new Date(currentDate.setDate(currentDate.getDate() + 7))
                            )
                        }
                        className="text-xl w-10 h-10 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
                    >
                        &gt;
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-4">
                    {daysOfWeek.map((day) => {
                        const hasEvent = events.some(
                            (event) =>
                                new Date(event.date).toDateString() === day.toDateString()
                        );

                        const isSelected =
                            selectedDate &&
                            selectedDate.toDateString() === day.toDateString();

                        const dayClass = `
                            h-20 w-full rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                            ${isSelected ? "bg-green-600 text-white font-bold shadow-md" : ""}
                            ${
                                hasEvent && !isSelected
                                    ? "border-2 border-green-400 bg-green-50 hover:bg-green-100"
                                    : "hover:bg-gray-100"
                            }
                            ${!hasEvent && !isSelected ? "text-gray-700" : ""}
                        `;

                        return (
                            <div
                                key={day.toDateString()}
                                className={dayClass}
                                onClick={() => handleDateClick(day)}
                            >
                                <span className="text-lg font-medium">
                                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                                </span>
                                <span>{day.getDate()}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Events Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                {selectedDate ? (
                    <>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
                            Events on{" "}
                            {selectedDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </h3>
                        {loading ? (
                            <div className="flex justify-center items-center h-[200px]">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <div className="events-container h-[200px] overflow-y-auto">
                                {filteredEvents.length > 0 ? (
                                    <EventList events={filteredEvents} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mb-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <p>No events scheduled for this day</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-xl">Select a date to view events</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarWeek;