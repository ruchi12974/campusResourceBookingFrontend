
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; 
  }

  // 1. Not Logged In? -> Go to Login
  if (!user) {
    // We pass "state" so after login, we can redirect them back to where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Check
  // If the page requires "Admin" but user is "Student"
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or a "403 Unauthorized" page
  }

  // 3. All Good? Render the page
  return children;
};

export default ProtectedRoute;