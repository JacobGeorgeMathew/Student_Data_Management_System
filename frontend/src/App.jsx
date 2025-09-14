import React from 'react'
import { Route,Routes } from "react-router";

import StartingPage from './pages/StartingPage';
//import StudentSignUpPage from './pages/student/StudentSignUpPage';
//import StudentSignIn from './pages/student/StudentSignIn';

const App = () => {
  return (
    <div data-theme="forest">
      
      <Routes>
        <Route path='/' element={<StartingPage />} />
      </Routes>
    </div>
  )
}

export default App