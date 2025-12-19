import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBuilding, FaTags, FaImage, FaArrowLeft, FaSave } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

const UpdateResource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Academic',
    sub_category: '',
    capacity: '',
    building: '',
    zone: '',
    floor: '',
    features: '',
    image: '',
    status: 'Active'
  });

  // --- 1. FETCH EXISTING DATA ---
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await api.get(`/resources/${id}`);
        const res = data.resource ;

        if (res) {
            setFormData({
                name: res.name || '',
                category: res.category || 'Academic',
                sub_category: res.sub_category || '',
                capacity: res.capacity || '',
                building: res.location?.building || '',
                zone: res.location?.zone || '',
                floor: res.location?.floor || 0,
                features: res.features?.join(', ') || '',
                image: res.images?.[0] || '',
                status: res.status || 'Active'
            });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load resource details.");
        navigate('/admin'); 
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id, navigate]);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. SUBMIT UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      
      const payload = {
        name: formData.name,
        category: formData.category,
        sub_category: formData.sub_category,
        capacity: Number(formData.capacity),
        // Re-nest the location data
        location: {
            zone: formData.zone,
            building: formData.building,
            floor: Number(formData.floor)
        },
        
        features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
        
        images: formData.image ? [formData.image] : [],
        status: formData.status
      };

      // SEND REQUEST
      await api.put(`/resources/${id}/update`, payload);

      toast.success("Resource updated successfully!");
      navigate('/admin'); // Go back to dashboard

    } catch (error) {
      console.error("Update Error:", error);
      const msg = error.response?.data?.message || "Failed to update resource";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Loading Resource Data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center">
            <button 
                onClick={() => navigate('/admin')} 
                className="mr-4 text-gray-500 hover:text-blue-600 transition p-2 rounded-full hover:bg-gray-100"
            >
                <FaArrowLeft />
            </button>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Resource</h1>
                <p className="text-sm text-gray-500">Updating ID: <span className="font-mono">{id}</span></p>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                        <input 
                            name="name" type="text" required 
                            value={formData.name} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            name="status" 
                            value={formData.status} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                        >
                            <option value="Active">Active</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="InActive">InActive</option>
                        </select>
                    </div>
                </div>

                {/* 2. Category & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
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
                            name="sub_category" type="text" 
                            value={formData.sub_category} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <input 
                            name="capacity" type="number" required min="1"
                            value={formData.capacity} onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* 3. Location (Nested Data Flattened for UI) */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center">
                        <FaBuilding className="mr-2 text-blue-500" /> Location Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Building</label>
                            <input name="building" required placeholder="e.g. LHC" value={formData.building} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Zone</label>
                            <input name="zone" required placeholder="e.g. North" value={formData.zone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Floor</label>
                            <input name="floor" type="number" placeholder="0" value={formData.floor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 outline-none" />
                        </div>
                    </div>
                </div>

                {/* 4. Features & Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                        <FaTags className="mr-2 text-gray-400" /> Amenities (comma separated)
                    </label>
                    <textarea 
                        name="features" 
                        rows="2" 
                        value={formData.features} 
                        onChange={handleChange} 
                        placeholder="Projector, AC, Smartboard..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
                        <FaImage className="mr-2 text-gray-400" /> Image URL
                    </label>
                    <input 
                        name="image" 
                        type="url" 
                        value={formData.image} 
                        onChange={handleChange} 
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    />
                </div>

                {/* Submit */}
                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={saving} 
                        className={`flex items-center px-8 py-3 rounded-lg text-white font-bold shadow-md transition transform hover:-translate-y-0.5 
                            ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
                    >
                        <FaSave className="mr-2" /> 
                        {saving ? 'Updating...' : 'Save Changes'}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateResource;