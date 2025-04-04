//dashboard
import React, { useState } from "react";
import Nav from "@/components/nav";
import Calendar from "@/components/calendar";
import Events from "@/components/EventList";
import CreateEvents from "@/components/createEvent";
export default function dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  const handleOpenCreateEvent = () => {
    setIsCreateEventOpen(true);
  };

  const handleCloseCreateEvent = () => {
    setIsCreateEventOpen(false);
  };

  const handleSaveEvent = (eventData: { date: string; title: string; description: string }) => {
    console.log("Event saved:", eventData);
    setIsCreateEventOpen(false);
  };

  return (
    <>
      <Nav />
      <Events />
      <CreateEvents
        isOpen={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSave={function (eventData: { date: string; title: string; description: string }): void {
          throw new Error("Function not implemented.");
        }}
      />
      <button onClick={handleOpenCreateEvent} className="add-event-button">
        Add Event
      </button>
      <CreateEvents
        isOpen={isCreateEventOpen}
        onClose={handleCloseCreateEvent}
        onSave={handleSaveEvent}
      />
    </>
  );
}