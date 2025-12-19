import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUniversity, FaSignOutAlt, FaUserCircle, FaBars, FaTimes, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Permissions Helper
  const canViewAnalytics = user && ['Admin', 'Faculty', 'Student', 'Staff'].includes(user.role);

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl hover:text-blue-200 transition" onClick={closeMenu}>
            <FaUniversity className="text-2xl" />
            <span>CampusBook</span>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center space-x-6">
            {/* 1. HOME LINK ADDED HERE */}
            <Link to="/" className="hover:text-blue-200 transition font-medium">Home</Link>
            
            <Link to="/resources" className="hover:text-blue-200 transition font-medium">Resources</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition font-medium">Dashboard</Link>
                
                {user.role === 'Admin' && (
                    <Link to="/admin" className="flex items-center hover:text-blue-200 transition font-medium text-yellow-400">
                        <FaShieldAlt className="mr-1" /> Admin Panel
                    </Link>
                )}

                {canViewAnalytics && (
                    <Link to="/analytics" className="flex items-center hover:text-blue-200 transition font-medium">
                        <FaChartLine className="mr-1" /> Analytics
                    </Link>
                )}
                
                {/* User Profile */}
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-blue-700">
                   <div className="flex flex-col text-right">
                      <span className="text-sm font-semibold leading-tight">{user.full_name || user.fullName}</span>
                      <span className="text-[10px] text-blue-300 uppercase tracking-wide font-bold">{user.role}</span>
                   </div>
                   <FaUserCircle className="text-3xl text-blue-200" />
                   
                   <button 
                     onClick={handleLogout} 
                     className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition shadow-md ml-2"
                     title="Logout"
                   >
                     <FaSignOutAlt className="text-sm" />
                   </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-bold shadow-md transition transform hover:-translate-y-0.5"
              >
                Login
              </Link>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-blue-200 focus:outline-none p-2">
                {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 animate-slideDown">
            <div className="px-4 pt-2 pb-4 space-y-2">
                
                {/* 2. HOME LINK ADDED TO MOBILE */}
                <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-blue-700 font-medium">
                    Home
                </Link>

                <Link to="/resources" onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-blue-700 font-medium">
                    Resources
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-blue-700 font-medium">
                            Dashboard
                        </Link>

                        {user.role === 'Admin' && (
                            <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-blue-700 font-medium text-yellow-300">
                                <FaShieldAlt className="inline mr-2" /> Admin Panel
                            </Link>
                        )}

                        {canViewAnalytics && (
                            <Link to="/analytics" onClick={closeMenu} className="block px-3 py-2 rounded-md hover:bg-blue-700 font-medium">
                                <FaChartLine className="inline mr-2" /> Analytics
                            </Link>
                        )}

                        {/* Mobile User Info */}
                        <div className="mt-4 pt-4 border-t border-blue-700 flex items-center justify-between px-3">
                            <div className="flex items-center space-x-3">
                                <FaUserCircle className="text-3xl text-blue-300" />
                                <div>
                                    <p className="font-bold text-sm">{user.full_name || user.fullName}</p>
                                    <p className="text-xs text-blue-300 uppercase">{user.role}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-600 px-4 py-2 rounded-lg text-sm font-bold shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <Link 
                        to="/login" 
                        onClick={closeMenu}
                        className="block w-full text-center bg-blue-600 hover:bg-blue-500 px-3 py-3 rounded-lg font-bold mt-4"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;