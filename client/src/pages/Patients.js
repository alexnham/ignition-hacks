import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientDetails from '../components/PatientDetails';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';


const Patients = () => {
  const { user } = useAuthContext;
  const [patients, setPatients] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:4000/api/patients', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        setPatients(json);
      }
    };

    fetchPatients();
  }, [user]);

  const handleGoHome = () => {
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="relative p-4"> {/* Add padding to avoid overlap */}
      {/* Button to go back to home page */}
      <button
        onClick={handleGoHome}
        className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-2xl font-bold"
      >Home
      </button>

      <div className="patients mt-12 flex flex-wrap gap-2"> {/* Add margin-top to provide space for the button */}
        {patients && patients.map((patient) => (
          <Link to={`/patients/${patient._id}`} key={patient._id}>
            <PatientDetails patient={patient} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Patients;
