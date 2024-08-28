import React from 'react';

const PatientDetails = ({ patient }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-4 w-[23rem] h-48 overflow-hidden">
      <h4 className="text-xl font-bold mb-2 truncate">{patient.preferredName}</h4>
      <p className="text-gray-700 text-sm mb-1 truncate">
        <strong>Health Care ID: </strong>
        {patient.healthcareID}
      </p>
      <p className="text-gray-700 text-sm mb-1 truncate">
        <strong>Email: </strong>
        {patient.email}
      </p>
      <p className="text-gray-700 text-sm mb-1 truncate">
        <strong>Phone Number: </strong>
        {patient.phoneNumber}
      </p>
      <p className="text-gray-700 text-sm mb-1 truncate">
        <strong>Date of Birth: </strong>
        {new Date(patient.dateOfBirth).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
          // timeZoneName: 'short',
        })}
      </p>
      <p className="text-gray-700 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
        <strong>Notes: </strong>
        {patient.notes}
      </p>
    </div>
  );
};

export default PatientDetails;
