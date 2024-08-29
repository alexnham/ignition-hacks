import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PatientPage = () => {
  const { id } = useParams(); // Get patient ID from URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [patient, setPatient] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [formValues, setFormValues] = useState({
    preferredName: '',
    dateOfBirth: '',
    healthcareID: '',
    email: '',
    phoneNumber: '',
    phoneNumberExtension: '',
    notes: '',
  });
  const [errors, setErrors] = useState({
    preferredName: '',
    dateOfBirth: '',
    healthcareID: '',
    email: '',
    phoneNumber: '',
    phoneNumberExtension: '',
    notes: '',
  });

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await fetch(`http://localhost:4000/api/patients/${id}`);
      if (response.ok) {
        const json = await response.json();
        setPatient(json);
        setFormValues({
          preferredName: json.preferredName,
          dateOfBirth: json.dateOfBirth,
          healthcareID: json.healthcareID,
          email: json.email || '',
          phoneNumber: json.phoneNumber || '',
          phoneNumberExtension: json.phoneNumberExtension || '',
          notes: json.notes || '',
        });
      } else if (response.status === 404 || response.status === 400) {
        setNotFound(true);
      }
    };

    fetchPatient();
  }, [id]); // Fetch data whenever the ID changes

  useEffect(() => {
    const validateForm = async () => {
      setIsValid(true);
      const newErrors = {};
      
      // alert(data.healthcareID.toString());
      try {
        const response = await fetch(`http://localhost:4000/api/patients?healthcareID=${formValues.healthcareID}`, {
          method: 'GET'
        });
        // Form validation logic

        if (!formValues.preferredName) {
          newErrors.preferredName = 'Preferred Name is required.';
          setIsValid(false);
        }

        if (!formValues.dateOfBirth) {
          newErrors.dateOfBirth = 'Date of Birth is required.';
          setIsValid(false);
        }

        if (!formValues.healthcareID.match(/^[A-Za-z0-9\s-]+$/)) {
          newErrors.healthcareID = 'Healthcare ID can only contain letters, numbers, spaces, and dashes.';
          setIsValid(false);
        }

        if (response.ok) {
          const json = await response.json();
          const data = json.healthcareID;
          if (data && data !== patient.healthcareID) {
            newErrors.healthcareID = 'Healthcare ID exist';
            setIsValid(false);
          }
        }

        if (formValues.email && !formValues.email.match(/^.+@.+\..+$/)) {
          newErrors.email = 'Please enter a valid email address.';
          setIsValid(false);
        }

        if (formValues.phoneNumber && !formValues.phoneNumber.match(/^\+?[0-9]*$/)) {
          newErrors.phoneNumber = 'Phone Number should be numeric with optional international code.';
          setIsValid(false);
        }

        setErrors(newErrors);
      } catch (error) {
        console.error('Error validating form:', error);
      }
    };
    validateForm();
  }, [formValues, patient?.healthcareID]);


  const handleDelete = async () => {
    const response = await fetch(`http://localhost:4000/api/patients/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Redirect to the list page or another appropriate page after deletion
      navigate('/patients');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Revert form values to original patient data
    setFormValues({
      preferredName: patient.preferredName,
      dateOfBirth: patient.dateOfBirth,
      healthcareID: patient.healthcareID,
      email: patient.email || '',
      phoneNumber: patient.phoneNumber || '',
      phoneNumberExtension: patient.phoneNumberExtension || '',
      notes: patient.notes || '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'healthcareID' ? value.toUpperCase() : value,
    }));
  };


  const handleSave = async () => {
    if (isValid) {
      const response = await fetch(`http://localhost:4000/api/patients/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        setPatient(updatedPatient);
        setIsEditing(false);
      } else {
        // Handle server-side validation errors
        const json = await response.json();
        setErrors(json.errors || {});
      }
    }
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 text-center">
        <p className="text-lg mb-4">Patient not found.</p>
        <button
          onClick={() => navigate('/patients')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Patients List
        </button>
      </div>
    ); // Show not found message and button to go back
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-lg">Loading...</p>
      </div>
    ); // Show loading state while fetching
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* {formValues.healthcareID.match(/^[A-Za-z0-9\s-]+$/)} */}
      {/* <br></br> */}
      {/* {isValid.toString()} */}
      <div className="flex justify-center mt-4 m-10">
        <button
          onClick={() => navigate('/patients')}
          className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-2xl font-bold"
        >
          Back to Patients List
        </button>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        {isEditing ? (
          <div>
            <h1 className="text-4xl font-bold mb-6">Edit Patient</h1>

            <form className="space-y-4">
              <div className="mb-6">
                <label className="block text-2xl font-semibold">Preferred Name:</label>
                <input
                  type="text"
                  name="preferredName"
                  value={formValues.preferredName}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.preferredName && <p className="text-red-500 text-sm">{errors.preferredName}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Date of Birth:</label>
                <input
                  type="datetime-local"
                  name="dateOfBirth"
                  value={formValues.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Healthcare ID:</label>
                <input
                  type="text"
                  name="healthcareID"
                  value={formValues.healthcareID}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.healthcareID && <p className="text-red-500 text-sm">{errors.healthcareID}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Phone Number:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Phone Number Extension:</label>
                <input
                  type="text"
                  name="phoneNumberExtension"
                  value={formValues.phoneNumberExtension}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.phoneNumberExtension && <p className="text-red-500 text-sm">{errors.phoneNumberExtension}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-2xl font-semibold">Notes:</label>
                <textarea
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
                {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold mb-6">{patient.preferredName}</h1>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Date of Birth:</h2>
              <p className="text-lg">
                {new Date(patient.dateOfBirth).toLocaleString('en-US', {
                  // dateStyle: 'full',
                  // timeStyle: 'short',
                  timeZoneName: 'longOffset',
                })}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Healthcare ID:</h2>
              <p className="text-lg break-words">{patient.healthcareID}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Email:</h2>
              <p className="text-lg break-words">{patient.email || 'Not provided'}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Phone Number:</h2>
              <p className="text-lg break-words">{patient.phoneNumber || 'Not provided'}</p>
            </div>

            {patient.phoneNumberExtension && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Phone Number Extension:</h2>
                <p className="text-lg break-words">{patient.phoneNumberExtension}</p>
              </div>
            )}

            {/* {patient.notes && ( */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Notes:</h2>
                <p className="text-lg break-words">{patient.notes || 'Not provided'}</p>
              </div>
            {/* )} */}

            <div className="flex justify-between mt-8">
              <button
                onClick={handleEditClick}
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xl font-semibold"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xl font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPage;
