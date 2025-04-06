import React, { useState, useMemo } from 'react';
import EventCard from './EventCard';

interface Event {
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

interface EventsGridProps {
  events: Event[];
}

const EventsGrid: React.FC<EventsGridProps> = ({ events }) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  
  // Extract unique categories from events
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    uniqueCategories.add('all');
    
    events.forEach(event => {
      if (event.category) {
        uniqueCategories.add(event.category);
      } else {
        uniqueCategories.add('Academic'); // Default category
      }
    });
    
    return Array.from(uniqueCategories);
  }, [events]);
  
  // Filter and sort events
  const processedEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let filtered = events.filter(event => {
      // Apply time filter
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      if (filter === 'upcoming') return eventDate >= today;
      if (filter === 'past') return eventDate < today;
      if (filter === 'today') {
        return eventDate.getDate() === today.getDate() &&
               eventDate.getMonth() === today.getMonth() &&
               eventDate.getFullYear() === today.getFullYear();
      }
      return true; // 'all' filter
    });
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(search) || 
        event.description.toLowerCase().includes(search) ||
        (event.location && event.location.toLowerCase().includes(search)) ||
        (event.organizer && event.organizer.toLowerCase().includes(search))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter || 
        (!event.category && categoryFilter === 'Academic')); // Default category
    }
    
    // Sort events
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  }, [events, filter, searchTerm, categoryFilter, sortBy]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-serif font-semibold text-green-800">Academic Events</h2>
        
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Filter controls */}
      <div className="bg-green-50 rounded-lg p-4 flex flex-wrap gap-4">
        {/* Time filter */}
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Time</label>
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            {['all', 'upcoming', 'today', 'past'].map((option) => (
              <button 
                key={option}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${filter === option 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'text-green-700 hover:bg-green-100'}`}
                onClick={() => setFilter(option as any)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Category filter */}
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Sort options */}
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block w-full pl-3 pr-10 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
      
      {processedEvents.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-medium text-green-800 mb-2">No events found</h3>
          <p className="text-green-700">
            {searchTerm ? "Try adjusting your search terms" : 
             filter !== 'all' ? `There are no ${filter} events` :
             categoryFilter !== 'all' ? `There are no ${categoryFilter} events` : 
             "No events available"}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">{processedEvents.length} events found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventsGrid;
