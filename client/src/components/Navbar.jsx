import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import axios from "axios";

const Navbar = ({ setSelectedProduct }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/products/search?q=${query}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product); // Update selected product state in Homepage
    setSearchQuery(""); // Clear search box
    setSearchResults([]); // Hide search results
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
    <Link
  to="/"
  className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
  onClick={() => setSelectedProduct(null)} // Reset selected product
>
  SolisNest
</Link>

    {/* Search Box */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchQuery && (
        <div className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-y-auto rounded-md shadow-lg z-10">
          {loading ? (
            <p className="p-2 text-gray-500">Loading...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectProduct(product)}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded-md"
                  />
                )}
                <span>{product.name}</span>
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500">No product found</p>
          )}
        </div>
      )}
    </div>
  
    <div className="space-x-4">
      <Link to="/about" className="text-gray-600 hover:text-gray-900">
        About
      </Link>
  
      {user ? (
        <>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>
          <button
            onClick={logout}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/register" className="text-gray-600 hover:text-gray-900">
            Register
          </Link>
          <Link
            to="/login"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Login
          </Link>
        </>
      )}
    </div>
  </nav>
  
  );
};

export default Navbar;
