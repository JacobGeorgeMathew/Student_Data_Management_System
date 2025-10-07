import React, { useState } from 'react';
import { User, Mail, Lock, Phone, BookOpen, Building, Eye, EyeOff, UserPlus, Award } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const TeacherSignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    qualification: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const departments = [
    { id: 1, name: 'Computer Science Engineering' },
    { id: 2, name: 'Electronics and Communication' },
    { id: 3, name: 'Mechanical Engineering' },
    { id: 4, name: 'Civil Engineering' },
    { id: 5, name: 'Electrical Engineering' }
  ];

  const qualifications = [
    { id: 1, name: 'B.Tech' },
    { id: 2, name: 'M.Tech' },
    { id: 3, name: 'Ph.D' },
    { id: 4, name: 'M.Sc' },
    { id: 5, name: 'MBA' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'department' || name === 'qualification') ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setLoading(true);
    console.log('Teacher signup:', formData);
    
    try {
      //API call would go here
      const response = await api.post('/teacher/register', {
        name: formData.name,
        email: formData.email,
        ph_no: formData.phone,
        password: formData.password
      });
      await refreshUser("teacher");
      //Navigate to login or home
      navigate("/teachers/home")
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100" data-theme="forest">
      <div className="flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
              <Award className="w-8 h-8 text-secondary-content" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Teacher Registration
            </h1>
            <p className="text-base-content/70">
              Create your teacher account to manage attendance
            </p>
          </div>

          <div className="card bg-base-100 shadow-2xl border border-base-200">
            <div className="card-body p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Employee ID</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        placeholder="e.g., EMP001"
                        className="input input-bordered w-full pl-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Department</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="select select-bordered w-full pl-12"
                        required
                      >
                        <option value="">Select department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Qualification</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <select
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        className="select select-bordered w-full pl-12"
                        required
                      >
                        <option value="">Select qualification</option>
                        {qualifications.map(qual => (
                          <option key={qual.id} value={qual.id}>
                            {qual.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Specialization</span>
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      placeholder="e.g., Data Science, VLSI Design"
                      className="input input-bordered w-full"
                    />
                  </div>

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
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className={`btn btn-secondary btn-lg w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {!loading && <UserPlus className="w-5 h-5 mr-2" />}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-base-200">
                <p className="text-sm text-base-content/60">
                  Already have an account?{' '}
                  <a href="/teachers/login" className="link link-secondary font-medium">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-base-content/50">
              Secure attendance management system for teachers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignupPage;