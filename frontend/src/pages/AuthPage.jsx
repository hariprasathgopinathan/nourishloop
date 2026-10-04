import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

export default function AuthPage({ intentRole = 'donor', onBack, onSuccess }) {
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(intentRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMode, setSuccessMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin) {
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
      if (!name.trim()) {
        return setError("Name is required.");
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      
      setSuccessMode(true);
      
      // Delay slightly for success transition
      setTimeout(() => {
        onSuccess(role);
      }, 1500);
      
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (successMode) {
    return (
      <div className="min-h-screen bg-[#FDFDFC] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>
        <p className="text-gray-500">You have successfully authenticated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40">
          <div className="flex justify-center mb-8">
            <Logo compact />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {isLogin 
              ? `Sign in to access your ${role === 'donor' ? 'Donor' : 'NGO'} dashboard.` 
              : 'Join the network to start sharing surplus food.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">I am registering as</label>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setRole('donor')}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${role === 'donor' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      Donor
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('ngo')}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${role === 'ngo' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      NGO
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <Button type="submit" className="w-full shadow-emerald-500/20 shadow-lg" isLoading={loading}>
                {isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="font-semibold text-emerald-600 hover:text-emerald-700">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)} className="font-semibold text-emerald-600 hover:text-emerald-700">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
