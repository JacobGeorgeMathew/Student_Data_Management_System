import React from 'react'
import { Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

//common pages
import StartingPage from './pages/StartingPage';

//student pages
import StudentSignupPage from './pages/student/StudentSignUpPage';
import StudentLoginPage from './pages/student/StudentLoginPage';
import StudentHomePage from './pages/student/StudentHomePage';
import AttendanceDetailPage from './pages/student/AttendanceDetailPage';

//Teacher pages
import TeacherHomePage from './pages/teacher/TeacherHomePage';
import TeacherSignupPage from './pages/teacher/TeacherSignupPage';
import TeacherLoginPage from './pages/teacher/TeacherLoginPage';
import MarkAttendancePage from './pages/teacher/MarkAttendancePage';

const App = () => {

  //send a request to /me
  return (
    <div data-theme="forest">
      
       <AuthProvider>
        <Routes>
          {/* ----------- PUBLIC ROUTES ----------- */}
          <Route path="/" element={<StartingPage />} />

          {/* Student public routes */}
          <Route path="/students/login" element={<StudentLoginPage />} />
          <Route path="/students/signup" element={<StudentSignupPage />} />

          {/* Teacher public routes */}
          <Route path="/teachers/login" element={<TeacherLoginPage />} />
          <Route path="/teachers/signup" element={<TeacherSignupPage />} />

          {/* ----------- PROTECTED ROUTES ----------- */}

          {/* General home page */}
          { /* <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          /> */ }

          {/* Student protected routes */}
          <Route
            path="/students/home"
            element={
              <ProtectedRoute role="student">
                <StudentHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/attendance/:subjectId"
            element={
              <ProtectedRoute role="student">
                <AttendanceDetailPage />
              </ProtectedRoute>
            }
          />
         { /*<Route
            path="/students/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />*/}

          {/* Teacher protected routes */}
          <Route
            path="/teachers/home"
            element={
              <ProtectedRoute role="teacher">
                <TeacherHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/mark-attendance"
            element={
                <ProtectedRoute role="teacher">
                  <MarkAttendancePage />
                </ProtectedRoute>
            }
          />
          {/*<Route
            path="/teachers/profile"
            element={
              <ProtectedRoute role="teacher">
                <TeacherProfilePage />
              </ProtectedRoute>
            }
          />*/ }

          {/* 404 - Catch all unknown routes */}
          { /* <Route path="*" element={<NotFound />} /> */ }
        </Routes>
    </AuthProvider>
    </div>
  )
}

export default App