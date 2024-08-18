import React, { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
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
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      audioChunksRef.current = [];
      setAudioBlob(audioBlob);

      try {
        const transcript = await transcribeAudio(audioBlob);
        const formattedTranscript = await splitTranscript(transcript);
        setTranscript(formattedTranscript);
      } catch (error) {
        console.error('Error processing audio:', error);
      }
    };

    setIsRecording(false);
  };

  const transcribeAudio = async (audioBlob) => {
    try {
      const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
          'Authorization': `Token d27deb12027a5ec2bb9d506957eb16789f9e1918`,
        },
        body: audioBlob
      });

      if (!response.ok) {
        throw new Error('Deepgram API response was not ok.');
      }

      const data = await response.json();
      return data.results?.channels[0]?.alternatives[0]?.transcript || '';
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return '';
    }
  };

  const splitTranscript = async (transcript) => {
    try {
      const response = await fetch('http://localhost:3000/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: `Split this transcript into two speakers and format it: ${transcript}` }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API response was not ok.');
      }

      const data = await response.json();
      return formatTranscript(data || '');
    } catch (error) {
      console.error('Error splitting transcript:', error);
      return '';
    }
  };

  const formatTranscript = (transcript) => {
    // Remove any asterisks used for bold formatting
    let cleanedTranscript = transcript.replace(/\*\*/g, '');

    // Remove any ending GPT response formatting
    const endPattern = /Certainly! Here is the formatted transcript split into two speakers: .*/;
    cleanedTranscript = cleanedTranscript.replace(endPattern, '').trim();

    // Split transcript into lines
    const lines = cleanedTranscript.split('\n');

    // Filter lines that start with "Speaker 1:" or "Speaker 2:"
    const filteredLines = lines.filter(line => line.startsWith('Speaker 1:') || line.startsWith('Speaker 2:'));

    // Join the filtered lines back into a single string
    const filteredTranscript = filteredLines.join('\n');

    // Replace "Speaker 1:" and "Speaker 2:" with HTML <strong> tags for bold formatting
    const formattedTranscript = filteredTranscript
        .replace(/Speaker 1:/g, '<strong>Speaker 1:</strong> ')
        .replace(/Speaker 2:/g, '\n<strong>Speaker 2:</strong> ');

    return formattedTranscript;
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

    page.drawText('Patient Information', { x: 50, y: height - 50, size: 18, color: rgb(0, 0, 0) });
    page.drawText(`Name: ${patientName}`, { x: 50, y: height - 100, size: 14, color: rgb(0, 0, 0) });
    page.drawText(`DOB: ${patientDob}`, { x: 50, y: height - 130, size: 14, color: rgb(0, 0, 0) });

    if (transcript) {
      page.drawText(`Transcript: ${transcript}`, { x: 50, y: height - 160, size: 14, color: rgb(0, 0, 0) });
    }

    const audioArrayBuffer = await audioBlob.arrayBuffer();
    const audioBase64 = arrayBufferToBase64(audioArrayBuffer);
    const audioUrl = `data:audio/wav;base64,${audioBase64}`;

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Record Patient Information</h1>

      <label htmlFor="patient-name" className="block text-lg font-medium mb-2">Patient Name:</label>
      <input
        type="text"
        id="patient-name"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter patient name"
        className="w-full p-2 border border-gray-300 rounded-md"
      /><br /><br />

      <label htmlFor="patient-dob" className="block text-lg font-medium mb-2">Patient Date of Birth:</label>
      <input
        type="date"
        id="patient-dob"
        value={patientDob}
        onChange={(e) => setPatientDob(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      /><br /><br />

      <button
        onClick={handleButtonClick}
        className={`px-4 py-2 text-white font-bold rounded-md ${
          isRecording ? 'bg-red-500' : 'bg-blue-500'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioBlob && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recorded Audio Ready</h3>
          <button
            onClick={downloadPdfWithAudio}
            className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Download PDF with Audio
          </button>
        </div>
      )}

      {transcript && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <p dangerouslySetInnerHTML={{ __html: transcript }}></p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
