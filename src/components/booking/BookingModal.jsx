import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const BookingModal = ({ isOpen, onClose, resource }) => {
  const { user } = useAuth();
  
  // --- STATE ---
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [busySlots, setBusySlots] = useState([]); // Stores existing bookings

  // --- 1. FETCH AVAILABILITY WHEN DATE CHANGES ---
  useEffect(() => {
    if (selectedDate && resource._id) {
        fetchAvailability();
    } else {
        setBusySlots([]);
    }
  }, [selectedDate, resource]);

  const fetchAvailability = async () => {
    setFetchingSlots(true);
    try {
        // Calls the new backend endpoint
        const { data } = await api.get(`/bookings/availability?resourceId=${resource._id}&date=${selectedDate}`);
        if(data.success) {
            setBusySlots(data.bookings);
        }
    } catch (error) {
        console.error("Failed to load slots", error);
    } finally {
        setFetchingSlots(false);
    }
  };

  // Helper to generate unique ID (Required by your createBooking controller)
  const generateBookingId = () => {
      return `BKG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // --- 2. HANDLE SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
        toast.error("Please login to book a room");
        return;
    }

    // Convert Time Strings to Date Objects for comparison
    // Note: We use an arbitrary date prefix because we only care about time comparison here
    const startObj = new Date(`1970-01-01T${startTime}:00`);
    const endObj = new Date(`1970-01-01T${endTime}:00`);

    if (startObj >= endObj) {
        toast.error("End time must be after start time");
        return;
    }

    setLoading(true);
    try {
        // Construct full ISO strings for the backend
        // We combine the selected date with the selected time
        const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
        const endDateTime = new Date(`${selectedDate}T${endTime}:00`);

        const payload = {
            id: generateBookingId(), // Auto-generate ID
            resourceId: resource._id,
            date: selectedDate, 
            startTime: startDateTime.toISOString(), 
            endTime: endDateTime.toISOString(),     
            purpose
        };

        const { data } = await api.post('/bookings', payload);
        
        if (data.success) {
            toast.success(data.message || "Booking Successful!"); 
            handleClose(); 
        }
    } catch (error) {
        console.error("Booking Error:", error);
        // Handle 409 Conflict specifically
        if (error.response?.status === 409) {
            toast.error("Time slot overlap! Please check availability.");
        } else {
            const msg = error.response?.data?.message || "Booking Failed";
            toast.error(msg);
        }
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setPurpose('');
      setBusySlots([]);
      onClose();
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold">Book {resource.name}</h3>
                <p className="text-blue-100 text-xs opacity-90">{resource.location?.building}</p>
            </div>
            <button onClick={handleClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition text-white">
                <FaTimes />
            </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* DATE PICKER */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Date</label>
                <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                    <input 
                        type="date" 
                        required
                        min={today}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* VISUAL AVAILABILITY CHECK */}
            <div className="min-h-15">
                {fetchingSlots ? (
                    <p className="text-xs text-gray-400 animate-pulse">Checking availability...</p>
                ) : busySlots.length > 0 ? (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 animate-fadeIn">
                        <div className="flex items-center text-red-700 mb-2">
                            <FaExclamationCircle className="mr-2" />
                            <p className="text-xs font-bold">Busy times on this date:</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {busySlots.map((slot, i) => (
                                <span key={i} className="text-[10px] font-mono bg-white border border-red-200 text-red-600 px-2 py-1 rounded shadow-sm">
                                    {slot.startTime} - {slot.endTime}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : selectedDate ? (
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center text-xs text-green-700 animate-fadeIn">
                        <FaCheckCircle className="mr-2" /> All time slots are available!
                    </div>
                ) : null}
            </div>

            {/* TIME INPUTS */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Time</label>
                    <div className="relative">
                        <FaClock className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="time" 
                            required
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">End Time</label>
                    <div className="relative">
                        <FaClock className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="time" 
                            required
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* PURPOSE */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Purpose</label>
                <textarea 
                    rows="2"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Class, Event, Meeting..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
            </div>

            {/* CONFIRM BUTTON */}
            <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition flex justify-center items-center
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
                `}
            >
                {loading ? 'Processing...' : 'Confirm Booking'}
            </button>

        </form>
      </div>
    </div>
  );
};

export default BookingModal;