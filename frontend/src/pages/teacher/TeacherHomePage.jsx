import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { 
  GraduationCap, 
  User, 
  LogOut, 
  Bell, 
  Calendar,
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  TrendingUp,
  FileText,
  ChevronRight,
  Award
} from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherHomePage() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [homeLoading, setHomeLoading] = useState(false);
  const { user, loading, setUser } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-secondary"></span>
          <p className="mt-4 text-base-content">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>Failed to load user data. Please try logging in again.</span>
        </div>
      </div>
    );
  }

  const teacherData = {
    name: user.name || 'Teacher',
    employeeId: user.employee_id || 'N/A',
    department: user.department_id || 'N/A',
    qualification: user.qualification || 'N/A',
    specialization: user.specialization || 'N/A'
  };

  const notifications = [
    { id: 1, message: "Low attendance alert: CS501 - 3 students below 75%", type: "warning", time: "1 hour ago" },
    { id: 2, message: "Attendance submitted successfully for today's class", type: "success", time: "3 hours ago" },
    { id: 3, message: "New student added to CS502 batch", type: "info", time: "1 day ago" }
  ];

  const subjects = [
    {
      id: 1,
      name: "Database Management Systems",
      code: "CS501",
      batch: "2021-2025",
      totalStudents: 45,
      avgAttendance: 82.5,
      classesHeld: 32,
      lowAttendanceCount: 3
    },
    {
      id: 2,
      name: "Software Engineering",
      code: "CS502",
      batch: "2022-2026",
      totalStudents: 50,
      avgAttendance: 88.2,
      classesHeld: 30,
      lowAttendanceCount: 1
    },
    {
      id: 3,
      name: "Computer Networks",
      code: "CS503",
      batch: "2021-2025",
      totalStudents: 42,
      avgAttendance: 75.8,
      classesHeld: 31,
      lowAttendanceCount: 5
    },
    {
      id: 4,
      name: "Web Technologies",
      code: "CS505",
      batch: "2023-2027",
      totalStudents: 48,
      avgAttendance: 79.3,
      classesHeld: 28,
      lowAttendanceCount: 4
    }
  ];

  const upcomingClasses = [
    { id: 1, subject: "Database Management Systems", time: "10:00 AM", room: "Lab 301", batch: "2021-2025" },
    { id: 2, subject: "Software Engineering", time: "02:00 PM", room: "Room 205", batch: "2022-2026" },
    { id: 3, subject: "Computer Networks", time: "04:00 PM", room: "Lab 402", batch: "2021-2025" }
  ];

  const quickStats = {
    totalSubjects: subjects.length,
    totalStudents: subjects.reduce((sum, sub) => sum + sub.totalStudents, 0),
    avgAttendance: (subjects.reduce((sum, sub) => sum + sub.avgAttendance, 0) / subjects.length).toFixed(1),
    lowAttendanceStudents: subjects.reduce((sum, sub) => sum + sub.lowAttendanceCount, 0)
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-success';
    if (percentage >= 75) return 'text-info';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 85) return 'badge-success';
    if (percentage >= 75) return 'badge-info';
    if (percentage >= 60) return 'badge-warning';
    return 'badge-error';
  };

  const HandleLogOut = async (e) => {
    e.preventDefault();
    try {
      setHomeLoading(true);
      const response = await api.post("teacher/logout", {});
      setUser(null);
      toast.success('Logged out successfully!');
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.response?.data?.message || 'Failed to logout');
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
            <GraduationCap className="w-8 h-8 text-secondary" />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-base-content">EduTrack</span>
              <p className="text-xs text-base-content/60">Teacher Portal</p>
            </div>
          </div>
        </div>

        <div className="navbar-center">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-center">
              <p className="text-sm font-semibold text-base-content">Welcome back,</p>
              <p className="text-lg font-bold text-secondary">{teacherData.name}</p>
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
                  <span className="badge badge-sm badge-secondary indicator-item">{notifications.length}</span>
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
                    <button className="btn btn-sm btn-secondary">View All</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary-content" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title px-4 py-2">
                  <span className="text-sm font-semibold">{teacherData.name}</span>
                  <span className="text-xs opacity-60">{teacherData.employeeId}</span>
                </li>
                <li><a><User className="w-4 h-4" /> View Profile</a></li>
                <li><a><Settings className="w-4 h-4" /> Settings</a></li>
                <li className="border-t border-base-300 mt-2">
                  <a className="text-error" onClick={HandleLogOut}><LogOut className="w-4 h-4" /> Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">Dashboard</h1>
          <p className="text-base-content/70">Manage attendance and track student progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-200 rounded-lg shadow-lg">
            <div className="stat-figure text-secondary">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Subjects</div>
            <div className="stat-value text-secondary">{quickStats.totalSubjects}</div>
            <div className="stat-desc">Currently teaching</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-primary">{quickStats.totalStudents}</div>
            <div className="stat-desc">Across all subjects</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Avg Attendance</div>
            <div className={`stat-value ${getAttendanceColor(quickStats.avgAttendance)}`}>
              {quickStats.avgAttendance}%
            </div>
            <div className="stat-desc">Overall average</div>
          </div>

          <div className="stat bg-base-200 rounded-lg shadow-lg">
            <div className="stat-figure text-warning">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Low Attendance</div>
            <div className="stat-value text-warning">{quickStats.lowAttendanceStudents}</div>
            <div className="stat-desc">Students below 75%</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Subjects Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-base-content">My Subjects</h2>
              <button className="btn btn-secondary btn-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View All
              </button>
            </div>

            <div className="grid gap-6">
              {subjects.map((subject) => (
                <div key={subject.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="card-title text-lg font-bold text-base-content mb-1">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-base-content/60">{subject.code} • {subject.batch}</p>
                      </div>
                      <div className={`badge ${getAttendanceBadge(subject.avgAttendance)} badge-lg`}>
                        {subject.avgAttendance}%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Users className="w-4 h-4 text-base-content/60" />
                          <span className="text-xs text-base-content/60">Students</span>
                        </div>
                        <p className="text-lg font-bold">{subject.totalStudents}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span className="text-xs text-base-content/60">Classes</span>
                        </div>
                        <p className="text-lg font-bold">{subject.classesHeld}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-base-content/60" />
                          <span className="text-xs text-base-content/60">Average</span>
                        </div>
                        <p className={`text-lg font-bold ${getAttendanceColor(subject.avgAttendance)}`}>
                          {subject.avgAttendance}%
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <AlertCircle className="w-4 h-4 text-base-content/60" />
                          <span className="text-xs text-base-content/60">Low</span>
                        </div>
                        <p className="text-lg font-bold text-warning">{subject.lowAttendanceCount}</p>
                      </div>
                    </div>

                    <div className="card-actions justify-end space-x-2">
                      <button className="btn btn-sm btn-primary">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Attendance
                      </button>
                      <button className="btn btn-sm btn-outline btn-secondary">
                        <FileText className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Schedule */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((classItem) => (
                    <div key={classItem.id} className="bg-base-100 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-sm">{classItem.subject}</p>
                        <span className="badge badge-sm badge-primary">{classItem.time}</span>
                      </div>
                      <p className="text-xs text-base-content/60">{classItem.room} • {classItem.batch}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm btn-block btn-outline mt-4">
                  View Full Schedule
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-primary btn-block btn-sm justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </button>
                  <button className="btn btn-secondary btn-block btn-sm justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    View Students
                  </button>
                  <button className="btn btn-accent btn-block btn-sm justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                  <button className="btn btn-outline btn-block btn-sm justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Attendance History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}