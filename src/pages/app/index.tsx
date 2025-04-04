//dashboard
import React, { useState } from "react";
import Nav from "@/components/nav";
import Calendar from "@/components/calendar";
import Events from "@/components/EventList";
export default function dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };
  return (
    <>
      <Nav />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        '
        <Calendar onDateSelect={handleDateSelect} />
        {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
        {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
      </div>
      <Events />
    </>
  );
}
