import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Save, 
  RotateCcw, 
  Users, 
  BookOpen,
  ChevronRight,
  AlertCircle,
  CheckSquare,
  XSquare
} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function MarkAttendance() {
  // Step 1: Session Selection
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Session Info State
  const [sessionData, setSessionData] = useState({
    branch_id: '',
    batch_id: '',
    semester_num: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    hour: ''
  });

  // Step 2: Subject Selection
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);

  // Step 3: Attendance Marking
  const [attendanceResId, setAttendanceResId] = useState(null);
  const [students, setStudents] = useState([]);

  // Mock data for dropdowns (replace with actual API calls if needed)
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

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const hours = [1, 2, 3, 4, 5, 6];

  // Handle session data input
  const handleSessionChange = (field, value) => {
    setSessionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step 1: Fetch subjects for the session
  const handleGetSessionInfo = async () => {
    if (!sessionData.branch_id || !sessionData.batch_id || !sessionData.semester_num || 
        !sessionData.section || !sessionData.date || !sessionData.hour) {
      toast.error('Please fill all session details');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/attendance/session-info', {
        branch_id: parseInt(sessionData.branch_id),
        batch_id: parseInt(sessionData.batch_id),
        semester_num: parseInt(sessionData.semester_num),
        section: sessionData.section,
        date: sessionData.date,
        hour: parseInt(sessionData.hour)
      });

      setSessionInfo(response.data);
      setSubjects(response.data.subjects || []);
      setStep(2);
      toast.success('Session information loaded successfully');
    } catch (error) {
      console.error('Error fetching session info:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch session information');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Check if attendance exists and get students
  const handleSelectSubject = async (subject) => {
    setSelectedSubject(subject);
    setLoading(true);

    try {
      const response = await api.post('/attendance/check-session', {
        class_id: sessionInfo.class_id,
        subject_id: subject.subject_id,
        date: sessionData.date,
        hour: parseInt(sessionData.hour)
      });

      setAttendanceResId(response.data.attendance_res_id);
      setStudents(response.data.students.map(student => ({
        ...student,
        status: student.status !== undefined && student.status !== null ? student.status : 1
      })));
      setStep(3);
      
      if (response.data.attendance_res_id) {
        toast.success('Existing attendance loaded for editing');
      } else {
        toast.success('Ready to mark new attendance');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      toast.error(error.response?.data?.message || 'Failed to check session');
    } finally {
      setLoading(false);
    }
  };

  // Toggle individual student status
  const toggleStudentStatus = (studentId) => {
    setStudents(prev => prev.map(student => 
      student.student_id === studentId 
        ? { ...student, status: student.status === 1 ? 0 : 1 }
        : student
    ));
  };

  // Mark all students present
  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 1 })));
    toast.success('All students marked present');
  };

  // Mark all students absent
  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 0 })));
    toast.success('All students marked absent');
  };

  // Submit attendance
  const handleSubmitAttendance = async () => {
    setLoading(true);
    try {
      const payload = {
        attendance_res_id: attendanceResId,
        branch_id: parseInt(sessionData.branch_id),
        batch_id: parseInt(sessionData.batch_id),
        class_id: sessionInfo.class_id,
        subject_id: selectedSubject.subject_id,
        date: sessionData.date,
        hour: parseInt(sessionData.hour),
        students: students.map(s => ({
          student_id: s.student_id,
          status: s.status
        }))
      };

      const response = await api.post('/attendance/submit', payload);
      
      toast.success(response.data.message || 'Attendance saved successfully!');
      
      // Reset to step 1 after successful submission
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setStep(1);
    setSessionData({
      branch_id: '',
      batch_id: '',
      semester_num: '',
      section: '',
      date: new Date().toISOString().split('T')[0],
      hour: ''
    });
    setSubjects([]);
    setSelectedSubject(null);
    setSessionInfo(null);
    setAttendanceResId(null);
    setStudents([]);
  };

  // Calculate attendance statistics
  const getPresentCount = () => students.filter(s => s.status === 1).length;
  const getAbsentCount = () => students.filter(s => s.status === 0).length;

  return (
    <div className="min-h-screen bg-base-100 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-base-content mb-2">Mark Attendance</h1>
          <p className="text-base-content/70">Record student attendance for your class</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <ul className="steps steps-horizontal w-full">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Session Details</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Select Subject</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Mark Attendance</li>
          </ul>
        </div>

        {/* Step 1: Session Selection */}
        {step === 1 && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <Calendar className="w-6 h-6" />
                Session Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Branch */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Branch</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={sessionData.branch_id}
                    onChange={(e) => handleSessionChange('branch_id', e.target.value)}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>

                {/* Batch */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Batch</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={sessionData.batch_id}
                    onChange={(e) => handleSessionChange('batch_id', e.target.value)}
                  >
                    <option value="">Select Batch</option>
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Semester</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={sessionData.semester_num}
                    onChange={(e) => handleSessionChange('semester_num', e.target.value)}
                  >
                    <option value="">Select Semester</option>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Section</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={sessionData.section}
                    onChange={(e) => handleSessionChange('section', e.target.value)}
                  >
                    <option value="">Select Section</option>
                    {sections.map(sec => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date</span>
                  </label>
                  <input 
                    type="date"
                    className="input input-bordered w-full"
                    value={sessionData.date}
                    onChange={(e) => handleSessionChange('date', e.target.value)}
                  />
                </div>

                {/* Hour */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Hour</span>
                  </label>
                  <select 
                    className="select select-bordered w-full"
                    value={sessionData.hour}
                    onChange={(e) => handleSessionChange('hour', e.target.value)}
                  >
                    <option value="">Select Hour</option>
                    {hours.map(hour => (
                      <option key={hour} value={hour}>Hour {hour}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button 
                  className="btn btn-primary"
                  onClick={handleGetSessionInfo}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Subject Selection */}
        {step === 2 && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">
                <BookOpen className="w-6 h-6" />
                Select Subject
              </h2>

              {subjects.length === 0 ? (
                <div className="alert alert-warning">
                  <AlertCircle className="w-5 h-5" />
                  <span>No subjects found for this session</span>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <div 
                      key={subject.subject_id}
                      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-primary"
                      onClick={() => handleSelectSubject(subject)}
                    >
                      <div className="card-body">
                        <h3 className="font-bold text-lg">{subject.subject_name}</h3>
                        <p className="text-sm text-base-content/60">ID: {subject.subject_id}</p>
                        <div className="card-actions justify-end mt-2">
                          <button className="btn btn-sm btn-primary">
                            Select
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="card-actions justify-between mt-6">
                <button 
                  className="btn btn-outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Mark Attendance */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedSubject?.subject_name}</h2>
                    <p className="text-base-content/60">
                      {sessionData.date} • Hour {sessionData.hour} • Section {sessionData.section}
                    </p>
                  </div>
                  {attendanceResId && (
                    <div className="badge badge-info">Editing Existing</div>
                  )}
                </div>

                <div className="stats stats-vertical lg:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Total Students</div>
                    <div className="stat-value text-primary">{students.length}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-success">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Present</div>
                    <div className="stat-value text-success">{getPresentCount()}</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-error">
                      <XCircle className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Absent</div>
                    <div className="stat-value text-error">{getAbsentCount()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={markAllPresent}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Mark All Present
                  </button>
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={markAllAbsent}
                  >
                    <XSquare className="w-4 h-4" />
                    Mark All Absent
                  </button>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4">Student Attendance</h3>

                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.student_id}>
                          <td className="font-semibold">{student.student_id}</td>
                          <td>{student.name}</td>
                          <td className="text-center">
                            <button
                              className={`btn btn-sm ${
                                student.status === 1 
                                  ? 'btn-success' 
                                  : 'btn-error'
                              }`}
                              onClick={() => toggleStudentStatus(student.student_id)}
                            >
                              {student.status === 1 ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Present
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Absent
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card-actions justify-between mt-6">
                  <button 
                    className="btn btn-outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-ghost"
                      onClick={resetForm}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={handleSubmitAttendance}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Attendance
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}