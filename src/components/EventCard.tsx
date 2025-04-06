import React from 'react';
import Link from 'next/link';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface EventProps {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  organizer?: string;
  videoCallLink?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
}

const EventCard: React.FC<EventProps> = ({ 
  id, 
  title, 
  date, 
  description, 
  location, 
  organizer,
  videoCallLink,
  category = "Academic", // Default category
  startTime = "09:00",
  endTime = "10:00"
}) => {
  // Parse the date string
  const eventDate = new Date(date);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  
  // Check if event is upcoming, ongoing, or past
  const now = new Date();
  const isUpcoming = isAfter(eventDate, now);
  const isToday = format(eventDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
  const isSoon = isAfter(eventDate, now) && isBefore(eventDate, addDays(now, 3));
  
  // Format for calendar download
  const getCalendarUrl = () => {
    const eventDateStr = format(eventDate, 'yyyyMMdd');
    const start = `${eventDateStr}T${startTime.replace(':', '')}00`;
    const end = `${eventDateStr}T${endTime.replace(':', '')}00`;
    const text = encodeURIComponent(title);
    const details = encodeURIComponent(description);
    const location_enc = encodeURIComponent(location || '');
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location_enc}`;
  };

  // Generate unique event colors based on category
  const getCategoryColor = () => {
    if (category === "Workshop") return "from-blue-600 to-blue-400";
    if (category === "Lecture") return "from-purple-600 to-purple-400";
    if (category === "Conference") return "from-red-600 to-red-400";
    if (category === "Social") return "from-yellow-600 to-yellow-400";
    return "from-green-600 to-green-400"; // Default academic
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-300">
      <div className="relative">
        {/* Date flag */}
        <div className="absolute top-0 right-0 bg-green-700 text-white px-4 py-2 rounded-bl-lg font-medium">
          {format(eventDate, 'MMM d')}
        </div>
        
        {/* Event category indicator */}
        <div className={`h-2 bg-gradient-to-r ${getCategoryColor()}`}></div>
        
        {/* Status indicator */}
        {isToday ? (
          <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-300 animate-pulse">
            Today
          </div>
        ) : isSoon ? (
          <div className="absolute top-3 left-3 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
            Coming Soon
          </div>
        ) : !isUpcoming && (
          <div className="absolute top-3 left-3 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            Past Event
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-24 bg-white text-gray-700 text-xs px-2 py-1 rounded-full border border-gray-200">
          {category}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-serif font-semibold text-green-800 mb-2">{title}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate} • {startTime}-{endTime}
        </div>
        
        {location && (
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
        )}
        
        {organizer && (
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {organizer}
          </div>
        )}
        
        <p className="text-gray-600 mb-5 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between pt-2 border-t border-green-50">
          <div className="flex space-x-2">
            <Link href={`/dashboard/events/${id}`}>
              <span className="text-green-700 hover:text-green-900 font-medium text-sm transition-colors duration-200">
                View Details
              </span>
            </Link>
            
            {isUpcoming && (
              <a 
                href={getCalendarUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
              >
                Add to Calendar
              </a>
            )}
          </div>
          
          {videoCallLink && isUpcoming && (
            <Link href={videoCallLink}>
              <span className="bg-green-100 hover:bg-green-200 text-green-800 text-sm py-1 px-3 rounded-md transition-colors duration-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                Join Event
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
