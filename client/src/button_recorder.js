import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [related, setRelated] = useState([]);
  const [fullSummary, setFullSummary] = useState('')
  const [relatedFinal, setRelatedFinal] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  
  const startRecording = async () => {
    setTranscript('');
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
      setIsLoading(true);

      try {
        const transcript = await transcribeAudio(audioBlob);
        const formattedTranscript = await splitTranscript(transcript);
        setTranscript(formattedTranscript);
        setSummary(await summarizeTranscript(formattedTranscript));
        setFullSummary(await(summarize(formattedTranscript)))
      } catch (error) {
        console.error('Error processing audio:', error);
      } finally {
        setIsLoading(false);
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
        body: audioBlob,
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

  const summarizeTranscript = async (transcript) => {
    try {
      const response = await fetch('http://localhost:3000/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Summarize this transcript in jot notes: ${transcript}, Speaker 1 is a doctor. make sure speaker is not said, and it's like real doctor notes. Return any medical advice/and or notes you think are necessary. Return your response only with the summary.`,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error summarizing transcript:', error);
      return '';
    }
  };
  const summarize = async (transcript) => {
    try {
      const response = await fetch('http://localhost:3000/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Summarize this full transcript ${transcript}, Speaker 1 is a doctor. make sure speaker is not said, and it's like real doctor notes. Return any medical advice/and or notes you think are necessary. Return your response only with the summary.`,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error summarizing transcript:', error);
      return '';
    }
  };

  const splitTranscript = async (transcript) => {
    try {
      const response = await fetch('http://localhost:3000/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Split this transcript into two speakers and format it: ${transcript}` }),
      });

      if (!response.ok) {
        throw new Error('OpenAI API response was not ok.');
      }
      const data = await response.json();
      return formatTranscript(data.message || '');
    } catch (error) {
      console.error('Error splitting transcript:', error);
      return '';
    }
  };

  const formatTranscript = (transcript) => {
    let cleanedTranscript = transcript.replace(/\*\*/g, '');
    const endPattern = /Certainly! Here is the formatted transcript split into two speakers: .*/;
    cleanedTranscript = cleanedTranscript.replace(endPattern, '').trim();
    return cleanedTranscript;
  };

  const handleButtonClick = () => {
    isRecording ? stopRecording() : startRecording();
  };

  const downloadPdf = async () => {
    if (!audioBlob) return;
  
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([600, 1000]);
    const { width, height } = page.getSize();
    const fontSize = 14;
    const lineHeight = fontSize * 1.2;
    let yPosition = height - 50;
  
    const addNewPage = () => {
      page = pdfDoc.addPage([600, 1000]);
      yPosition = height - 50;
    };
  
    // Helper function to handle yPosition and page breaks
    const checkForPageBreak = (additionalHeight) => {
      if (yPosition - additionalHeight < 50) {
        addNewPage();
      }
    };
  
    // Draw patient information
    page.drawText('Patient Information - Dr Khangura', { x: 50, y: yPosition, size: 18, color: rgb(0, 0, 0) });
    yPosition -= 30;
    page.drawText(`ID: ${patientId}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
    yPosition -= lineHeight;
    page.drawText(`Name: ${patientName}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
    yPosition -= lineHeight;
    page.drawText(`DOB: ${patientDob}`, { x: 50, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
    yPosition -= 40;
  

    // Draw full summary
    if (fullSummary.message && fullSummary.message.trim() !== '') {
      const summaryLines = fullSummary.message.split('\n');
      yPosition -= lineHeight;
      page.drawText('Summary:', { x: 50, y: yPosition + 20, size: 18, color: rgb(0, 0, 0) });

      summaryLines.forEach((line) => {
        checkForPageBreak(lineHeight);
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
          maxWidth: 500,
          lineHeight: lineHeight,
        });
        yPosition -= lineHeight;
      });
    }
    yPosition -= 100;
    // Draw additional notes (summary)
    if (summary.message && summary.message.trim() !== '') {
      checkForPageBreak(100);
      page.drawText('Notes:', { x: 50, y: yPosition, size: 18, color: rgb(0, 0, 0) });
      yPosition -= lineHeight;
  
      const summaryLines = summary.message.split('\n');
      summaryLines.forEach((line) => {
        checkForPageBreak(lineHeight);
        page.drawText(line, { x: 50, y: yPosition, size: fontSize, color: rgb(0, 0, 0) });
        yPosition -= lineHeight;
      });
    }
  
    const pdfBytes = await pdfDoc.save();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    link.download = `${patientName}_Patient_Report.pdf`;
    link.click();
  };



  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Record Patient Information</h1>

      <label htmlFor="patient-id" className="block text-lg font-medium mb-2">Patient ID:</label>
      <input
        type="text"
        id="patient-id"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        placeholder="Enter patient ID"
        className="w-full p-2 border border-gray-300 rounded-md"
      /><br /><br />

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
        className={`px-4 py-2 text-white font-bold rounded-md ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {isLoading && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md text-center">
          <div className="ellipsis">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-lg font-semibold mt-2">Processing</p>
        </div>
      )}
      {summary && !isLoading && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Summary Ready</h3>
          <button
            onClick={downloadPdf}
            className="mt-2 px-4 py-2 text-white bg-green-500 rounded-md"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
