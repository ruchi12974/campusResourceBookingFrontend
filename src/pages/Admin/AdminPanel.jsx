import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaBuilding, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/common/ConfirmationModal'; // <--- Import the new Modal

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MODAL STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'resources') {
        const { data } = await api.get('/resources');
        // Handle varied backend responses: { resources: [] } vs { success: true, resources: [] }
        const list = data.resources || data; 
        setData(Array.isArray(list) ? list : []);
      } else {
        const { data } = await api.get('/bookings');
        const list = data.bookings || [];
        setData(list);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. DELETE LOGIC HANDLERS ---
  
  // Step A: User clicks Trash icon -> Open Modal
  const openDeleteModal = (id) => {
    setResourceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Step B: User clicks "Yes, Delete" in Modal
  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    
    setIsDeleting(true);
    try {
        const response = await api.delete(`/resources/${resourceToDelete}`);
        
        // Check axios response 
        if (response.status === 200 || response.data?.success) {
            toast.success("Resource deleted successfully");
            
            // --- OPTIMISTIC UI UPDATE ---
            // Remove item from state immediately so it disappears visually
            setData((prevData) => prevData.filter(item => item._id !== resourceToDelete));
            
            setIsDeleteModalOpen(false); // Close Modal
        }
    } catch (error) {
        console.error("Delete failed", error);
        const msg = error.response?.data?.message || "Failed to delete resource";
        toast.error(msg);
    } finally {
        setIsDeleting(false);
        setResourceToDelete(null); // Cleanup
    }
  };

  // --- 3. FILTERING ---
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'resources') {
        return (item.name?.toLowerCase() || '').includes(term) || 
               (item._id?.toString() || '').toLowerCase().includes(term);
    } else {
        return (item.resource_snapshot?.name?.toLowerCase() || '').includes(term) || 
               (item.user_snapshot?.name?.toLowerCase() || '').includes(term);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                <p className="text-gray-500 mt-1">Manage facilities and oversee campus bookings.</p>
            </div>
            {activeTab === 'resources' && (
                <Link to="/admin/add-resource" className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center shadow-lg transition">
                    <FaPlus className="mr-2" /> Add New Resource
                </Link>
            )}
        </div>

        {/* TABS & SEARCH */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setActiveTab('resources')} className={`px-6 py-2 rounded-md text-sm font-bold transition ${activeTab === 'resources' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <FaBuilding className="inline mr-2" /> Resources
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`px-6 py-2 rounded-md text-sm font-bold transition ${activeTab === 'bookings' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <FaCalendarAlt className="inline mr-2" /> All Bookings
                </button>
            </div>
            <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
            <div className="text-center py-20 text-gray-500">Loading Admin Data...</div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                            <tr>
                                {activeTab === 'resources' ? (
                                    <>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3">Booked By</th>
                                        <th className="px-6 py-3">Resource</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Purpose</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition">
                                        {activeTab === 'resources' ? (
                                            <>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">{item._id}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">{item.category}</span></td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-3">
                                                    <Link to={`/admin/edit-resource/${item._id}`} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition" title="Edit"><FaEdit /></Link>
                                                    
                                                    {/* TRIGGER MODAL HERE */}
                                                    <button 
                                                        onClick={() => openDeleteModal(item._id)} 
                                                        className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full hover:bg-red-100 transition" 
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            /* BOOKING ROWS (No changes needed here) */
                                            <>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">{item.user_snapshot?.name || 'User'}</p>
                                                    <p className="text-xs text-gray-500">{item.user_snapshot?.role}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-700">{item.resource_snapshot?.name || 'Resource'}</td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{item.start_time ? new Date(item.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''} - {item.end_time ? new Date(item.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                                                </td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Confirmed' ? 'bg-green-100 text-green-700' : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></td>
                                                <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{item.purpose}</td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- CONFIRMATION MODAL --- */}
        <ConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            title="Delete Resource"
            message="Are you sure you want to delete this resource? This action cannot be undone."
            isLoading={isDeleting}
        />

      </div>
    </div>
  );
};

export default AdminPanel;