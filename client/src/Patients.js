import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import PatientDetails from './components/PatientDetails';


const Patients = () => {
  const [patients, setPatients] = useState(null);


  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch('http://localhost:4000/api/patients')
      const json = await response.json();

      if (response.ok) {
        setPatients(json);
      }
    }

    fetchPatients();
  }, [])

  return (
    <div className="patients flex flex-wrap gap-2 p-2">
      {patients && patients.map((patient) => (
        <Link>
          <PatientDetails key={patient._id} patient={patient} />
        </Link>
      ))}
    </div>
  )

}

export default Patients;