import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import api from '../services/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(''); // e.g. "name-asc"
  
  const [filters, setFilters] = useState({
    category: [],
    building: [],
    minCapacity: 0,
    features: []
  });

  // --- 1. DYNAMIC FETCHING LOGIC ---
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        let endpoint = '/resources';
        let params = {};

        // PRIORITY 1: SEARCH (If user types, we use search endpoint)
        if (searchTerm.trim().length > 0) {
            endpoint = '/resources/search';
            params.query = searchTerm;
        } 
        
        else if (filters.category.length > 0 || filters.building.length > 0 || filters.minCapacity > 0) {
            endpoint = '/resources/filter';
            if(filters.category.length) params.type = filters.category[0]; 
            if(filters.building.length) params.building = filters.building[0];
            if(filters.minCapacity > 0) params.minCapacity = filters.minCapacity;
            if(filters.status) params.status = "Active"; // Default to active
        }
        // PRIORITY 3: SORT (If no search/filter, check sort)
        else if (sortOption) {
            endpoint = '/resources/sort';
            const [by, order] = sortOption.split('-'); // e.g. "name-asc" -> by="name", order="asc"
            params.by = by;
            params.order = order;
        }

        // --- API CALL ---
        const { data } = await api.get(endpoint, { params });

        if (data.success) {
            setResources(data.resources || []);
        } else {
            setResources([]);
        }

      } catch (error) {
        console.error("Fetch error:", error);
        setResources([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to prevent too many API calls
    const timeoutId = setTimeout(() => {
        fetchResources();
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [searchTerm, filters, sortOption]); // Re-run when any of these change

  // --- HANDLERS ---
  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
        const current = prev[type];
        // Toggle logic
        const updated = current.includes(value) 
            ? current.filter(item => item !== value)
            : [...current, value];
        return { ...prev, [type]: updated };
    });
  };

  const uniqueBuildings = ["LHC Block", "CSE Dept", "Sports Complex", "Science Block", "Innovation Center"];
  const allFeatures = ["Projector", "AC", "Smart Board", "WiFi", "Computers"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Mobile Search */}
      <div className="md:hidden p-4 bg-white shadow-sm">
        <input 
             type="text" 
             placeholder="Search..." 
             className="w-full px-4 py-2 border rounded-lg"
             onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                
                {/* Search */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search</h3>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Find a room..." 
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</h3>
                    <select 
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Default</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="capacity-asc">Capacity (Low to High)</option>
                        <option value="capacity-desc">Capacity (High to Low)</option>
                    </select>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h3>
                    <div className="space-y-2">
                        {["Academic", "Lab", "Sports", "Event"].map(cat => (
                            <label key={cat} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                                <input 
                                    type="checkbox" 
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={filters.category.includes(cat)}
                                    onChange={() => handleCheckboxChange('category', cat)}
                                />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Capacity */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Min Capacity: {filters.minCapacity}
                    </h3>
                    <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        step="10" 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        value={filters.minCapacity}
                        onChange={(e) => setFilters({...filters, minCapacity: Number(e.target.value)})}
                    />
                </div>

                {/* Buildings */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Building</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {uniqueBuildings.map(bldg => (
                            <label key={bldg} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                                <input 
                                    type="checkbox" 
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={filters.building.includes(bldg)}
                                    onChange={() => handleCheckboxChange('building', bldg)}
                                />
                                <span className="truncate">{bldg}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Features / Amenities */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amenities</h3>
                    <div className="space-y-2">
                        {allFeatures.map(feat => (
                            <label key={feat} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                                <input 
                                    type="checkbox" 
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={filters.features?.includes(feat)}
                                    onChange={() => handleCheckboxChange('features', feat)}
                                />
                                <span className="truncate">{feat}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </aside>

        {/* --- RIGHT SIDE: RESULTS --- */}
        <main className="flex-1">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Resources</h2>
                <p className="text-gray-500 text-sm">Found {resources.length} results</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400 animate-pulse">Loading resources...</div>
            ) : resources.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center border border-gray-100">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900">No matches found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
                    <button 
                        onClick={() => {
                            setFilters({ category: [], building: [], minCapacity: 0 });
                            setSearchTerm('');
                            setSortOption('');
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {resources.map((resource) => (
                        <Link 
                            to={`/resources/${resource._id}`} 
                            key={resource._id}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden"
                        >
                            {/* Image Area */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img 
                                    src={resource.images && resource.images.length > 0 ? resource.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
                                    alt={resource.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded text-gray-700 shadow-sm uppercase tracking-wide">
                                    {resource.category}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition truncate text-lg">
                                        {resource.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">{resource.sub_category || 'General'}</p>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-blue-400 shrink-0" />
                                        <span className="truncate">
                                            {resource.location?.building || 'Unknown'}, {resource.location?.room_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <FaUsers className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                                        <span>Capacity: {resource.capacity}</span>
                                    </div>
                                </div>

                                {/* Features Tags */}
                                <div className="flex flex-wrap gap-1 mt-auto">
                                    {(resource.features || []).slice(0, 3).map((feature, i) => (
                                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
                                            {feature}
                                        </span>
                                    ))}
                                    {(resource.features || []).length > 3 && (
                                        <span className="text-[10px] text-gray-400 px-1 py-1">
                                            +{(resource.features || []).length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Resources;