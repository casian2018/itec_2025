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

const Dashboard = () => {
  const [username, setUsername] = useState<string>("User");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const [events, setEvents] = useState<Event[]>([]);

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


 interface Event {
   id: string;
   title: string;
   date: string; // format: YYYY-MM-DD
   description: string;
 }

   useEffect(() => {
      const fetchEvents = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "events"));
          const fetchedEvents: Event[] = [];
  
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedEvents.push({
              id: doc.id,
              title: data.title,
              date: data.date,
              description: data.description,
            });
          });
  
          setEvents(fetchedEvents);
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
      };
  
      fetchEvents();
    }, []);
  
    const todaysEvents = events.filter((event) => event.date === today);


 return(
    <div className="flex min-h-screen">
      <Aside />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {username}</h1>
          <h2 className="text-xl text-gray-600 mt-2">Welcome to your Academix dashboard</h2>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">

            <div>
              <h3 className="text-2xl font-bold text-gray-800">Today's events</h3>
              <p className="text-gray-500 mb-4">{new Date().toLocaleDateString()}</p>
              <EventList events={todaysEvents} /> 

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
