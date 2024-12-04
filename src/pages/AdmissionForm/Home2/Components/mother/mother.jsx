import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mother.css';
import { db } from '../../../../../firebase/firebase'; // Adjust the path as necessary
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const MotherInformation = ({ childName }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [motherDetails, setMotherDetails] = useState({
    fullName: '',
    permanentAddress: '',
    currentResidentialAddress: '',
    nationality: '',
    dateOfBirth: '',
    contactNo: '',
    telephoneNumber: '',
    occupation: '',
    workplaceContactNo: '',
    workplaceAddress: '',
    emailAddress: '',
    religion: '',
    educationalQualification: [],
    childName: childName || '', // Include child's name in state
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsDisabled(!isDisabled);
  };

  const handleMotherDetailChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'educationalQualification') {
      const updatedQualifications = checked
        ? [...motherDetails.educationalQualification, value]
        : motherDetails.educationalQualification.filter(q => q !== value);

      setMotherDetails(prevDetails => ({ ...prevDetails, educationalQualification: updatedQualifications }));
    } else {
      setMotherDetails(prevDetails => ({
        ...prevDetails,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!motherDetails.childName) {
      alert("Child's name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const admissionsRef = collection(db, 'admissions');
      const q = query(admissionsRef, where('childName', '==', motherDetails.childName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const childDoc = querySnapshot.docs[0];
        const childDocRef = doc(db, 'admissions', childDoc.id);
        await updateDoc(childDocRef, {
          motherDetails: motherDetails
        });
      } else {
        await addDoc(admissionsRef, {
          childName: motherDetails.childName,
          motherDetails: motherDetails
        });
      }

      console.log('Data saved successfully');
      setMotherDetails({
        fullName: '',
        permanentAddress: '',
        currentResidentialAddress: '',
        nationality: '',
        dateOfBirth: '',
        contactNo: '',
        telephoneNumber: '',
        occupation: '',
        workplaceContactNo: '',
        workplaceAddress: '',
        emailAddress: '',
        religion: '',
        educationalQualification: [],
        childName: '', // Reset childName too
      });
      navigate('/parent-guardian-details');
    } catch (error) {
      console.error('Error saving data: ', error);
      alert('There was an error saving the data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigate('/home1');
  };

  return (
    <div className="form-container">
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

      <h2>MOTHER'S INFORMATION</h2>

      <form className="mother-info-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="checkbox" 
            id="unableToProvide" 
            onChange={handleCheckboxChange} 
          />
          <label htmlFor="unableToProvide">
            If unable to provide please tick this one
          </label>
        </div>

        <div className="form-group">
          <label>Child's Name *</label> 
          <input 
            type="text" 
            name="childName"
            placeholder="Enter child's name here" 
            value={motherDetails.childName} // Bind childName to state
            onChange={handleMotherDetailChange} // Allow input change
            required 
          />
        </div>

        <div className={`form-content ${isDisabled ? 'disabled' : ''}`}>
          <div className="form-group">
            <label>Full Name of child's mother *</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name (without initials) here" 
              value={motherDetails.fullName}
              onChange={handleMotherDetailChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Permanent Address</label>
            <input 
              type="text" 
              name="permanentAddress"
              placeholder="Permanent Address" 
              value={motherDetails.permanentAddress}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Current Residential Address *</label>
            <input 
              type="text" 
              name="currentResidentialAddress"
              placeholder="Current Residential Address" 
              value={motherDetails.currentResidentialAddress}
              onChange={handleMotherDetailChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input 
              type="text" 
              name="nationality"
              placeholder="Nationality" 
              value={motherDetails.nationality}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dateOfBirth"
              value={motherDetails.dateOfBirth}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Contact No *</label>
            <input
              type="tel"
              name="contactNo"
              placeholder="Enter the contact number here"
              value={motherDetails.contactNo}
              onChange={handleMotherDetailChange}
              pattern="\d{10}"  // Allow only numbers (10 digits)
              inputMode="numeric"  // Display numeric keypad on mobile devices
              title="Please enter a 10-digit contact number"
              required
              maxLength="10"  // Limit input to 10 characters
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();  // Prevent non-numeric input
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>Telephone Number (Home) *</label>
            <input
              type="tel"
              name="telephoneNumber"
              placeholder="Telephone Number"
              value={motherDetails.telephoneNumber}
              onChange={handleMotherDetailChange}
              pattern="\d{10}"  // Allow only numbers (10 digits)
              inputMode="numeric"  // Display numeric keypad on mobile devices
              title="Please enter a 10-digit telephone number"
              required
              maxLength="10"  // Limit input to 10 characters
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();  // Prevent non-numeric input
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>Workplace Contact No</label>
            <input
              type="tel"
              name="workplaceContactNo"
              placeholder="Workplace Number"
              value={motherDetails.workplaceContactNo}
              onChange={handleMotherDetailChange}
              pattern="\d{10}"  // Allow only numbers (10 digits)
              inputMode="numeric"  // Display numeric keypad on mobile devices
              title="Please enter a 10-digit workplace contact number"
              maxLength="10"  // Limit input to 10 characters
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();  // Prevent non-numeric input
                }
              }}
            />
          </div>

          <div className="form-group">
            <label>Workplace Address</label>
            <input 
              type="text" 
              name="workplaceAddress"
              placeholder="Enter the workplace address here" 
              value={motherDetails.workplaceAddress}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="emailAddress"
              placeholder="Enter the email here" 
              value={motherDetails.emailAddress}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Religion</label>
            <input 
              type="text" 
              name="religion"
              placeholder="Religion" 
              value={motherDetails.religion}
              onChange={handleMotherDetailChange}
            />
          </div>

          <div className="form-group">
            <label>Educational Qualification</label>
            <div>
              <input
                type="checkbox"
                name="educationalQualification"
                value="Primary"
                checked={motherDetails.educationalQualification.includes('Primary')}
                onChange={handleMotherDetailChange}
              />
              <label>Primary</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="educationalQualification"
                value="Secondary"
                checked={motherDetails.educationalQualification.includes('Secondary')}
                onChange={handleMotherDetailChange}
              />
              <label>Secondary</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="educationalQualification"
                value="Tertiary"
                checked={motherDetails.educationalQualification.includes('Tertiary')}
                onChange={handleMotherDetailChange}
              />
              <label>Tertiary</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="educationalQualification"
                value="Postgraduate"
                checked={motherDetails.educationalQualification.includes('Postgraduate')}
                onChange={handleMotherDetailChange}
              />
              <label>Postgraduate</label>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={handlePrevious} disabled={isSubmitting}>Previous</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MotherInformation;