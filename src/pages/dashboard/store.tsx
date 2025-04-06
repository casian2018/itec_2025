import { useEffect, useState } from "react";
import { db, auth } from "@/pages/api/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import Aside from "@/components/Aside";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface RedeemModalProps {
  product: Product;
  onClose: () => void;
  userPoints: number;
  updateUserPoints: (points: number) => void;
}

function RedeemModal({
  product,
  onClose,
  userPoints,
  updateUserPoints,
}: RedeemModalProps) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRedeem = async () => {
    const { name, address, phone, email } = form;

    if (!name || !address || !phone || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (userPoints < product.price) {
      alert("You do not have enough points to redeem this product.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productName: product.name,
        ...form,
        redeemedAt: new Date(),
      });

      const newPoints = userPoints - product.price;
      await updateUserPoints(newPoints);
      alert("Redeem request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending redeem request:", error);
      alert("Failed to send redeem request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 relative">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Redeem: {product.name}</h2>
        <p className="text-gray-600 mb-6">You have <span className="font-semibold">{userPoints}</span> points</p>
        <div className="space-y-4">
          {["name", "address", "phone", "email"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{field}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeem}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Redeem"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StoreWithRedeem() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userDocId, setUserDocId] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

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
        const userSnapshot = await getDocs(query(collection(db, "users"), where("__name__", "==", uid)));

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          setUserPoints(userData.points || 0);
          setUserDocId(userDoc.id);
        } else {
          console.error("User not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      }
    };

    fetchProducts();
    fetchUserPoints();
  }, []);

  const updateUserPoints = async (newPoints: number) => {
    try {
      if (!userDocId) return;
      const userDocRef = doc(db, "users", userDocId);
      await updateDoc(userDocRef, { points: newPoints });
      setUserPoints(newPoints);
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  };

  return (
    <div className="flex">
      <Aside />
      <main className="flex-1 p-6 ml-48">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Store</h1>
        <p className="text-lg text-gray-700 mb-6">Your current balance: <span className="font-semibold">{userPoints} points</span></p>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-5 flex flex-col justify-between"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                <p className="text-green-700 font-bold mt-2 text-md">{product.price} points</p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={userPoints < product.price}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all ${
                    userPoints < product.price
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {userPoints < product.price ? "Not Enough Points" : "Redeem"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available.</p>
        )}
      </main>

      {selectedProduct && (
        <RedeemModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          userPoints={userPoints}
          updateUserPoints={updateUserPoints}
        />
      )}
    </div>
  );
}

export default StoreWithRedeem;
