import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      audioChunksRef.current = [];
      setAudioBlob(audioBlob);
    };
    setIsRecording(false);
  };

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const uploadAudioFile = async (blob) => {
    // Implement your file upload logic here.
    // Return the public URL of the uploaded file.
    // Example: return 'https://example.com/path/to/your/audio.wav';
  };

  const downloadPdfWithAudio = async () => {
    if (!audioBlob) return;
  
    // Convert audio blob to Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      const audioDataUrl = `data:audio/wav;base64,${base64String}`;
  
      // Create a new jsPDF document
      const pdfDoc = new jsPDF();
  
      // Add patient information text
      pdfDoc.text('Patient Information', 20, 20);
      pdfDoc.text(`Name: ${patientName}`, 20, 30);
      pdfDoc.text(`DOB: ${patientDob}`, 20, 40);
  
      // Add a clickable link to the PDF that uses the data URL
      pdfDoc.textWithLink('Click to listen to the recorded audio', 20, 60, { url: audioDataUrl });
  
      // Save the PDF and trigger download
      pdfDoc.save('patient_info.pdf');
    };
  
    reader.readAsDataURL(audioBlob);
  };
  

  return (
    <div>
      <h1>Record Patient Information</h1>

      <label htmlFor="patient-name">Patient Name:</label>
      <input
        type="text"
        id="patient-name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter patient name"
      /><br /><br />

      <label htmlFor="patient-dob">Patient Date of Birth:</label>
      <input
        type="date"
        id="patient-dob"
        value={patientDob}
        onChange={(e) => setPatientDob(e.target.value)}
      /><br /><br />

      <button onClick={handleButtonClick}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioBlob && (
        <div>
          <h3>Recorded Audio Ready</h3>
          
          {/* Audio Player */}
          <audio controls>
            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>

          <button onClick={downloadPdfWithAudio}>Download PDF with Audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
