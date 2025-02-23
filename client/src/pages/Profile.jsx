import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F8FC] to-[#E3E6F0] p-6">
        <div className="absolute top-5 right-5">
        <Link to="/" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
          Home
        </Link>
      </div>
     
      <div className="bg-[#F1F3F6] shadow-2xl rounded-2xl p-8 w-96 text-center border border-gray-300">
        <h1 className="text-3xl font-extrabold text-[#4F46E5]">My Profile</h1>
        <p className="text-gray-600 mt-3 text-lg">@{user?.username}</p>
        <p className="text-gray-500">{user?.email}</p>

        
        <div className="mt-6 space-y-4">
          <button
            onClick={() => navigate("/create-listing")}
            className="w-full py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#6B7FFC] to-[#8F9BFF] text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            🚀 Create Listing
          </button>

          <button
            onClick={() => navigate("/my-listings")}
            className="w-full py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#B8BACF] to-[#D0D3E1] text-gray-800 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            📌 Show Listings
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#E6E6EB] to-[#F5F5FA] text-gray-800 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            🛒 My Orders
          </button>

          <button
            onClick={logout}
            className="w-full py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-[#4F46E5] to-[#6A5ACD] text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            🔥 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
