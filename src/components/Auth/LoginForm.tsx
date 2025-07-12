import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 particle-bg overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-lg animate-float delay-500"></div>
      </div>

      <div className="max-w-md w-full relative">
        {/* Main Card */}
        <div className="glass-card rounded-3xl shadow-2xl p-8 border-2 border-white/20 animate-scale-in hover-lift">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mb-6 animate-pulse-glow">
              <Sparkles className="h-10 w-10 text-white animate-float" />
            </div>
            <h2 className="text-3xl font-black gradient-text-rainbow mb-2">Welcome Back!</h2>
            <p className="text-gray-600 text-lg">Sign in to continue your skill journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 animate-bounce-in">
                <p className="text-red-600 text-sm font-semibold flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors duration-300" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 text-gray-900 font-medium"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors duration-300" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 glass-card hover:border-blue-300 text-gray-900 font-medium"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl hover:shadow-2xl focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 font-bold text-lg transform hover:scale-105 animate-pulse-glow relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="spinner w-5 h-5"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    Sign In to Swapr
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="gradient-text font-bold hover:scale-105 transition-transform duration-300 inline-flex items-center gap-1"
              >
                Join the community
                <Sparkles className="w-4 h-4" />
              </button>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200/50 animate-slide-in-up delay-300">
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Demo Accounts:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span className="font-semibold text-gray-600">User:</span>
                <span className="text-gray-800 font-mono">alice@example.com / password</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <span className="font-semibold text-gray-600">Admin:</span>
                <span className="text-gray-800 font-mono">admin@swapr.com / admin123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-float delay-700"></div>
      </div>
    </div>
  );
};

export default LoginForm;