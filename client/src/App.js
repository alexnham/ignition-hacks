import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AudioRecorder from './pages/AudioRecorder';
import Patients from './pages/Patients';
import PatientPage from './pages/PatientPage'
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
// import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import PatientCreate from './pages/PatientCreate';
import { useAuthContext } from './hooks/useAuthContext';


function App() {
  const { user } = useAuthContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("user: \n", user);

    // if (user) {
    //   setIsLoggedIn(true);
    // } else {
    //   setIsLoggedIn(false);
    // }
    // console.log("isLoggedIn: ", isLoggedIn);
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            {/* Add the AudioRecorder component */}
            <Route path="/" element={user ? <AudioRecorder /> : <Home />} />
            {/* <Route path="/doctor" element={<AudioRecorder />} /> */}
            {/* <Route path="/" element={<AudioRecorder />} /> */}
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientPage />} />
            <Route path="/patients/create" element={<PatientCreate />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
