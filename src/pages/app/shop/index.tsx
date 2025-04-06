import Aside from '@/components/Aside'
import React from 'react'

const store = () => {
  // Define dummy products data
  const dummyProducts = [
    { id: 1, name: 'Academix T-Shirt', points: 6000 },
    { id: 2, name: 'Academix Phone Case', points: 2000 },
    { id: 3, name: 'Academix Mug', points: 5000 },
    { id: 4, name: 'Academix Mousepad', points: 7500 },
    { id: 5, name: 'Uber Rides eGift Card 50 lei', points: 4500 },
    { id: 6, name: 'Amazon Gift Card', points: 5500 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed width for the sidebar */}
      <div className="w-64 flex-shrink-0">
        <Aside />
      </div>
      
      {/* Main content area with overflow handling */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Search Bar - make it full width of the content area */}
        <div className="mb-8 w-full max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Căutare produse..."
              className="w-full p-4 pl-12 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-sm"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dummyProducts.map(product => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
                <div className="text-emerald-600 font-medium text-center">{product.name}</div>
              </div>
              
              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-center mb-6 text-gray-800">{product.name}</h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-green-600 font-bold text-xl">{product.points} Points</p>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center">
                    Redeem Reward
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default store;