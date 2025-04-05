// import React from 'react';
// import Aside from '@/components/Aside';

// interface Event {
//   id: string;
//   title: string;
//   date: string;
//   description: string;
// }

// interface EventListProps {
//   events: Event[];
// }

// const EventList: React.FC<EventListProps> = ({ events }) => {
//   if (!events || events.length === 0) {
//     return (
//       <div className="mt-6 text-gray-500 text-center">
//         No events for this date.
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="mt-8 w-full">
//       <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
//         Upcoming Events
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {events.map((event) => (
//           <div
//             key={event.id}
//             onClick={() => (window.location.href = `/app/events/${event.id}`)}
//             className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-2">
//               {event.title}
//             </h2>
//             <p className="text-sm text-gray-500 mb-4">
//               {new Date(event.date).toLocaleDateString()}
//             </p>
//             <p className="text-gray-700 leading-relaxed line-clamp-3">
//               {event.description}
//             </p>
//             <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors">
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// };

// export default EventList;
// components/EventList.tsx
import React from "react";

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
    return (
      <div className="mt-4 text-gray-500 text-center">
        No events for this date.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => (window.location.href = `/app/events/${event.id}`)}
          className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer p-6 w-full max-w-md h-[300px] flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(event.date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-gray-700 line-clamp-3">
              {event.description}
            </p>
          </div>

          <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors self-start">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default EventList;
