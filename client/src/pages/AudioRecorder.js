import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import { useNavigate, Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import NavBar from '../components/NavBar'
import { useAuthContext } from '../hooks/useAuthContext';
// import { useAuthContext } from '../hooks/useAuthContext';

const AudioRecorder = () => {
  const [patients, setPatients] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientDob, setPatientDob] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [fullSummary, setFullSummary] = useState('')
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();
  // const { logout } = useLogout();
  const { user } = useAuthContext

  const goToPatients = () => {
    navigate("/patients");
  }

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:4000/api/patients', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json();

      if (response.ok) {
        setPatients(json);
      }
    }

    if (user) {
      fetchPatients();
    }
  }, [user])

  // function getLastWord(str) {
  //   const words = str.trim().split(/\s+/); // Split by one or more spaces
  //   return words[words.length - 1];        // Return the last word
  // }

  const handleCheckPatient = async () => {
    const idPattern = /^[A-Z0-9]+$/; // Pattern to accept only capital letters and numbers

    if (!idPattern.test(patientId)) {
      alert('Invalid Patient ID format. It should only contain capital letters and numbers.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/patients?healthcareID=${patientId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      console.log(response)
      const data = await response.json();

      if (response.ok) {
        setPatientName(data.name || '');
        setPatientDob(data.dob || '');
        setPatientDetails(data || '');
      } else {
        alert('Patient ID not found.');
        setPatientName('');
        setPatientDob('');
        setPatientDetails('');
      }
    } catch (error) {
      console.error('Error checking patient:', error);
      alert('An error occurred while checking the patient.');
      setPatientName('');
      setPatientDob('');
      setPatientDetails('');
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsLoading(true);

      try {
        const transcript = await transcribeAudio(audioBlob);
        const formattedTranscript = await splitTranscript(transcript);
        setSummary(await summarizeTranscript(formattedTranscript));
        setFullSummary(await (summarize(formattedTranscript)))
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
      const response = await fetch('http://localhost:4000/openai', {
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
      const response = await fetch('http://localhost:4000/openai', {
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
      const response = await fetch('http://localhost:4000/openai', {
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

  const handleCreatePatientClick = () => {
    navigate('/patients/create')
  }

  // const handleLoginClick = () => {
  //   navigate('/login');
  // }

  // const handleLogout = () => {
  //   logout();
  // }

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

      <NavBar />
      {/* <div>
        {user && (
          <div>
            <h1 className='text-xl absolute top-10 left-10'>Logged In As: Dr. {getLastWord(user.fullName)}</h1>

            <button
              onClick={handleLogout}
              className="absolute top-10 right-10 px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Log Out
            </button>
          </div>
        )}

        {!user && (
          <div>
            <button
              onClick={handleLoginClick}
              className="absolute top-10 right-10 px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Log In
            </button>
          </div>
        )}
      </div> */}


      <div className="flex justify-center absolute top-10 mb-6">
        <Link to={"/"}>
          <PencilSquareIcon className="h-16 w-16 text-blue-500" />
        </Link>
      </div>

      <div className='flex flex-row flex-wrap items-center justify-center gap-4'>
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
          />
          <br /><br />

          <label htmlFor="patient-name" className="block text-lg font-medium mb-2">Patient Name:</label>
          <input
            type="text"
            id="patient-name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <br /><br />

          <label htmlFor="patient-dob" className="block text-lg font-medium mb-2">Patient Date of Birth:</label>
          <input
            type="date"
            id="patient-dob"
            value={patientDob}
            onChange={(e) => setPatientDob(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <br /><br />

          <button
            onClick={handleButtonClick}
            className={`px-4 py-2 text-white font-bold rounded-md ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>

          <button
            onClick={handleCreatePatientClick}
            className={`px-4 py-2 text-white font-bold rounded-md bg-blue-500 m-1`}
          >
            {/* {isRecording ? 'Stop Recording' : 'Start Recording'} */}
            Create Patient
          </button>

          <div className="mt-4 flex gap-4">
            <button
              onClick={goToPatients}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Go to Patients
            </button>
            <button
              onClick={handleCheckPatient}
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Check Patient
            </button>
          </div>

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

        {patientDetails &&
          <Link to={`/patients/${patientDetails._id}`} key={patientDetails._id}>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl font-bold mb-4">Patient Information</h1>

              <div className="block text-lg font-medium mb-2">
                <strong>Patient ID: </strong>
                {patientDetails && patientDetails.healthcareID}
              </div>
              <div className="block text-lg font-medium mb-2">
                <strong>Patient Name: </strong>
                {patientDetails && patientDetails.preferredName}
              </div>
              <div className="block text-lg font-medium mb-2">
                <strong>Patient Date of Birth: </strong>
                {patientDetails && new Date(patientDetails.dateOfBirth).toLocaleString('en-US', {
                  // dateStyle: 'full',
                  // timeStyle: 'short',
                  timeZoneName: 'longOffset',
                })}
              </div>
              <div className="block text-lg font-medium mb-2">
                <strong>Patient Email: </strong>
                {patientDetails.email || 'Not Provided'}
              </div>
              <div className="block text-lg font-medium mb-2">
                <strong>Patient Phone Number: </strong>
                {patientDetails.phoneNumber || 'Not Provided'}
              </div>
            </div>
          </Link>
        }

      </div>
    </div>
  );
};

export default AudioRecorder;
