import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AudioRecorder from './Home';
import Patients from './Patients';
import PatientPage from './PatientPage'
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import PatientCreate from './PatientCreate';


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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
