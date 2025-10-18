import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AttendanceDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subject, semester } = location.state || {};
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!subject) {
      navigate('/students/home');
    }
  }, [subject, navigate]);

  if (!subject) {
    return null;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  // Create a map of dates with attendance status
  const attendanceMap = {};
  (subject.sessions || []).forEach(session => {
    const date = session.date;
    if (!attendanceMap[date]) {
      attendanceMap[date] = [];
    }
    attendanceMap[date].push({
      hour: session.hour,
      status: session.status
    });
  });

  // Calendar generation
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getDateString = (day) => {
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${currentYear}-${month}-${dayStr}`;
  };

  const hasAttendance = (day) => {
    if (!day) return false;
    const dateStr = getDateString(day);
    return attendanceMap[dateStr];
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const calendarDays = generateCalendar();
  const sortedSessions = [...(subject.sessions || [])].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen bg-base-100" data-theme="forest">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4">
        <div className="navbar-start">
          <button 
            className="btn btn-ghost btn-circle"
            onClick={() => navigate('/students/home')}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="navbar-center">
          <h1 className="text-xl font-bold text-base-content">Attendance Details</h1>
        </div>
        <div className="navbar-end">
          <div className={`badge ${getStatusBadge(subject.status)} badge-lg`}>
            {subject.status}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Subject Info Card */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-base-content mb-1">{subject.subjectName}</h2>
                <p className="text-base-content/60">{subject.subjectCode}</p>
                <p className="text-sm text-base-content/70 mt-1">{semester}</p>
              </div>
              <div className="stats shadow bg-base-300">
                <div className="stat place-items-center">
                  <div className="stat-title">Attendance</div>
                  <div className={`stat-value text-2xl ${getStatusColor(subject.status)}`}>
                    {subject.percentage.toFixed(1)}%
                  </div>
                  <div className="stat-desc">{subject.presentDays} / {subject.totalDays} classes</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-base-300 rounded-full h-3 mt-4">
              <div 
                className={`h-3 rounded-full ${
                  subject.status === 'excellent' ? 'bg-success' :
                  subject.status === 'good' ? 'bg-info' :
                  subject.status === 'warning' ? 'bg-warning' :
                  'bg-error'
                }`}
                style={{ width: `${Math.min(subject.percentage, 100)}%` }}
              ></div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="stat bg-base-300 rounded-lg p-4">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Present</div>
                <div className="stat-value text-success text-xl">{subject.presentDays}</div>
              </div>
              <div className="stat bg-base-300 rounded-lg p-4">
                <div className="stat-figure text-error">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Absent</div>
                <div className="stat-value text-error text-xl">{subject.totalDays - subject.presentDays}</div>
              </div>
              <div className="stat bg-base-300 rounded-lg p-4">
                <div className="stat-figure text-info">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Total Classes</div>
                <div className="stat-value text-info text-xl">{subject.totalDays}</div>
              </div>
              <div className="stat bg-base-300 rounded-lg p-4">
                <div className="stat-figure text-accent">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="stat-title text-xs">Status</div>
                <div className={`stat-value text-xl ${getStatusColor(subject.status)}`}>
                  {subject.percentage >= 90 ? 'A+' : subject.percentage >= 75 ? 'A' : subject.percentage >= 60 ? 'B' : 'C'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar View */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content mb-4">Attendance Calendar</h3>
              
              {/* Month Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  className="btn btn-sm btn-ghost btn-circle"
                  onClick={previousMonth}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="text-lg font-semibold">
                  {monthNames[currentMonth]} {currentYear}
                </h4>
                <button 
                  className="btn btn-sm btn-ghost btn-circle"
                  onClick={nextMonth}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-base-content/70 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {calendarDays.map((day, index) => {
                  const attendance = day ? hasAttendance(day) : null;
                  
                  return (
                    <div
                      key={index}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm
                        ${!day ? 'bg-transparent' : 'bg-base-300 hover:bg-base-100'}
                        ${attendance ? 'ring-2 ring-primary' : ''}
                        relative cursor-pointer transition-all
                      `}
                    >
                      {day && (
                        <>
                          <span className="text-base-content">{day}</span>
                          {attendance && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                              {attendance.map((session, idx) => (
                                <div
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    session.status === 1 ? 'bg-success' : 'bg-error'
                                  }`}
                                  title={`Hour ${session.hour}: ${session.status === 1 ? 'Present' : 'Absent'}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-base-content/70">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <span className="text-base-content/70">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-lg ring-2 ring-primary bg-base-300"></div>
                  <span className="text-base-content/70">Has classes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session History */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="text-xl font-bold text-base-content mb-4">Session History</h3>
              
              {sortedSessions.length > 0 ? (
                <div className="overflow-y-auto max-h-[500px] space-y-3">
                  {sortedSessions.map((session, index) => {
                    const date = new Date(session.date);
                    const formattedDate = date.toLocaleDateString('en-US', { 
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                    
                    return (
                      <div 
                        key={index}
                        className={`
                          p-4 rounded-lg border-l-4 transition-all hover:shadow-md
                          ${session.status === 1 
                            ? 'bg-success/10 border-success' 
                            : 'bg-error/10 border-error'
                          }
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {session.status === 1 ? (
                                <CheckCircle className="w-5 h-5 text-success" />
                              ) : (
                                <XCircle className="w-5 h-5 text-error" />
                              )}
                              <span className={`font-semibold ${
                                session.status === 1 ? 'text-success' : 'text-error'
                              }`}>
                                {session.status === 1 ? 'Present' : 'Absent'}
                              </span>
                            </div>
                            <p className="text-sm text-base-content/70">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              {formattedDate}
                            </p>
                            <p className="text-sm text-base-content/70 mt-1">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Hour {session.hour}
                            </p>
                          </div>
                          <div className={`badge ${
                            session.status === 1 ? 'badge-success' : 'badge-error'
                          }`}>
                            {session.status === 1 ? 'P' : 'A'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                  <p className="text-base-content/70">No session records available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="card bg-base-200 shadow-lg mt-6">
          <div className="card-body">
            <h3 className="text-xl font-bold text-base-content mb-4">Attendance Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Classes */}
              <div className="space-y-2">
                <h4 className="font-semibold text-base-content">To Reach 75%</h4>
                <div className="bg-base-300 p-4 rounded-lg">
                  {subject.percentage >= 75 ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span>You've already met the 75% requirement!</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base-content/70 mb-2">
                        You need to attend at least:
                      </p>
                      <div className="text-2xl font-bold text-primary">
                        {Math.ceil((0.75 * subject.totalDays - subject.presentDays) / (1 - 0.75))} more classes
                      </div>
                      <p className="text-sm text-base-content/60 mt-1">
                        without any absences
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Maximum Leaves */}
              <div className="space-y-2">
                <h4 className="font-semibold text-base-content">Maximum Leaves Available</h4>
                <div className="bg-base-300 p-4 rounded-lg">
                  {subject.percentage <= 75 ? (
                    <div className="flex items-center gap-2 text-warning">
                      <XCircle className="w-5 h-5" />
                      <span>Cannot afford any more leaves</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-base-content/70 mb-2">
                        You can miss:
                      </p>
                      <div className="text-2xl font-bold text-accent">
                        {Math.floor((subject.presentDays - 0.75 * subject.totalDays) / 0.75)} classes
                      </div>
                      <p className="text-sm text-base-content/60 mt-1">
                        while maintaining 75%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {subject.percentage < 75 && (
              <div className="alert alert-warning mt-4">
                <span className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Your attendance is below the required 75%. Please attend classes regularly to meet the requirement.
                </span>
              </div>
            )}

            {subject.percentage >= 90 && (
              <div className="alert alert-success mt-4">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Excellent attendance! Keep up the great work!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/students/home')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}