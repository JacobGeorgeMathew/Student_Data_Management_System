import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  Bell, 
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Settings
} from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentHomePage() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  const [showNotifications, setShowNotifications] = useState(false);
  const [homeLoading, setHomeLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const { user, loading, setUser } = useAuth();
  
  // Fetch attendance data on component mount
  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setAttendanceLoading(true);
      const response = await api.get('student/attendance');
      setAttendanceData(response.data || {});
      
      // Set default semester to first available semester with data
      const availableSemesters = Object.keys(response.data || {});
      if (availableSemesters.length > 0) {
        setSelectedSemester(availableSemesters[availableSemesters.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
      setAttendanceData({});
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Show loading state while user data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Show error if user is not loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>Failed to load user data. Please try logging in again.</span>
        </div>
      </div>
    );
  }

  const studentData = {
    name: user.name || 'Student',
    rollNumber: user.roll_number || 'N/A',
    batch: user.batch_id || 'N/A',
    branch: user.branch_id || 'N/A',
    currentSemester: 5,
    totalSemesters: 8
  };

  const notifications = [
    { id: 1, message: "Assignment due for Database Systems - Tomorrow", type: "warning", time: "2 hours ago" },
    { id: 2, message: "New attendance record updated for React Development", type: "info", time: "5 hours ago" },
    { id: 3, message: "Your attendance in Data Structures is below 75%", type: "alert", time: "1 day ago" }
  ];

  const semesters = Object.keys(attendanceData).sort();

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-info';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'excellent': return 'badge-success';
      case 'good': return 'badge-info';
      case 'warning': return 'badge-warning';
      case 'critical': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const getOverallAttendance = () => {
    const currentSemesterData = attendanceData[selectedSemester] || [];
    if (currentSemesterData.length === 0) return 0;
    
    const totalPresent = currentSemesterData.reduce((sum, subject) => sum + subject.presentDays, 0);
    const totalClasses = currentSemesterData.reduce((sum, subject) => sum + subject.totalDays, 0);
    
    return totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : 0;
  };

  const handleViewDetails = (subject) => {
    navigate(`/students/attendance/${subject.id}`, { 
      state: { 
        subject,
        semester: selectedSemester 
      } 
    });
  };

  const HandleLogOut = async (e) => {
    e.preventDefault();
    
    try {
      setHomeLoading(true);
      const response = await api.post("student/logout", {});
      
      setUser(null);
      
      toast.success('Logged out successfully!');
      navigate("/", { replace: true });
    } catch (error) {
      console.error('LogOut error:', error);
      toast.error(error.response?.data?.message || 'Failed to Logout');
    } finally {
      setHomeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100" data-theme="forest">
      {/* Navbar */}
      <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4">
        <div className="navbar-start">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-base-content">EduTrack</span>
              <p className="text-xs text-base-content/60">Student Portal</p>
            </div>
          </div>
        </div>

        <div className="navbar-center">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-center">
              <p className="text-sm font-semibold text-base-content">Welcome back,</p>
              <p className="text-lg font-bold text-primary">{studentData.name}</p>
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <div className="indicator">
                  <Bell className="w-5 h-5" />
                  <span className="badge badge-sm badge-primary indicator-item">{notifications.length}</span>
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-80 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="alert alert-sm">
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs opacity-60">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-primary">View All</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-content" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title px-4 py-2">
                  <span className="text-sm font-semibold">{studentData.name}</span>
                  <span className="text-xs opacity-60">{studentData.rollNumber}</span>
                </li>
                <li><a><User className="w-4 h-4" /> View Profile</a></li>
                <li><a><Settings className="w-4 h-4" /> Settings</a></li>
                <li className="border-t border-base-300 mt-2">
                  <a className="text-error" onClick={HandleLogOut}>
                    <LogOut className="w-4 h-4" /> 
                    {homeLoading ? 'Logging out...' : 'Logout'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">Dashboard</h1>
            <p className="text-base-content/70">Track your academic progress and attendance</p>
          </div>

          {/* Semester Selector */}
          {semesters.length > 0 && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline btn-primary">
                <Calendar className="w-4 h-4 mr-2" />
                {selectedSemester}
                <ChevronDown className="w-4 h-4 ml-2" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {semesters.map((semester) => (
                  <li key={semester}>
                    <a 
                      onClick={() => setSelectedSemester(semester)}
                      className={selectedSemester === semester ? 'active' : ''}
                    >
                      {semester}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {attendanceLoading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content">Loading attendance data...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-primary">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <div className="stat-title">Overall Attendance</div>
                <div className={`stat-value ${getStatusColor(getOverallAttendance() >= 85 ? 'excellent' : getOverallAttendance() >= 75 ? 'good' : 'warning')}`}>
                  {getOverallAttendance()}%
                </div>
                <div className="stat-desc">Current semester average</div>
              </div>

              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-secondary">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Subjects</div>
                <div className="stat-value text-secondary">
                  {(attendanceData[selectedSemester] || []).length}
                </div>
                <div className="stat-desc">This semester</div>
              </div>

              <div className="stat bg-base-200 rounded-lg shadow-lg">
                <div className="stat-figure text-accent">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Above 75%</div>
                <div className="stat-value text-accent">
                  {(attendanceData[selectedSemester] || []).filter(subject => subject.percentage >= 75).length}
                </div>
                <div className="stat-desc">Subjects in good standing</div>
              </div>
            </div>

            {/* Attendance Cards */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-base-content mb-4">Attendance Details - {selectedSemester}</h2>
            </div>

            {(attendanceData[selectedSemester] || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(attendanceData[selectedSemester] || []).map((subject) => (
                  <div key={subject.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="card-title text-lg font-bold text-base-content mb-1">
                            {subject.subjectName}
                          </h3>
                          <p className="text-sm text-base-content/60 mb-2">{subject.subjectCode}</p>
                        </div>
                        <div className={`badge ${getStatusBadge(subject.status)} badge-sm`}>
                          {subject.status}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Attendance Percentage */}
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${getStatusColor(subject.status)} mb-1`}>
                            {subject.percentage.toFixed(1)}%
                          </div>
                          <p className="text-sm text-base-content/70">Attendance</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-base-300 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              subject.status === 'excellent' ? 'bg-success' :
                              subject.status === 'good' ? 'bg-info' :
                              subject.status === 'warning' ? 'bg-warning' :
                              'bg-error'
                            }`}
                            style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                          ></div>
                        </div>

                        {/* Present/Total Classes */}
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-base-content/70">Present:</span>
                            <span className="font-semibold text-success">{subject.presentDays}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-base-content/50" />
                            <span className="text-base-content/70">Total:</span>
                            <span className="font-semibold">{subject.totalDays}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="card-actions justify-end">
                          <button 
                            className="btn btn-sm btn-primary btn-outline"
                            onClick={() => handleViewDetails(subject)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content mb-2">No Data Available</h3>
                <p className="text-base-content/70">No attendance records found for {selectedSemester}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-12 bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-base-content mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-primary" onClick={fetchAttendanceData}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Refresh Data
                </button>
                <button className="btn btn-secondary">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Report
                </button>
                <button className="btn btn-accent">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}