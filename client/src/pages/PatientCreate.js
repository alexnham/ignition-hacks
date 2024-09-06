import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const PatientCreate = () => {
  // const { id } = useParams(); // Get patient ID from URL
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [patient, setPatient] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const { user } = useAuthContext;
  // const [isEditing, setIsEditing] = useState(false);
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
    const validateForm = async () => {
      setIsValid(true);
      const newErrors = {};

      // alert(data.healthcareID.toString());
      try {
        const response = await fetch(`http://localhost:4000/api/patients?healthcareID=${formValues.healthcareID}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
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
          // console.log(data);
          // console.log(formValues.healthcareID);
          // console.log(data !== formValues.healthcareID);
          if (data) {
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
  }, [formValues, patient?.healthcareID, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === 'healthcareID' ? value.toUpperCase() : value,
    }));
  };

  const handleCreate = async () => {
    if (isValid) {
      const response = await fetch(`http://localhost:4000/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        setPatient(updatedPatient);
        console.log(updatedPatient);
        navigate(`/patients/${updatedPatient._id}`)
        // setIsEditing(false);
      } else {
        // Handle server-side validation errors
        const json = await response.json();
        setErrors(json.errors || {});
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="flex justify-center mt-4 m-10">
        <button
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-2xl font-bold"
        >
          Home
        </button>
      </div>

      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        {/* <div> */}
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
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
        {/* </div> */}
      </div>
    </div>

  );
}

export default PatientCreate