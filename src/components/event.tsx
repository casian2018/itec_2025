import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/pages/api/firebase/firebase'; // Make sure to configure Firebase and export `db` from your firebase config file

interface Event {
    id: string;
    title: string;
    date: string;
    description: string;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                const eventsData: Event[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Event[];
                setEvents(eventsData);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <div>Loading events...</div>;
    }

    return (
        <div className='mt-18'>
            <h1 className='text-3xl font-extrabold mb-6 text-gray-800'>Upcoming Events</h1>
            <div className='flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
            {events.map(event => (
                <div
                key={event.id}
                className='min-w-[320px] bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-xl p-6 border border-gray-300 hover:shadow-xl transition-shadow duration-300'
                >
                <h2 className='text-xl font-bold text-gray-900'>{event.title}</h2>
                <p className='text-sm text-gray-600 italic'>{new Date(event.date).toLocaleDateString()}</p>
                <p className='mt-4 text-gray-700 leading-relaxed'>{event.description}</p>
                </div>
            ))}
            </div>
        </div>
    );
};

export default EventList;