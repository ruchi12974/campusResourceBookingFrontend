import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaHistory, FaUser, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../components/common/ConfirmationModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Cancellation
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // --- 1. FETCH BOOKINGS ---
  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      
      const { data } = await api.get(`/bookings/user/${user.id}`);
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Fetch bookings failed", error);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  // --- 2. CANCEL HANDLERS ---
  const openCancelModal = (id) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
        const { data } = await api.put(`/bookings/${bookingToCancel}/cancel`);
        if (data.success) {
            toast.success("Booking cancelled successfully");
            
            setBookings(prev => prev.map(b => 
                b._id === bookingToCancel ? { ...b, status: "Cancelled" } : b
            ));
            setIsCancelModalOpen(false);
        }
    } catch (error) {
        console.error("Cancel failed", error);
        toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
        setIsCancelling(false);
    }
  };

  if (!user) return <div className="text-center py-20">Please log in to view dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-blue-600">{user.full_name || 'User'}</span></p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100">
                {user.role || 'Student'} Account
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Quick Stats / Profile */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <FaUser className="mr-2 text-gray-400" /> My Profile
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Department:</span>
                            <span className="font-medium">{user.department?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">ID:</span>
                            <span className="font-medium font-mono">{user.id}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Need a Room?</h3>
                    <p className="text-blue-100 text-sm mb-6">Book labs, auditoriums, and sports facilities instantly.</p>
                    <Link to="/resources" className="block w-full text-center bg-white text-blue-700 font-bold py-3 rounded-lg hover:bg-blue-50 transition shadow-md">
                        New Booking
                    </Link>
                </div>
            </div>

            {/* RIGHT: Booking History */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" /> My Bookings
                        </h3>
                        <span className="text-sm text-gray-500">{bookings.length} Total</span>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-400">Loading bookings...</div>
                    ) : bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Resource</th>
                                        <th className="px-6 py-3">Date & Time</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{booking.resource_snapshot?.name || 'Unknown Resource'}</p>
                                                <p className="text-xs text-gray-500">{booking.resource_snapshot?.building}</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="font-medium text-gray-900">
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs">
                                                    {new Date(booking.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                    {new Date(booking.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold inline-block
                                                    ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                                                      booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}
                                                `}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {/* Only show Cancel button if status is NOT Cancelled or Completed */}
                                                {['Confirmed', 'Pending'].includes(booking.status) && (
                                                    <button 
                                                        onClick={() => openCancelModal(booking._id)}
                                                        className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:border-red-400 px-3 py-1 rounded transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            <FaHistory className="mx-auto text-4xl text-gray-300 mb-3" />
                            <p>You haven't made any bookings yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* Cancellation Modal */}
        <ConfirmationModal 
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={confirmCancel}
            title="Cancel Booking"
            message="Are you sure you want to cancel this booking? This action cannot be undone."
            isLoading={isCancelling}
        />

      </div>
    </div>
  );
};

export default Dashboard;