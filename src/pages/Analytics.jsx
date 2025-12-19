import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { FaClipboardList, FaCheckCircle, FaTimesCircle, FaClock, FaTrophy } from 'react-icons/fa';
import api from '../services/api';

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green (Confirmed), Yellow (Pending), Red (Cancelled)

const Analytics = () => {
  const [usageData, setUsageData] = useState(null);
  const [topRooms, setTopRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [usageRes, topRoomsRes] = await Promise.all([
            api.get('/analytics/usage'),
            api.get('/analytics/top-rooms')
        ]);

        if (usageRes.data.success) {
            setUsageData(usageRes.data.data);
        }

        if (topRoomsRes.data.success) {
            setTopRooms(topRoomsRes.data.topRooms);
        }

      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- PREPARE DATA FOR CHARTS ---

  const pieData = usageData ? [
    { name: 'Confirmed', value: usageData.confirmedBookings },
    { name: 'Pending', value: usageData.pendingBookings },
    { name: 'Cancelled', value: usageData.cancelledBookings }
  ].filter(item => item.value > 0) : []; // Hide segments with 0 value

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-blue-600 font-bold text-lg">Loading Dashboard...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time overview of campus resource utilization.</p>
        </div>

        {/* 1. KPI CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            
            {/* Total */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
                <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4">
                    <FaClipboardList className="text-2xl" />
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{usageData?.totalBookings || 0}</p>
                </div>
            </div>

            {/* Confirmed */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
                <div className="bg-green-100 p-4 rounded-full text-green-600 mr-4">
                    <FaCheckCircle className="text-2xl" />
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Confirmed</p>
                    <p className="text-3xl font-bold text-gray-900">{usageData?.confirmedBookings || 0}</p>
                </div>
            </div>

            {/* Pending */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
                <div className="bg-yellow-100 p-4 rounded-full text-yellow-600 mr-4">
                    <FaClock className="text-2xl" />
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{usageData?.pendingBookings || 0}</p>
                </div>
            </div>

            {/* Cancelled */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition">
                <div className="bg-red-100 p-4 rounded-full text-red-600 mr-4">
                    <FaTimesCircle className="text-2xl" />
                </div>
                <div>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Cancelled</p>
                    <p className="text-3xl font-bold text-gray-900">{usageData?.cancelledBookings || 0}</p>
                </div>
            </div>
        </div>

        {/* 2. CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* LEFT: Top Performing Rooms (Bar Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <FaTrophy className="mr-2 text-yellow-500" /> Most Popular Rooms
                    </h3>
                </div>
                
                <div className="flex-1 min-h-75">
                    {topRooms.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topRooms} layout="vertical" margin={{ left: 20, right: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={140} 
                                    tick={{fontSize: 12, fill: '#6B7280'}} 
                                />
                                <Tooltip 
                                    cursor={{fill: '#F3F4F6'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar 
                                    dataKey="bookingCount" 
                                    name="Total Bookings" 
                                    fill="#4F46E5" 
                                    radius={[0, 4, 4, 0]} 
                                    barSize={24}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p>No booking data available yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Booking Status Distribution (Pie Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Booking Status Overview</h3>
                
                <div className="flex-1 min-h-75 flex items-center justify-center relative">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            No stats available.
                        </div>
                    )}
                    
                    {/* Center Text Overlay */}
                    {pieData.length > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-gray-800">{usageData?.totalBookings}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Total</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;