import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/pages/api/firebase/firebase";
import EventList from "@/components/EventList";

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendedEvents, setAttendedEvents] = useState<string[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

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

  useEffect(() => {
    const fetchUserAttendedEvents = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setAttendedEvents(userData?.events_attended || []);
          }
        } catch (error) {
          console.error("Error fetching user attended events:", error);
        } finally {
          setLoadingUser(false);
        }
      }
    };

    fetchUserAttendedEvents();
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

  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const getMonthName = (month: number): string => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return monthNames[month];
  };

  const goToPreviousMonth = () =>
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));

  const goToNextMonth = () =>
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    handleDateSelect(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-4"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const hasEvent = events.some(
      (event) => new Date(event.date).toDateString() === currentDay.toDateString()
    );

    const isSelected = selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === i;

    const dayClass = `
      h-12 w-full rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200
      ${isSelected ? "bg-green\-600 text-white font-bold shadow-md transform scale-105" : ""}
      ${hasEvent && !isSelected ? "border-2 border-green-400 bg-green-50 hover:bg-green-100" : "hover:bg-gray-100"}
      ${!hasEvent && !isSelected ? "text-gray-700" : ""}
    `;

    days.push(
      <div key={i} className={dayClass} onClick={() => handleDateClick(i)}>
        {i}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex flex-col lg:flex-row gap-8">
      {/* Calendar Section - Fixed size */}
      <div className="w-full lg:w-1/2 h-auto">
        <div className="bg-white min-h-[500px] rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={goToPreviousMonth} 
              className="text-xl w-10 h-10 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
            >
              &lt;
            </button>
            <h2 className="text-2xl font-semibold text-gray-800">{`${monthName} ${year}`}</h2>
            <button 
              onClick={goToNextMonth} 
              className="text-xl w-10 h-10 rounded-full hover:bg-green-100 flex items-center justify-center transition-colors"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center font-medium text-green-600 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-sm uppercase tracking-wide pb-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">{days}</div>
          <div className="mt-6 flex gap-3 justify-center text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-50 border-2 border-green-400 rounded-full mr-2"></div>
            <span>Has events</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
            <span>Selected day</span>
          </div>
        </div>
        </div>
        
        
      </div>

      {/* Events Section - Fixed size */}
      <div className="w-full lg:w-1/2 h-auto">
        <div className="bg-white min-h-[500px] rounded-xl shadow-lg p-6 border border-gray-100">
          {selectedDate ? (
            <>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
                Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="events-container h-[400px] overflow-y-auto">
                  {filteredEvents.length > 0 ? (
                    <EventList events={filteredEvents} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>No events scheduled for this day</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xl">Select a date to view events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
