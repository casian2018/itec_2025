import Aside from '@/components/Aside'
import React from 'react'
import { useRouter } from 'next/router'

const ProductPage = () => {
  const router = useRouter()
  const { id } = router.query

  // Product data
  const product = {
    id: 1,
    name: 'Uber Rides eGift Card 50 lei',
    points: 13440,
    description: `To activate an Uber voucher, the participant must have an active account. The voucher can only be used for Uber rides. Uber e-vouchers can be used for personal purposes only by the recipient of such an Uber voucher and cannot be resold or used for any marketing, advertising, promotional, or other types of commercial activities.`,
    terms: [
        "Each voucher code can be used only once",

        "Validity: at least 2 months",
        
        "Cannot be refunded or exchanged",
        
        "No cash change will be given",
        
        "Lost, stolen, or expired vouchers will not be replaced",
    ],
    image: '/images/uber-giftcard.jpg'
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-white bg-white">
        <Aside />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto bg-white p-6">
        {/* Back button */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-green-600 hover:text-green-800"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to store
        </button>

        {/* Product container */}
        <div className="mx-auto w-5-4xl rounded-lg bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Image section - fixed width */}
            <div className="md:w-2/5 p-6 flex items-center justify-center bg-gray-100 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="relative h-64 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/images/placeholder.jpg'
                    e.target.className = "h-full w-full object-contain p-4"
                  }}
                />
              </div>
            </div>

            {/* Content section */}
            <div className="md:w-3/5 p-6">
              <h1 className="mb-4 text-2xl font-bold text-gray-800">{product.name}</h1>
              
              {/* Option selector */}
              <div className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">SELECT AN OPTION</h2>
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-emerald-50 p-3">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-emerald-600">›</span>
                </div>
              </div>

              {/* Points and button */}
              <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-2xl font-bold text-green-600">{product.points.toLocaleString()} points</p>
                <button className="whitespace-nowrap rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 transition-colors">
                  REDEEM
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">DESCRIPTION</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Terms */}
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">TERMS AND CONDITIONS</h2>
                <ul className="text-gray-700">
                  {product.terms.map((term, index) => (
                    <li key={index} className="mb-1 flex">
                      <span className="mr-2 text-emerald-500">•</span>
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage