import React, { useEffect, useState } from 'react';
import { auth, db } from '@/pages/api/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';
// import EventList from '@/components/EventList';
import Aside from '@/components/Aside';
import Calendar from '@/components/calendar';

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");
  // const [events, setEvents] = useState<Event[]>([]);

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setUsername(user.displayName || "User");
        setEmail(user.email || "");
      } else {
        setCurrentUser(null);
        setUsername("Guest");
        setEmail("");
      }
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="flex min-h-screen">
      <Aside />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {username}</h1>
          <h2 className="text-xl text-gray-600 mt-2">Welcome to your Academix dashboard</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              {/* <h3 className="text-2xl font-bold text-gray-800">Evenimente</h3>
              <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
              <EventList events={todaysEvents} /> */}
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
