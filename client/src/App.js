import React from 'react';
import AudioRecorder from './button_recorder';
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon

function App() {
  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className='text-xl absolute top-10 left-10'>Logged In As: Dr. Khangura</h1>
      {/* Add the cool logo */}
      <PencilSquareIcon className="h-16 w-16 text-blue-500 mb-6" />

      {/* Add the AudioRecorder component */}
      <AudioRecorder />
    </div>
  );
}

export default App;
