import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Link } from "react-router-dom";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5001/api/products", {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setListings(response.data);
      } catch (error) {
        console.error("Error fetching listings:", error.response?.data || error);
      }
    };

    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error("Error deleting listing:", error.response?.data || error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-listing/${id}`); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="absolute top-5 right-5">
        <Link to="/" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
          Home
        </Link>
      </div>
      <h2 className="text-4xl font-bold text-indigo-600 bg-white px-6 py-3 rounded-lg shadow-md">
        My Listings
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full max-w-7xl mt-6">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-200"
          >
            <div className="w-40 h-40 flex justify-center items-center bg-gray-200 rounded-md overflow-hidden">
              <img
                src={listing.image?.[0]?.url || "/placeholder-image.jpg"}
                alt={listing.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-3 text-center">{listing.name}</h3>
            <p className="text-gray-600 text-sm text-center">{listing.description}</p>
            <p className="text-indigo-600 font-bold mt-2 text-center">${listing.price}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(listing.id)} 
                className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-white hover:text-indigo-600 border border-indigo-600 transition-all w-1/2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(listing.id)}
                disabled={deletingId === listing.id}
                className={`px-3 py-1 rounded-md transition-all w-1/2 ml-2 border border-indigo-600 ${
                  deletingId === listing.id
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-white text-indigo-600 hover:bg-red-500 hover:text-white"
                }`}
              >
                {deletingId === listing.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
