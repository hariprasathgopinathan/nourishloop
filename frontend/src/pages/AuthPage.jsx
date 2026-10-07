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
        onSuccess();
      }, 1500);

    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (successMode) {
    return (
      <div className="min-h-screen bg-brand-neutral flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-brand-green" />
        </div>
        <h2 className="text-3xl font-bold text-brand-text mb-2">Welcome!</h2>
        <p className="text-gray-500">You have successfully authenticated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral flex flex-col selection:bg-brand-green/20 selection:text-brand-darkGreen">
      <div className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-text transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex justify-center mb-8">
            <Logo className="h-24 w-auto" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-text text-center mb-3 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {isLogin
              ? 'Login to your NourishLoop account'
              : 'Join NourishLoop and make a difference'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
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
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
                placeholder="Create a password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:bg-white transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-green focus:ring-brand-green" />
                  Remember me
                </label>
                <button type="button" className="font-medium text-brand-green hover:text-brand-darkGreen transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full rounded-xl py-3 text-base font-semibold shadow-sm" isLoading={loading}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="font-semibold text-brand-green hover:text-brand-darkGreen">Sign up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)} className="font-semibold text-brand-green hover:text-brand-darkGreen">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
