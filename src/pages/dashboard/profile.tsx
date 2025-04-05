import React, { useEffect, useState } from 'react'
import { auth } from '@/pages/api/firebase/firebase';
import { User } from 'firebase/auth';
import Aside from '@/components/Aside';


const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string>("User");
    const [email, setEmail] = useState<string>("");
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
          console.log(user);
          setUsername(user.displayName || "User");
          setEmail(user.email || "");
        } else {
          setCurrentUser(null);
          setUsername("Guest");
          setEmail("");
        }
      });
  
      return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

  return (
    <div className="flex min-h-screen">
      <Aside />
      {/* Profile Content - left section */}
      <div className="w-1/2 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CoderDojo Timișoara</h1>
          <h2 className="text-xl text-gray-600 mt-2">Dashboard</h2>
          <p className="text-gray-500 mt-1">CoderDojo @Hartle Group - Seria 3.2</p>
          <p className="text-gray-500">Web Development Avansat</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profilul tău, Cristian</h1>
          <p className="text-gray-600 mb-6">Aici poți vedea informațiile despre tine.</p>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Informații personale</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 font-medium">Nume:</p>
                <p className="text-gray-800">{username}</p>
                <p className="text-gray-800">Muntianu</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Telefon:</p>
                <p className="text-gray-800">0787747514</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Data nașterii:</p>
                <p className="text-gray-800">20.02.2007</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Laptop:</p>
                <p className="text-gray-800">Da</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Probleme de sănătate:</p>
                <p className="text-gray-800">Necunoscut</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 font-medium">Email:</p>
                <p className="text-gray-800">cristian.muntianu07@gmail.com</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Parolă:</p>
                <p className="text-blue-500 hover:underline cursor-pointer">Schimbă parola</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Școală:</p>
                <p className="text-gray-800">Colegiul</p>
                <p className="text-gray-800">Economic „F.S.</p>
                <p className="text-gray-800">Nitti”</p>
              </div>
              <div>
                <p className="text-gray-500 font-medium">Roles:</p>
                <p className="text-gray-800">User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty div - right section */}
      <div className="w-1/2 p-8 bg-gray-50">
        {/* This space is intentionally left empty */}
      </div>
    </div>


      )
      }
      export default Dashboard