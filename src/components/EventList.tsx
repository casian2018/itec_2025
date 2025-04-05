import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="mt-6 text-gray-600">No events for this date.</div>;
  }

  return (
    <div className="mt-8 w-full">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Events</h1>
      <div className="flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => (window.location.href = `/app/events/${event.id}`)}
            className="min-w-[320px] bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-xl p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
            <p className="text-sm text-gray-600 italic">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
