import React from 'react'
import { Route,Routes } from "react-router";

import StartingPage from './pages/StartingPage';
//import StudentSignUpPage from './pages/student/StudentSignUpPage';
//import StudentSignIn from './pages/student/StudentSignIn';
//import StudentAuthSystem from './pages/student/StudentSignUpPage';
//import TeacherAuthSystem from './pages/teacher/TeacherSignupPage';
import StudentSignupPage from './pages/student/StudentSignUpPage';
import StudentLoginPage from './pages/student/StudentSignIn';

const App = () => {

  //send a request to /me
  return (
    <div data-theme="forest">
      
      <Routes>
        <Route path='/' element={<StartingPage />} />
        <Route path='/student/register' element={<StudentSignupPage />} />
        <Route path='/student/login' element={<StudentLoginPage />} />
      </Routes>
    </div>
  )
}

export default App