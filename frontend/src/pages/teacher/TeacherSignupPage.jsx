import React, { useState } from 'react';
import { User, Mail, Lock, Phone, BookOpen, GraduationCap, Building2, Eye, EyeOff, UserPlus, LogIn, Users } from 'lucide-react';

// Mock React Hot Toast - In real app, install: npm install react-hot-toast
const toast = {
  success: (message) => {
    console.log('Success:', message);
    // Create a visual toast notification
    const toastEl = document.createElement('div');
    toastEl.className = 'alert alert-success fixed top-4 right-4 z-50 w-auto max-w-sm shadow-lg';
    toastEl.innerHTML = `
      <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => document.body.removeChild(toastEl), 3000);
  },
  error: (message) => {
    console.log('Error:', message);
    const toastEl = document.createElement('div');
    toastEl.className = 'alert alert-error fixed top-4 right-4 z-50 w-auto max-w-sm shadow-lg';
    toastEl.innerHTML = `
      <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => document.body.removeChild(toastEl), 3000);
  },
  loading: (message) => {
    console.log('Loading:', message);
    const toastEl = document.createElement('div');
    toastEl.className = 'alert alert-info fixed top-4 right-4 z-50 w-auto max-w-sm shadow-lg';
    toastEl.innerHTML = `
      <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toastEl);
    return {
      dismiss: () => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl);
        }
      }
    };
  }
};

const TeacherAuthSystem = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    qualification: '',
    experience: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });

  // Mock data for dropdowns
  const departments = [
    { id: 1, name: 'Computer Science Engineering' },
    { id: 2, name: 'Electronics and Communication Engineering' },
    { id: 3, name: 'Mechanical Engineering' },
    { id: 4, name: 'Civil Engineering' },
    { id: 5, name: 'Electrical Engineering' },
    { id: 6, name: 'Information Technology' },
    { id: 7, name: 'Mathematics' },
    { id: 8, name: 'Physics' },
    { id: 9, name: 'Chemistry' },
    { id: 10, name: 'English' }
  ];

  const designations = [
    { id: 1, name: 'Professor' },
    { id: 2, name: 'Associate Professor' },
    { id: 3, name: 'Assistant Professor' },
    { id: 4, name: 'Lecturer' },
    { id: 5, name: 'Senior Lecturer' },
    { id: 6, name: 'Visiting Faculty' }
  ];

  const qualifications = [
    { id: 1, name: 'Ph.D.' },
    { id: 2, name: 'M.Tech' },
    { id: 3, name: 'M.E.' },
    { id: 4, name: 'M.Sc.' },
    { id: 5, name: 'M.A.' },
    { id: 6, name: 'MBA' },
    { id: 7, name: 'B.Tech' },
    { id: 8, name: 'B.E.' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    } else {
      const requiredFields = ['name', 'email', 'employeeId', 'department', 'designation', 'qualification', 'password', 'confirmPassword'];
      const emptyFields = requiredFields.filter(field => !formData[field]);
      
      if (emptyFields.length > 0) {
        toast.error('Please fill in all required fields');
        return false;
      }
      
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    const loadingToast = toast.loading(isLogin ? 'Signing in...' : 'Creating account...');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      loadingToast.dismiss();
      
      if (isLogin) {
        toast.success(`Welcome back, ${formData.email}!`);
        console.log('Login successful:', { email: formData.email });
      } else {
        toast.success('Account created successfully! Please verify your email.');
        console.log('Signup successful:', formData);
        // Switch to login after successful signup
        setTimeout(() => {
          setIsLogin(true);
          resetForm();
        }, 1500);
      }
    } catch (error) {
      loadingToast.dismiss();
      toast.error(isLogin ? 'Login failed. Please try again.' : 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      employeeId: '',
      department: '',
      designation: '',
      qualification: '',
      experience: '',
      specialization: '',
      password: '',
      confirmPassword: ''
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
    setShowPassword(false);
    toast.success(`Switched to ${!isLogin ? 'Login' : 'Signup'} mode`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" data-theme="forest">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Users className="w-8 h-8 text-primary-content" />
            </div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Teacher Portal
            </h1>
            <p className="text-base-content/70">
              {isLogin ? 'Welcome back! Access your dashboard' : 'Join our teaching community'}
            </p>
          </div>

          {/* Auth Card */}
          <div className="card bg-base-100 shadow-2xl border border-base-200">
            <div className="card-body p-8">
              {/* Toggle Buttons */}
              <div className="flex bg-base-200 rounded-lg p-1 mb-6">
                <button
                  onClick={() => isLogin || switchMode()}
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    isLogin 
                      ? 'bg-primary text-primary-content shadow-sm' 
                      : 'text-base-content/60 hover:text-base-content'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </button>
                <button
                  onClick={() => !isLogin || switchMode()}
                  disabled={isLoading}
                  className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !isLogin 
                      ? 'bg-primary text-primary-content shadow-sm' 
                      : 'text-base-content/60 hover:text-base-content'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </button>
              </div>

              <div className="space-y-4">
                {/* Signup Fields */}
                {!isLogin && (
                  <>
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
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Employee ID */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Employee ID</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleInputChange}
                          placeholder="e.g., EMP001"
                          className="input input-bordered w-full pl-12"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Department Dropdown */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Department</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 z-10" />
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="select select-bordered w-full pl-12"
                          disabled={isLoading}
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

                    {/* Designation Dropdown */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Designation</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 z-10" />
                        <select
                          name="designation"
                          value={formData.designation}
                          onChange={handleInputChange}
                          className="select select-bordered w-full pl-12"
                          disabled={isLoading}
                        >
                          <option value="">Select designation</option>
                          {designations.map(desig => (
                            <option key={desig.id} value={desig.id}>
                              {desig.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Qualification Dropdown */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Highest Qualification</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40 z-10" />
                        <select
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          className="select select-bordered w-full pl-12"
                          disabled={isLoading}
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

                    {/* Experience */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Experience (Years)</span>
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Years of teaching experience"
                        className="input input-bordered w-full"
                        min="0"
                        max="50"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Specialization */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Specialization</span>
                      </label>
                      <textarea
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="Enter your areas of specialization"
                        className="textarea textarea-bordered w-full"
                        rows="2"
                        disabled={isLoading}
                      />
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
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </>
                )}

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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Signup only) */}
                {!isLogin && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Confirm Password</span>
                      <span className="label-text-alt text-error">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        className="input input-bordered w-full pl-12"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="link link-primary text-sm"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
                  >
                    {!isLoading && (
                      <>
                        {isLogin ? (
                          <>
                            <LogIn className="w-5 h-5 mr-2" />
                            Sign In
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-2" />
                            Create Account
                          </>
                        )}
                      </>
                    )}
                    {isLoading && (isLogin ? 'Signing in...' : 'Creating account...')}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6 pt-4 border-t border-base-200">
                <p className="text-sm text-base-content/60">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={switchMode}
                    className="link link-primary font-medium"
                    disabled={isLoading}
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-sm text-base-content/50">
              Professional teaching portal for academic excellence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAuthSystem;