import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaCheckCircle, FaInfoCircle, FaArrowLeft, FaBuilding, FaLayerGroup } from 'react-icons/fa';
import api from '../services/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// 1. IMPORT THE MODAL
import BookingModal from '../components/booking/BookingModal';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 2. MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- CAROUSEL SETTINGS ---
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true, 
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await api.get(`/resources/${id}`);
        if (data.success) {
          setResource(data.resource);
        }
      } catch (error) {
        console.error("Failed to fetch resource details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading details...</div>;
  if (!resource) return <div className="min-h-screen flex items-center justify-center text-red-500">Resource not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back */}
        <div className="mb-6">
            <Link to="/resources" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition font-medium">
                <FaArrowLeft className="mr-2" /> Back to All Resources
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN: IMAGES & FEATURES --- */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Image Carousel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
                    {resource.images && resource.images.length > 0 ? (
                        <Slider {...settings}>
                            {resource.images.map((img, idx) => (
                                <div key={idx} className="outline-none">
                                    <img 
                                        src={img} 
                                        alt={`${resource.name} view ${idx + 1}`} 
                                        className="w-full h-100 object-cover rounded-xl"
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="h-100 bg-gray-200 flex items-center justify-center rounded-xl">
                            <span className="text-gray-400">No images available</span>
                        </div>
                    )}
                </div>

                {/* Description / Features */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Facilities & Amenities</h3>
                    <div className="flex flex-wrap gap-3">
                        {resource.features?.map((feat, i) => (
                            <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center border border-blue-100">
                                <FaCheckCircle className="mr-2" /> {feat}
                            </span>
                        ))}
                    </div>
                </div>

                 {/* Location Details */}
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="flex items-center text-gray-600">
                            <FaBuilding className="mr-3 text-gray-400 text-lg" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Building</p>
                                <p className="font-semibold text-gray-800">{resource.location?.building}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaLayerGroup className="mr-3 text-gray-400 text-lg" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Floor</p>
                                <p className="font-semibold text-gray-800">{resource.location?.floor === 0 ? 'Ground Floor' : `Floor ${resource.location?.floor}`}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="mr-3 text-gray-400 text-lg" />
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Zone</p>
                                <p className="font-semibold text-gray-800">{resource.location?.zone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: INFO & BOOKING CTA --- */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                    
                    {/* Header Info */}
                    <div className="mb-6 border-b border-gray-100 pb-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {resource.category}
                            </span>
                            {resource.status === 'Maintenance' && (
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Maintenance
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mt-3 leading-tight">{resource.name}</h1>
                        <p className="text-gray-500 mt-1">{resource.sub_category}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-5 mb-8">
                        <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-4 text-green-600">
                                <FaUsers />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Capacity</p>
                                <p className="font-medium text-lg">{resource.capacity} People</p>
                            </div>
                        </div>

                        <div className="flex items-center text-gray-700">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4 text-orange-600">
                                <FaInfoCircle />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase">Approval Type</p>
                                <p className="font-medium text-sm">
                                    {resource.booking_rules?.requires_approval 
                                        ? "Requires Admin Approval" 
                                        : "Instant Booking Available"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Rules Box */}
                    <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                        <p className="font-bold text-gray-700 mb-2">Booking Rules:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Allowed Roles: {resource.booking_rules?.allowed_roles?.join(", ") || "All"}</li>
                            {resource.booking_rules?.max_duration_hours && (
                                <li>Max Duration: {resource.booking_rules.max_duration_hours} hours</li>
                            )}
                        </ul>
                    </div>

                    {/* BOOKING ACTION */}
                    {resource.status === 'Active' ? (
                        <button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center"
                            onClick={() => setIsModalOpen(true)} // <--- 3. OPEN MODAL
                        >
                            Check Availability
                        </button>
                    ) : (
                         <button 
                            disabled
                            className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed"
                        >
                            Currently Unavailable
                        </button>
                    )}

                </div>
            </div>

        </div>
      </div>

      {/* 4. RENDER MODAL */}
      {isModalOpen && (
        <BookingModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            resource={resource} 
        />
      )}

    </div>
  );
};

export default ResourceDetail;