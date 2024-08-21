import React from 'react';

const PatientDetails = ({ patient }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4 w-96 h-48 overflow-hidden">
      <h4 className="text-xl font-bold mb-2 truncate">{patient.preferredName}</h4>
      <p className="text-gray-700 text-sm mb-1 truncate"><strong>Health Care ID: </strong>{patient.healthcareID}</p>
      {patient.email && <p className="text-gray-700 text-sm mb-1 truncate"><strong>Email: </strong>{patient.email}</p>}
      {patient.phoneNumber && <p className="text-gray-700 text-sm mb-1 truncate"><strong>Phone Number: </strong>{patient.phoneNumber}</p>}
      <p className="text-gray-700 text-sm mb-1 truncate"><strong>Date of Birth: </strong>{patient.dateOfBirth}</p>
      <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
        <strong>Notes: </strong>{patient.notes}
      </p>
    </div>
  );
};

export default PatientDetails;
