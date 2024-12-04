import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; // Updated Firebase imports
import { db } from '../../../../../firebase/firebase'; // Adjust the path as necessary
import './guardian.css'; 

const GuardianForm = () => {
  const [isUnableToProvide, setIsUnableToProvide] = useState(false);
  const [childName, setChildName] = useState(''); // Child name state
  const [relationship, setRelationship] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [occupation, setOccupation] = useState('');

  // Mother Information states
  const [motherName, setMotherName] = useState(''); // Mother's name state
  const [motherOccupation, setMotherOccupation] = useState(''); // Mother's occupation state
  
  // Submission status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start submission

    try {
      // Reference to the 'admissions' collection
      const admissionsRef = collection(db, 'admissions');

      // Create a query against the collection where 'childName' equals the entered childName
      const q = query(admissionsRef, where('childName', '==', childName));

      // Execute the query
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a matching document is found, update it with guardian details
        const childDoc = querySnapshot.docs[0]; // Assuming childName is unique
        const childDocRef = doc(db, 'admissions', childDoc.id);

        await updateDoc(childDocRef, {
          guardianDetails: {
            relationship,
            permanentAddress,
            residentialAddress,
            contactNumber,
            emailAddress,
            occupation
          },
          // Add the MotherInformation data here
          motherInformation: {
            motherName, // Mother's name
            motherOccupation, // Mother's occupation
          }
        });

        console.log("Guardian's data saved successfully");
        navigate('/home3'); // Navigate after successful submission
      } else {
        // If no matching document is found, log an error or handle accordingly
        console.error("No document found for the entered child name.");
        // Optionally, you can create a new document or notify the user
      }
    } catch (error) {
      console.error("Error saving guardian details:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  const handlePrevious = () => {
    navigate('/parent-guardian-details');
  };

  return (
    <div className="form-container">
      <form onSubmit={handleNext}>
        <div className="step-indicator">
          <div className="step active-step">01</div>
          <div className="step active-step">02</div>
          <div className="step">03</div>
          <div className="step">04</div>
        </div>

        <div className="step-titles">
          <p>CHILD'S INFORMATION</p>
          <p>PARENT OR GUARDIAN DETAILS</p>
          <p>OTHER INFORMATION</p>
          <p>TERMS AND CONDITIONS</p>
        </div>

        <div className="form-header">
          <h2>GUARDIAN'S INFORMATION</h2>
          <label>
            <input
              type="checkbox"
              checked={isUnableToProvide}
              onChange={() => setIsUnableToProvide(!isUnableToProvide)}
            />
            If unable to provide, please tick this one
          </label>
        </div>

        {/* Child's Name Input Field */}
        <div className="form-group">
          <label>Child's Full Name *</label>
          <input
            type="text"
            placeholder="Enter the child's full name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
        </div>

        {!isUnableToProvide && (
          <>
            <div className="form-group">
              <label>Relationship with the child</label>
              <input
                type="text"
                placeholder="Relationship with child"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Permanent Address</label>
              <input
                type="text"
                placeholder="Permanent Address"
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Current Residential Address *</label>
              <input
                type="text"
                placeholder="Current Residential Address"
                value={residentialAddress}
                onChange={(e) => setResidentialAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact No *</label>
              <input
                type="text"
                placeholder="Contact Number"
                value={contactNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and limit to 10 digits
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    setContactNumber(value);
                  }
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                placeholder="Occupation"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-footer">
          <button type="button" className="prev-button" onClick={handlePrevious}>
            Previous
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Submitting...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuardianForm;