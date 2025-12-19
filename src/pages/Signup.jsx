import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  { name: 'Computer Science', code: 'CSE' },
  { name: 'Electrical Engineering', code: 'EEE' },
  { name: 'Mechanical Engineering', code: 'ME' },
  { name: 'Civil Engineering', code: 'CE' },
  { name: 'Biotechnology', code: 'BT' }
];

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    roll_number: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '', // Added for validation
    phone: '',
    dept_code: 'CSE',
    batch: '',
    role: 'Student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 🛡️ VALIDATION LOGIC ---
  const validateForm = () => {
    // 1. Password Match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    // 2. Password Length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }

    // 3. Phone Number (10 Digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }

    // 4. Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    // 5. Batch (4 Digits)
    if (formData.batch.length !== 4 || isNaN(formData.batch)) {
        toast.error("Batch should be a 4-digit year (e.g., 2024)");
        return false;
    }

    return true; // All checks passed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run Validation BEFORE sending to server
    if (!validateForm()) return;

    setLoading(true);

    try {
      const selectedDept = DEPARTMENTS.find(d => d.code === formData.dept_code);

      const payload = {
        _id: formData.roll_number,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        department: {
            code: selectedDept.code,
            name: selectedDept.name,
            batch: formData.batch
        }
      };

      await api.post('/auth/register', payload);
      
      toast.success("Registration successful! Please login.");
      navigate('/login');
      
    } catch (error) {
      console.error("Signup Error:", error);
      if (error.response?.data?.error?.code === 11000) {
         toast.error("Account already exists (Email or Roll Number duplicate).");
      } else {
         const msg = error.response?.data?.message || "Registration failed";
         toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Enter your official details</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          
          {/* Row 1: Roll & Role */}
          <div className="flex gap-4">
             <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700">Roll Number / ID *</label>
                <input
                  name="roll_number"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="21CSE101"
                  value={formData.roll_number}
                  onChange={handleChange}
                />
             </div>
             <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                </select>
             </div>
          </div>

          {/* Row 2: Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              name="full_name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rahul Sharma"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          {/* Row 3: Email & Phone */}
          <div className="flex gap-4">
             <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="rahul@institute.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
             </div>
             <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700">Phone (10 digits) *</label>
                <input
                  name="phone"
                  type="text" // using text to prevent scrolling arrows
                  required
                  maxLength="10"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
             </div>
          </div>

          {/* Row 4: Department & Batch */}
          <div className="flex gap-4">
             <div className="w-2/3">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="dept_code"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.dept_code}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.code} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
             </div>
             <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700">Batch (Year) *</label>
                <input
                  name="batch"
                  type="text"
                  required
                  maxLength="4"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="2025"
                  value={formData.batch}
                  onChange={handleChange}
                />
             </div>
          </div>

          {/* Row 5: Passwords */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Min 6 chars"
                value={formData.password}
                onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-2">
             <Link to="/login" className="text-sm text-blue-600 hover:underline">
                Already have an account? Log in
             </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;