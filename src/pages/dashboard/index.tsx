import Aside from '@/components/Aside'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">

      <Aside />
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