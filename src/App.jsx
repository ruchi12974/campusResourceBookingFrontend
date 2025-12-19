import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout'; 
import ProtectedRoute from './components/common/ProtectedRoute'; 

// PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Resources from './pages/Resources';
import ResourceDetail from './pages/ResourceDetail';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/Admin/AdminPanel'; 
import AddResource from './pages/Admin/AddResource'; 
import UpdateResource from './pages/Admin/UpdateResource';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
    
        <Layout>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                
                {/* --- PUBLIC ROUTES (Auth) --- */}
        
                <Route path="/login" element={<Login/>} />
                <Route path = "/signup" element={<Signup/>}/>
 
                {/* --- PROTECTED / SHARED ROUTES --- */}
                
                <Route path="/" element={<Home />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:id" element={<ResourceDetail />} />
                
                
                {/* --- PRIVATE USER ROUTES --- */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/analytics" element={
                  <ProtectedRoute allowedRoles={['Admin', 'Faculty', 'Student', 'Staff']}>
                    <Analytics />
                  </ProtectedRoute>
                } />

                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } />

                <Route path="/admin/add-resource" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AddResource />
                  </ProtectedRoute>
                } />

                <Route path="/admin/edit-resource/:id" element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <UpdateResource />
                  </ProtectedRoute>
                } />

                {/* Catch all - Redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />

              </Routes>
            </div>
        </Layout>

      </AuthProvider>
    </Router>
  );
}

export default App;