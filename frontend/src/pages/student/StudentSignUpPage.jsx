import React, { useState } from 'react';
import { User, Mail, Lock, Phone, BookOpen, Users, Calendar, Eye, EyeOff, UserPlus } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

const StudentSignupPage = () => {
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    branch: '',
    batch: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data for dropdowns - in real app, fetch from API
  const branches = [
    { id: 1, name: 'Computer Science Engineering' },
    { id: 2, name: 'Electronics and Communication' },
    { id: 3, name: 'Mechanical Engineering' },
    { id: 4, name: 'Civil Engineering' },
    { id: 5, name: 'Electrical Engineering' }
  ];

  const batches = [
    { id: 1, name: '2021-2025', year: '2021' },
    { id: 2, name: '2022-2026', year: '2022' },
    { id: 3, name: '2023-2027', year: '2023' },
    { id: 4, name: '2024-2028', year: '2024' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'branch' || name === 'batch') ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup attempt:', formData);
    // Handle signup logic
    // Add password validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    // Add other validation logic here
    try {
      const response = await api.post('/student/register', {
        name: formData.name,
        email: formData.email,
        ph_no: formData.phone,
        roll_number: formData.rollNumber,
        batch_id: formData.batch,
        branch_id: formData.branch,
        password: formData.password
      });
      toast.success('Account created successfully!');
      // IMPORTANT: Refresh user data after signup
      await refreshUser("student");
      navigate("/students/home");
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      rollNumber: '',
      branch: '',
      batch: '',
      password: '',
      confirmPassword: ''
    });
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
              Student Registration
            </h1>
            <p className="text-base-content/70">
              Create your student account to get started
            </p>
          </div>

          {/* Signup Card */}
          <div className="card bg-base-100 shadow-2xl border border-base-200">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Full Name</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="input input-bordered w-full pl-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Roll Number</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., CS21001"
                        className="input input-bordered w-full pl-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Branch Dropdown */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Branch</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        className="select select-bordered w-full pl-12"
                        required
                      >
                        <option value="">Select your branch</option>
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Batch Dropdown */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Batch</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select
                        name="batch"
                        value={formData.batch}
                        onChange={handleInputChange}
                        className="select select-bordered w-full pl-12"
                        required
                      >
                        <option value="">Select your batch</option>
                        {batches.map(batch => (
                          <option key={batch.id} value={batch.id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Phone Number</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="input input-bordered w-full pl-12"
                      />
                    </div>
                  </div>

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
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Confirm Password</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="input input-bordered w-full pl-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary btn-lg w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                       {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center mt-6 pt-4 border-t border-base-200">
                <p className="text-sm text-base-content/60">
                  Already have an account?{' '}
                  <a href="/login" className="link link-primary font-medium">
                    Sign in here
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

export default StudentSignupPage;