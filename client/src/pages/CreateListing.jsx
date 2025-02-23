import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa"; 
import { Link } from "react-router-dom";

const CreateListing = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

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

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("image", image);

    try {
      const response = await axios.post("http://localhost:5001/api/products", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Listing created successfully!");
      navigate("/my-listings");
    } catch (error) {
      console.error("Error creating listing:", error.response?.data || error);
      alert(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="absolute top-5 right-5">
        <Link to="/" className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300">
          Home
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create Listing</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="name" placeholder="Product Name" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
          <input type="text" name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
          <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full p-2 border rounded mb-2" required />

        
          <label className="w-full border rounded-lg flex items-center justify-center cursor-pointer bg-gray-200 p-4 mb-2">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
            ) : (
              <div className="flex flex-col items-center">
                <FaPlus className="text-gray-600 text-2xl" />
                <span className="text-sm text-gray-600">Upload Image</span>
              </div>
            )}
            <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600">
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
