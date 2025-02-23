import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found! User is not authenticated.");
          return;
        }

        const response = await axios.get("http://localhost:5001/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-white min-h-screen p-6">
        <div className="absolute top-5 right-5">
        <Link to="/" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
          Home
        </Link>
      </div>
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Your Orders</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white text-blue-600 p-4 shadow-lg rounded-xl border border-blue-200 transition duration-300 hover:shadow-xl"
            >
              {order.productImage ? (
                <img
                  src={order.productImage}
                  alt={order.productName || "Product"}
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              <h3 className="text-xl font-bold mt-3">{order.productName || "Unnamed Product"}</h3>
              <p className="text-indigo-500/80">{order.productDescription || "No description available"}</p>
              <p className="text-lg font-semibold mt-2">Price: ${order.productPrice || "N/A"}</p>
              <p className="text-indigo-500/80">Status: {order.status || "Unknown"}</p>
              <p className="text-sm text-indigo-400/70">Email: {order.buyerEmail || "Not provided"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
