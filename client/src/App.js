import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AudioRecorder from './button_recorder';
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon


function App() {
  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <BrowserRouter>
        {/* Add the AudioRecorder component */}
        <div className="pages">
          <Routes>
            <Route path="/" element={<AudioRecorder />} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
