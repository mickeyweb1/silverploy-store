import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a slight network delay for realism
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate(`/dashboard/${result.role}`);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage Silver-Semat</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@silversemat.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">Test Credentials (from mockData):</p>
          <p className="text-xs text-gray-600">Admin: admin@silversemat.com / admin123</p>
          <p className="text-xs text-gray-600">Secretary: sec@silversemat.com / sec123</p>
          <p className="text-xs text-gray-600">Worker: worker@silversemat.com / worker123</p>
        </div>
      </div>
    </div>
  );
}
