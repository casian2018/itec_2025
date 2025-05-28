import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '@/pages/api/firebase/firebase';
import Aside from '@/components/Aside';
import Calendar from '@/components/calendar';
import EventList from '@/components/EventList';
import { collection, getDocs } from 'firebase/firestore';

const checkAuth = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(!!user);
    });
  });
};

interface Event {
  id: string;
  title: string;
  date: string; // format: YYYY-MM-DD
  description: string;
}

const Dashboard = () => {
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const router = useRouter();
  const today = new Date().toISOString()
  .split('.')[0];
  const [events, setEvents] = useState<Event[]>([]);
        console.log(today);

  useEffect(() => {
    const authenticate = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push('/auth/login'); // Redirect to login page if not authenticated
      } else {
        const user = auth.currentUser;
        setUsername(user?.displayName || "User");
        setEmail(user?.email || "");
      }
    };

    authenticate();
  }, [router]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollection);
        const eventsList = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[];
        setEvents(eventsList.filter(event => new Date(event.date) >= new Date(today)));
        console.log("Fetched events:", eventsList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const displayedEvents = () => {
    if (events.length <= 4 || showAllEvents) {
      return events;
    }
    // return events.filter(event => event.date >= today).slice(0, 4);

    return events.slice(0, 4);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-green-50">
      <Aside />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto ml-48">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-600 h-3"></div>
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-serif text-green-800 mb-1">Welcome, {username}</h1>
              <p className="text-gray-600">{email}</p>
            </div>
            <div className="mt-4 md:mt-0 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
            <div className="bg-gradient-to-r from-green-800 to-green-700 py-3 px-6">
              <h2 className="text-xl text-white font-serif">Academic Calendar</h2>
            </div>
            <div className="p-4 flex-grow overflow-auto">
              <Calendar />
            </div>
          </div>

          {/* Events Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
            <div className="bg-gradient-to-r from-green-800 to-green-700 py-3 px-6 flex justify-between items-center">
              <h2 className="text-xl text-white font-serif">Upcoming Events</h2>
              <span className="text-green-100 text-sm">{events.length} total</span>
            </div>
            <div className="p-4 flex-grow overflow-auto">
              {events.length > 0 ? (
                <div className="space-y-3">
                  <div className="space-y-3">
                    {displayedEvents().map(event => (
                      <div key={event.id} className="p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors">
                        <h3 className="font-medium text-green-800">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        <p className="text-xs mt-2 text-green-700">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {events.length > 4 && (
                    <div className="pt-2 text-center">
                      <button 
                        onClick={() => setShowAllEvents(!showAllEvents)}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        {showAllEvents ? 'Show Less' : `Show All (${events.length})`}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-green-50 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-green-700">No upcoming events</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mt-8">
          <h3 className="text-xl text-green-800 font-serif mb-4 pl-2 border-l-4 border-green-700">Quick Resources</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Library', icon: '📚', color: 'bg-amber-50 border-amber-200 text-amber-800' },
              { title: 'Academic Support', icon: '🎓', color: 'bg-green-50 border-green-200 text-green-800' },
              { title: 'Student Portal', icon: '🏛️', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { title: 'Research Database', icon: '🔍', color: 'bg-teal-50 border-teal-200 text-teal-800' }
            ].map((item) => (
              <div 
                key={item.title} 
                className={`${item.color} border p-6 rounded-xl cursor-pointer transition-transform hover:shadow-md hover:-translate-y-1`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-medium">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-800 to-green-700 py-4 px-6">
            <h2 className="text-xl text-white font-serif">Recent Announcements</h2>
          </div>
          <div className="p-6">
            <div className="border-l-4 border-amber-500 pl-4 py-2 mb-4">
              <h3 className="font-medium text-lg">Fall Semester Registration</h3>
              <p className="text-gray-600">Registration for fall semester courses is now open until August 30th.</p>
              <p className="text-xs text-gray-500 mt-2">Posted: July 15, 2023</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="font-medium text-lg">Library Hours Extended</h3>
              <p className="text-gray-600">The main library will remain open until midnight during finals week.</p>
              <p className="text-xs text-gray-500 mt-2">Posted: July 10, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
