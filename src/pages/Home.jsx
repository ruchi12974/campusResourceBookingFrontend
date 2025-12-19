
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaSearch, FaChartLine, FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa'; // Icons
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

      const handleEmailClick = (e) => {
      e.preventDefault();
      // We break the string apart so simple text-search bots can't find "rachana@example.com"
      const user = "ruchiruchitha109"; 
      const domain = "gmail.com"; // Replace with your actual domain
      window.location.href = `mailto:${user}@${domain}`;
    };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div 
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80")',
          backgroundAttachment: 'fixed' // Parallax effect
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Campus Resources <br/>
            <span className="text-blue-400">At Your Fingertips</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light">
            Book lecture halls, labs, and sports facilities instantly. 
            No paperwork, no waiting.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/resources" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-full transition transform hover:scale-105 shadow-xl text-lg"
            >
              Browse Rooms
            </Link>
            {!user && (
              <Link 
                to="/signup" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-10 rounded-full transition text-lg"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 animate-bounce text-white/50">
          <span className="text-sm">Scroll to explore</span>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Use This Portal?</h2>
            <p className="mt-4 text-gray-600">Streamlining campus life for students and faculty.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 text-3xl">
                <FaSearch />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Search</h3>
              <p className="text-gray-500">Filter rooms by capacity, type (Lab, Sports, Hall), or available equipment instantly.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-3xl">
                <FaCalendarCheck />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-gray-500">Check real-time availability and secure your slot with just two clicks.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 text-3xl">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold mb-3">Usage Analytics</h3>
              <p className="text-gray-500">View transparency reports on which facilities are most popular across campus.</p>
            </div>
          </div>
        </div>
      </div>

<footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    
    {/* 1. Main Copyright Line */}
    <p className="text-lg font-semibold text-white mb-2">
      &copy; {new Date().getFullYear()} CampusBook. All rights reserved.
    </p>

    {/* 2. Developer Credit */}
    <p className="flex items-center text-sm mb-6">
      Designed & Developed with <FaHeart className="text-red-500 mx-2 animate-pulse" /> by 
      <span className="text-blue-400 font-bold ml-1">Rachana</span>
    </p>

    {/* 3. Social Media Links */}
    <div className="flex space-x-8 mb-6">
      <a 
        href="https://github.com/ruchi12974" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition transform hover:scale-110"
        title="GitHub"
      >
        <FaGithub className="text-2xl" />
      </a>
      <a 
        href="https://www.linkedin.com/in/rachanaguntuka/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110"
        title="LinkedIn"
      >
        <FaLinkedin className="text-2xl" />
      </a>
      <a 
        href="#contact" 
        onClick={handleEmailClick}
        className="text-gray-400 hover:text-red-400 transition transform hover:scale-110 cursor-pointer"
        title="Email Me"
      >
        <FaEnvelope className="text-2xl" />
      </a>
    </div>

    {/* 4. Tech Stack or Extra Info */}
    <p className="text-xs text-gray-600">
      Built with React, Node.js, MongoDB & Tailwind CSS
    </p>

  </div>
</footer>

    </div>
  );
};

export default Home;