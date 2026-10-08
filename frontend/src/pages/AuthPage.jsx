import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

export default function AuthPage({ onSuccess }) {
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="w-16 h-16 bg-brand-donor-light rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-brand-donor" />
        </div>
        <h2 className="text-[24px] font-bold text-brand-text mb-2">Welcome!</h2>
        <p className="text-[14px] text-brand-text-muted">You have successfully authenticated.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-neutral flex flex-col items-center justify-center p-6 selection:bg-brand-donor/20 selection:text-brand-donor-hover">
      <div className="w-full max-w-[420px] bg-brand-surface p-8 rounded-[16px] border border-brand-border shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <div className="flex justify-center mb-8">
          <Logo className="h-10 w-auto mix-blend-multiply" />
        </div>

        <h2 className="text-[24px] font-bold text-brand-text text-center mb-2 tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Your Account'}
        </h2>
        <p className="text-center text-[14px] text-brand-text-muted mb-8">
          {isLogin
            ? 'Login to your NourishLoop account'
            : 'Join NourishLoop and make a difference'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] flex items-start gap-3 text-red-700 text-[13px]">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[13px] font-medium text-brand-text mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-brand-text mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-brand-text mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-brand-surface border border-brand-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
                placeholder={isLogin ? "Enter your password" : "Create a password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-muted hover:text-brand-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[13px] font-medium text-brand-text mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-brand-surface border border-brand-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-donor focus:ring-1 focus:ring-brand-donor transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-text-muted hover:text-brand-text transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-[13px] pt-1 pb-1">
              <label className="flex items-center gap-2 text-brand-text cursor-pointer">
                <input type="checkbox" className="rounded-[4px] border-brand-border text-brand-donor focus:ring-brand-donor h-4 w-4" />
                Remember me
              </label>
              <button type="button" className="font-semibold text-brand-ngo hover:text-brand-ngo-hover transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full rounded-[8px] py-2.5 text-[14px] font-semibold" isLoading={loading}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-[14px] text-brand-text">
          {isLogin ? (
            <p>Don't have an account? <button onClick={() => setIsLogin(false)} className="font-semibold text-brand-ngo hover:text-brand-ngo-hover ml-1 transition-colors">Register</button></p>
          ) : (
            <p>Already have an account? <button onClick={() => setIsLogin(true)} className="font-semibold text-brand-ngo hover:text-brand-ngo-hover ml-1 transition-colors">Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
