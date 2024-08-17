import React, { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

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

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const downloadPdfWithAudio = async () => {
    if (!audioBlob) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    // Draw text on the PDF
    page.drawText('Patient Information', { x: 50, y: height - 50, size: 18, color: rgb(0, 0, 0) });
    page.drawText(`Name: ${patientName}`, { x: 50, y: height - 100, size: 14, color: rgb(0, 0, 0) });
    page.drawText(`DOB: ${patientDob}`, { x: 50, y: height - 130, size: 14, color: rgb(0, 0, 0) });

    // Convert audio to base64 for embedding
    const audioArrayBuffer = await audioBlob.arrayBuffer();
    const audioBase64 = arrayBufferToBase64(audioArrayBuffer);

    // Draw an annotation linking to the base64-encoded audio data
    page.drawText('Click to access the audio file:', { x: 50, y: height - 160, size: 14, color: rgb(0, 0, 1) });

    // Embed a link annotation (a clickable link that triggers the download)
    page.drawRectangle({
      x: 50,
      y: height - 170,
      width: 200,
      height: 20,
      color: rgb(0, 0, 1),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Add the link text
    page.drawText('Download audio', {
      x: 55,
      y: height - 180,
      size: 14,
      color: rgb(1, 1, 1),
      link: `data:audio/wav;base64,${audioBase64}`, // this will prompt the download when clicked
    });

    // Save the PDF and trigger download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'patient_info.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <button onClick={downloadPdfWithAudio}>Download PDF with Audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
