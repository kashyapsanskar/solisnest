
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaStar } from "react-icons/fa";

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentProduct, setCurrentProduct] = useState(null);
  const [darkMode, setDarkMode] = useState(false);


  const openModal = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    
    
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/products/public");
        const filteredProducts = response.data.filter(product => product && product.uniqueId);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (product) => {
    console.log("🔹 Buying product:", JSON.stringify(product, null, 2));
    if (typeof product === "string") {
        console.error("❌ Error: Expected an object but received a string!", product);
        alert(`Invalid product data! Received: ${product}`);
        return;
    }

    if (!product || !product.uniqueId) {
        console.error("❌ Error: Product Unique ID is missing!", product);
        alert("Product ID is missing.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ No token found in localStorage.");
            return alert("You must be logged in.");
        }

        console.log("✅ Sending Order Request with data:", {
            productUniqueId: [product.uniqueId],
            status: "Pending",
        });

        const response = await axios.post("http://localhost:5001/api/orders", {
            productUniqueId: [product.uniqueId],
            status: "Pending",
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Order placed successfully:", response.data);
        alert("Order placed successfully!");
    } catch (error) {
        console.error("❌ Error placing order:", error);
        console.error("🔍 Full Server Response:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Order failed. Check console for details.");
    }
  };

  const displayedProducts = selectedProduct ? [selectedProduct] : products.filter(product => product && product.uniqueId);

  return (


<div className="min-h-screen bg-gray-50">
      <Navbar setSelectedProduct={setSelectedProduct} />

      <div className="p-10">
        <h2 className="text-5xl font-extrabold text-center text-gray-800 mb-12 tracking-wide">
          Discover Our Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 shadow-xl rounded-2xl transform transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-indigo-500/50 relative group overflow-hidden cursor-pointer"
              onClick={() => openModal(product)}
            >
                
              <div className="relative overflow-hidden rounded-lg group-hover:scale-110 transition-all duration-300 ease-in-out">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg transition-all duration-500 ease-in-out transform group-hover:scale-110 group-hover:blur-sm group-hover:grayscale"
                />
              </div>

              <h3 className="text-3xl font-bold mt-4 text-gray-900 group-hover:text-indigo-600 transition-all duration-300 tracking-wide">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-3 group-hover:text-gray-800 transition-all duration-300 group-hover:font-semibold">
                {product.description}
              </p>

             
              <div className="flex items-center mt-3 space-x-1">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`text-yellow-400 ${index < product.rating ? "text-yellow-500 animate-pulse" : "text-gray-300"} `}
                  />
                ))}
              </div>

              <div className="mt-4">
                <p className="text-3xl font-semibold text-indigo-600">
                  ${product.price}
                </p>
              </div>
              <div className="social-share-buttons">
  <button onClick={() => window.open('https://twitter.com/intent/tweet?url=' + currentProduct.url)}>
    Share on Twitter
  </button>
</div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuy(product);
                }}
                className="mt-5 w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-600 text-white py-3 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
              >
                <span className="font-semibold">Buy Now</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 sm:w-96 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="w-full h-60 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentProduct.name}</h3>
            <p className="text-gray-600 mb-4">{currentProduct.description}</p>
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`text-yellow-400 ${index < currentProduct.rating ? "text-yellow-500 animate-pulse" : "text-gray-300"} `}
                />
              ))}
            </div>
            
            <p className="text-xl font-semibold text-indigo-600 mb-4">${currentProduct.price}</p>
            <button
              onClick={() => {
                handleBuy(currentProduct);
                closeModal();
              }}
              className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-600 text-white py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <span className="font-semibold">Buy Now</span>
            </button>
    

          </div>
        </div>
      )}
    </div>
  );
};



export default Home;
