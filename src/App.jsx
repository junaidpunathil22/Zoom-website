import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import TenantManager from './pages/admin/TenantManager';
import StaffManager from './pages/admin/StaffManager';
import AdminComplaints from './pages/admin/AdminComplaints';

// Tenant Pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import Maintenance from './pages/tenant/Maintenance';

import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) {
    // Redirect to correct dashboard if trying to access wrong role
    return <Navigate to={user.role === 'admin' ? '/admin' : '/tenant'} />;
  }
  return children;
};

// Wrapper to simplify Layout usage
const LayoutRoute = ({ children, role }) => (
  <ProtectedRoute role={role}>
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <LayoutRoute role="admin">
              <AdminDashboard />
            </LayoutRoute>
          } />
          <Route path="/admin/tenants" element={
            <LayoutRoute role="admin">
              <TenantManager />
            </LayoutRoute>
          } />
          <Route path="/admin/staff" element={
            <LayoutRoute role="admin">
              <StaffManager />
            </LayoutRoute>
          } />
          <Route path="/admin/complaints" element={
            <LayoutRoute role="admin">
              <AdminComplaints />
            </LayoutRoute>
          } />

          {/* Tenant Routes */}
          <Route path="/tenant" element={
            <LayoutRoute role="tenant">
              <TenantDashboard />
            </LayoutRoute>
          } />
          <Route path="/tenant/maintenance" element={
            <LayoutRoute role="tenant">
              <Maintenance />
            </LayoutRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
