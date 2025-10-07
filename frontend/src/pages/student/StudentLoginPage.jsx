import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const StudentLoginPage = () => {
  const { refreshUser } = useAuth(); // Get refreshUser from context
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/student/login', {
        email: formData.email,
        password: formData.password
      });
      
      // Store token if your backend returns one
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Update auth context
      if (login) {
        login(response.data.user, 'student');
      }
      
      toast.success('Login successful!');
      // IMPORTANT: Refresh user data after login
      await refreshUser("student");
      navigate('/students/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100" data-theme="forest">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-primary-content" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Student Login
            </h1>
            <p className="text-base-content/70">
              Sign in to access your attendance records
            </p>
          </div>

          {/* Login Card */}
          <div className="card bg-base-100 shadow-2xl border border-base-200">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email Address</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="input input-bordered w-full pl-12"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="input input-bordered w-full pl-12 pr-12"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <a href="/students/forgot-password" className="link link-primary text-sm">
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {!loading && <LogIn className="w-5 h-5 mr-2" />}
                      {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center mt-6 pt-4 border-t border-base-200">
                <p className="text-sm text-base-content/60">
                  Don't have an account?{' '}
                  <a href="/students/signup" className="link link-primary font-medium">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-base-content/50">
              Secure attendance tracking system for students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;