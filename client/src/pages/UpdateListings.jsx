

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const UpdateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", description: "", price: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 Received ID from URL params:", id);

    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        console.log("📡 Fetching product from API...");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`, { 
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ API Response:", response.data);

        setFormData({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
        });

        setPreview(response.data.image?.[0]?.url || null);
      } catch (error) {
        console.error("❌ Error fetching listing:", error);
        setError(error.response?.data?.message || "Failed to fetch listing details.");
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit triggered!");
    setLoading(true);
    setError(null);
  
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }
  
    console.log("📤 Sending update request for ID:", id);
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    if (image) formDataToSend.append("image", image);
    console.log("📤 Data being sent:", formData);
    console.log("📤 Sending PUT request to:", `${import.meta.env.VITE_API_URL}/api/products/${id}`);
    
    console.log(`📤 Sending PUT request to: ${import.meta.env.VITE_API_URL}/api/products/${id}`);
    console.log("📦 Payload:", Object.fromEntries(formDataToSend.entries()));
  
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
  
      console.log("✅ Updated Product Response:", response.data);
  
      setFormData({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
      });
      console.log(response.data);
  
      alert("Listing updated successfully!");
  
     
      navigate("/my-listings", { replace: true });
  
    } catch (error) {
      console.error("❌ Error updating listing:", error);
      setError(error.response?.data?.message || error.message|| "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Update Listing</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
          <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />

          <label className="w-full border rounded-lg flex items-center justify-center cursor-pointer bg-gray-200 p-4 mb-2">
            {preview ? <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-md" /> : <div className="flex flex-col items-center"><FaPlus className="text-gray-600 text-2xl" /><span className="text-sm text-gray-600">Upload Image</span></div>}
            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          <button type="submit" onClick={() => console.log("🖱️ Button clicked!")} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50" disabled={loading}>
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateListing;
