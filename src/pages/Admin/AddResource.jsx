import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaLayerGroup, FaTags, FaImage, FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api'; // Adjust path if needed (e.g. '../../../services/api')
import toast from 'react-hot-toast';

const AddResource = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: '',          // e.g. RES-101
    name: '',        // e.g. Chemistry Lab
    category: 'Academic',
    sub_category: '', // e.g. Classroom
    capacity: '',
    building: '',    // Will go into location.building
    zone: '',        // Will go into location.zone
    floor: '0',      // Will go into location.floor
    features: '',    // Comma separated string
    image: ''        // Single URL for now (or comma separated)
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Construct Payload to match Mongoose Schema
      const payload = {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        sub_category: formData.sub_category,
        capacity: Number(formData.capacity),
        location: {
            zone: formData.zone,
            building: formData.building,
            floor: Number(formData.floor)
        },
        // Convert "AC, Projector" -> ["AC", "Projector"]
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        // Use the input URL or a default placeholder if empty
        images: formData.image ? [formData.image] : ["https://via.placeholder.com/800x600?text=No+Image+Provided"],
        status: "Active"
      };

      // 2. Send to Backend
      const { data } = await api.post('/resources', payload);

      if (data.success) {
          toast.success("Resource created successfully!");
          navigate('/admin'); // Go back to Admin Panel
      }

    } catch (error) {
      console.error("Create Error:", error);
      const msg = error.response?.data?.message || "Failed to create resource";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center">
            <button onClick={() => navigate('/admin')} className="mr-4 text-gray-500 hover:text-blue-600 transition">
                <FaArrowLeft />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Resource</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource ID (Unique)</label>
                        <input 
                            name="id" 
                            type="text" 
                            required 
                            placeholder="e.g. RES-CS-101"
                            value={formData.id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                        <input 
                            name="name" 
                            type="text" 
                            required 
                            placeholder="e.g. Advanced AI Lab"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* 2. Category & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            name="category" 
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="Academic">Academic</option>
                            <option value="Lab">Lab</option>
                            <option value="Sports">Sports</option>
                            <option value="Event">Event</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                        <input 
                            name="sub_category" 
                            type="text" 
                            placeholder="e.g. Computer Lab"
                            value={formData.sub_category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input 
                            name="capacity" 
                            type="number" 
                            required 
                            min="1"
                            placeholder="30"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* 3. Location */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <FaBuilding className="mr-2" /> Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <input 
                                name="building" 
                                type="text" 
                                required 
                                placeholder="Building Name"
                                value={formData.building}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <input 
                                name="zone" 
                                type="text" 
                                required 
                                placeholder="Zone (e.g. North)"
                                value={formData.zone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <input 
                                name="floor" 
                                type="number" 
                                placeholder="Floor No."
                                value={formData.floor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Features & Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                        <FaTags className="mr-2 text-gray-400" /> Amenities / Features
                    </label>
                    <textarea 
                        name="features" 
                        rows="2" 
                        placeholder="Comma separated: Projector, AC, Smart Board, WiFi"
                        value={formData.features}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                        <FaImage className="mr-2 text-gray-400" /> Image URL
                    </label>
                    <input 
                        name="image" 
                        type="url" 
                        placeholder="https://images.pexels.com/..."
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste a direct image link from Pexels or Unsplash.</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 px-6 rounded-lg text-white font-bold shadow-md transition
                            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}
                        `}
                    >
                        {loading ? 'Creating Resource...' : 'Add Resource'}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default AddResource;