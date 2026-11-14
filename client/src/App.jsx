import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/auth/Login';

// Context & Components
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Cart = () => <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">Your shopping cart is currently empty.</div>;

// Placeholder Pages (Dashboard)
const AdminOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Admin Overview</h2><p className="text-gray-500">High-level charts, total revenue, and system health metrics will appear here.</p></div>;
const SecretaryOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Secretary Overview</h2><p className="text-gray-500">Quick actions for recording daily sales, expenses, and managing payroll.</p></div>;
const WorkerOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Worker Dashboard</h2><p className="text-gray-500">Daily production logging and raw material requisition forms will appear here.</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public E-commerce Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Products />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
          </Route>
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="ecommerce" element={<div className="p-6 bg-white rounded-xl shadow-sm">E-commerce Manager</div>} />
            <Route path="stock" element={<div className="p-6 bg-white rounded-xl shadow-sm">Stock & Finance Manager</div>} />
          </Route>

          <Route path="/dashboard/secretary" element={
            <ProtectedRoute requiredRole="secretary">
              <DashboardLayout role="secretary" />
            </ProtectedRoute>
          }>
            <Route index element={<SecretaryOverview />} />
            <Route path="records" element={<div className="p-6 bg-white rounded-xl shadow-sm">Record Sales & Expenses</div>} />
            <Route path="payroll" element={<div className="p-6 bg-white rounded-xl shadow-sm">Worker Payroll</div>} />
          </Route>

          <Route path="/dashboard/worker" element={
            <ProtectedRoute requiredRole="worker">
              <DashboardLayout role="worker" />
            </ProtectedRoute>
          }>
            <Route index element={<WorkerOverview />} />
            <Route path="production" element={<div className="p-6 bg-white rounded-xl shadow-sm">Log Daily Production</div>} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
