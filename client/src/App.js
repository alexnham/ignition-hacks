import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AudioRecorder from './pages/AudioRecorder';
import Patients from './pages/Patients';
import PatientPage from './pages/PatientPage'
import Login from './pages/Login';
import Signup from './pages/Signup';
// import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import PatientCreate from './pages/PatientCreate';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            {/* Add the AudioRecorder component */}
            <Route path="/" element={<AudioRecorder />} />
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
