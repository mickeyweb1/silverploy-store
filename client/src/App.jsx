import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages (FIXED IMPORTS HERE)
import ProductManager from './Pages/dashboard/admin/dashboard.jsx';
import { SettingsProvider } from './context/SettingsContext';
import Settings from './pages/dashboard/admin/Settings';
import OrderManager from './Pages/dashboard/admin/OrderManager';
import Products from './Pages/public/Products.jsx';
import ProductDetail from './Pages/public/ProductDetail.jsx';
import Cart from './Pages/public/Cart.jsx';
import FinancialRecords from './Pages/dashboard/secretary/FinancialRecords.jsx';
import Login from './Pages/auth/Login.jsx';

// Context & Components
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder Pages (Dashboard)
const AdminOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Admin Overview</h2><p className="text-gray-500">High-level charts, total revenue, and system health metrics will appear here.</p></div>;
const SecretaryOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Secretary Overview</h2><p className="text-gray-500">Quick actions for recording daily sales, expenses, and managing payroll.</p></div>;
const WorkerOverview = () => <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h2 className="text-xl font-bold text-gray-800 mb-2">Worker Dashboard</h2><p className="text-gray-500">Daily production logging and raw material requisition forms will appear here.</p></div>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SettingsProvider>
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
              <Route path="ecommerce" element={<ProductManager />} />
              <Route path="orders" element={<OrderManager />} />
                              <Route path="settings" element={<Settings />} /> 
              <Route path="stock" element={<div className="p-6 bg-white rounded-xl shadow-sm">Stock & Finance Manager</div>} />
            </Route>

            <Route path="/dashboard/secretary" element={
              <ProtectedRoute requiredRole="secretary">
                <DashboardLayout role="secretary" />
              </ProtectedRoute>
            }>
              <Route index element={<SecretaryOverview />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="records" element={<FinancialRecords />} />
              <Route path="payroll" element={<FinancialRecords />} />
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
        </SettingsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
