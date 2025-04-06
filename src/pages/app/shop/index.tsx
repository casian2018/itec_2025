import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "@/pages/api/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Aside from "@/components/Aside";

const Store = () => {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingPoints, setLoadingPoints] = useState<boolean>(true);

  // Define dummy products data with images
  const dummyProducts = [
    {
      id: 1,
      name: "Academix T-Shirt",
      points: 6000,
      image: "/products/tshirt.jpg",
    },
    {
      id: 2,
      name: "Academix Phone Case",
      points: 2000,
      image: "/products/case.jpg",
    },
    { id: 3, name: "Academix Mug", points: 5000, image: "/products/mug.jpg" },
    {
      id: 4,
      name: "Academix Mousepad",
      points: 7500,
      image: "/products/mousepad.jpg",
    },
    {
      id: 5,
      name: "Uber Rides eGift Card 50 lei",
      points: 4500,
      image: "/products/case2.jpg",
    },
    {
      id: 6,
      name: "Amazon Gift Card",
      points: 5500,
      image: "/products/mug2.jpg",
    },
  ];

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch user points from Firebase
  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
          const [key, value] = cookie.split("=");
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        const uid = cookies["uid"];
        if (!uid) {
          console.error("No UID found in cookies.");
          return;
        }

        const userDocRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserPoints(userData.points || 0);
        } else {
          console.error("User not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      } finally {
        setLoadingPoints(false);
      }
    };

    fetchUserPoints();
  }, []);

  // Handle redeem button click
  interface Product {
    id: number;
    name: string;
    points: number;
    image: string;
  }

  const handleRedeem = (product: Product): void => {
    if (userPoints >= product.points) {
      setSelectedProduct(product);
    } else {
      alert("You do not have enough points to redeem this reward.");
    }
  };

  // Confirm redemption
  const confirmRedemption = () => {
    if (selectedProduct) {
      setUserPoints((prevPoints) => prevPoints - selectedProduct.points);
      alert(`You have successfully redeemed ${selectedProduct.name}!`);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed width for the sidebar */}
      <div className="w-64 flex-shrink-0">
        <Aside />
      </div>

      {/* Main content area with overflow handling */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* User Points */}
        <div className="mb-8 text-center">
          {loadingPoints ? (
            <h2 className="text-2xl font-bold text-gray-800">
              Loading your points...
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-gray-800">
              Your Points: {userPoints}
            </h2>
          )}
        </div>

        {/* Search Bar */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dummyProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-lg text-center mb-6 text-gray-800">
                  {product.name}
                </h3>

                <div className="flex flex-col items-center space-y-4">
                  <p className="text-green-600 font-bold text-xl">
                    {product.points} Points
                  </p>
                  <button
                    onClick={() => handleRedeem(product)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center"
                  >
                    Redeem Reward
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Redemption</h3>
            <p className="mb-6">
              Are you sure you want to redeem{" "}
              <strong>{selectedProduct.name}</strong> for{" "}
              <strong>{selectedProduct.points} points</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedemption}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
