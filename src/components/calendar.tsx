import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/pages/api/firebase/firebase"; // Adjust to your actual Firebase Firestore import
import EventList from "@/components/EventList"; // Adjust to your actual EventList component import

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

  // Fetch events from Firestore
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

  // Handle date selection from the calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Filter events by selected date
  const filteredEvents = selectedDate
    ? events.filter(
        (event) =>
          new Date(event.date).toDateString() === selectedDate.toDateString()
      )
    : [];

  // Get number of days in a month
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of the month (0 - Sunday, 6 - Saturday)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Get name of the month
  const getMonthName = (month: number): string => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[month];
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  // Handle day click in the calendar
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    if (handleDateSelect) {
      handleDateSelect(newDate);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isSelected = selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === i;
    days.push(
      <div
        key={i}
        className={`calendar-day ${isSelected ? 'selected' : ''}`}
        onClick={() => handleDateClick(i)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex">
      {/* Calendar Section */}
      <div className="calendar-container flex-1 mr-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Event Calendar</h1>

        <div className="calendar bg-white shadow-lg rounded-lg p-4">
          <div className="calendar-header flex justify-between items-center mb-4">
            <button onClick={goToPreviousMonth} className="text-2xl">&lt;</button>
            <span className="text-xl font-semibold">{`${monthName} ${year}`}</span>
            <button onClick={goToNextMonth} className="text-2xl">&gt;</button>
          </div>

          <div className="calendar-days grid grid-cols-7 gap-2">
            <div className="calendar-day-header">Sun</div>
            <div className="calendar-day-header">Mon</div>
            <div className="calendar-day-header">Tue</div>
            <div className="calendar-day-header">Wed</div>
            <div className="calendar-day-header">Thu</div>
            <div className="calendar-day-header">Fri</div>
            <div className="calendar-day-header">Sat</div>
            {days}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="events-container flex-1">
        {selectedDate && (
          <div className="w-full max-w-2xl">
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
    </div>
  );
};

export default Calendar;
