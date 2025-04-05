import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - you already have this part */}
      <div className="bg-green-700 min-h-screen w-80 p-4 text-white">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <div className="absolute font-bold text-xs flex flex-col h-full w-full">
                <div className="h-1/2 flex items-center justify-center">0</div>
                <div className="h-1/2 flex items-center justify-center">1</div>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold">Academix</h1>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {/* Dashboard Item */}
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-green-700 hover:bg-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>
          {/* Profile Item */}
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Profil</span>
          </a>
          
          {/* Games Item */}
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className="font-medium">Jocuri</span>
          </a>
          
          {/* Account Item */}
          <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="font-medium">Ieși din cont</span>
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Salut, Muntianu Cristian</h1>
          <h2 className="text-xl text-gray-600 mt-2">Dashboard</h2>
          <p className="text-gray-500 mt-1"></p>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Evenimente</h3>
              <p className="text-gray-500">5 aprilie 2025</p>
            </div>
          </div>
        </div>
        </div>
      </div>
  )
}

export default Dashboard