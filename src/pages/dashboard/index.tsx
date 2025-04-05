import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/pages/api/firebase/firebase';
import Aside from '@/components/Aside';
import Calendar from '@/components/calendar';

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
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
