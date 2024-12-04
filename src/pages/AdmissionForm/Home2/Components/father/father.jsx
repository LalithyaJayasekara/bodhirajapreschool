// src/components/ParentGuardianDetails.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './father.css';

// Import Firebase Firestore functions
import { db } from '../../../../../firebase/firebase'; // Adjust the path as necessary
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const ParentGuardianDetails = () => {
    const [unableToProvide, setUnableToProvide] = useState(false);
    const [fatherName, setFatherName] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');
    const [residentialAddress, setResidentialAddress] = useState('');
    const [nationality, setNationality] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [telephoneNumber, setTelephoneNumber] = useState('');
    const [occupation, setOccupation] = useState('');
    const [workplaceContactNo, setWorkplaceContactNo] = useState('');
    const [workplaceAddress, setWorkplaceAddress] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [religion, setReligion] = useState('');
    const [education, setEducation] = useState({
        OL: true,
        AL: true,
        Diploma: true,
        Degree: true,
        MScPhd: true,
    });
    const [childName, setChildName] = useState(''); // New state for Child Name

    const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

    const navigate = useNavigate(); // Initialize navigate

    const handleCheckboxChange = (field) => {
        setEducation({ ...education, [field]: !education[field] });
    };

    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        // Only allow digits and restrict to 10 characters
        setter(value.replace(/\D/g, '').slice(0, 10));
    };

    const handleNext = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Set submitting state to true

        // Validate telephone numbers to ensure they are 10 digits
        if (contactNumber.length !== 10 || telephoneNumber.length !== 10 || workplaceContactNo.length !== 10) {
            alert('Contact number, telephone number, and workplace contact number must be exactly 10 digits.');
            setIsSubmitting(false);
            return;
        }

        // Validate that the numbers are digits only
        if (!/^\d{10}$/.test(contactNumber) || !/^\d{10}$/.test(telephoneNumber) || !/^\d{10}$/.test(workplaceContactNo)) {
            alert('Contact number, telephone number, and workplace contact number must contain only digits.');
            setIsSubmitting(false);
            return;
        }

        try {
            const admissionsRef = collection(db, 'admissions');
            const q = query(admissionsRef, where('childName', '==', childName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // If child document exists, update it with father's details
                const childDoc = querySnapshot.docs[0];
                const childDocRef = doc(db, 'admissions', childDoc.id);
                await updateDoc(childDocRef, {
                    fatherDetails: {
                        fatherName,
                        permanentAddress,
                        residentialAddress,
                        nationality,
                        dateOfBirth,
                        contactNumber,
                        telephoneNumber,
                        occupation,
                        workplaceContactNo,
                        workplaceAddress,
                        emailAddress,
                        religion,
                        education
                    }
                });
            } else {
                // If child document does not exist, create a new one
                await addDoc(admissionsRef, {
                    childName: childName,
                    fatherDetails: {
                        fatherName,
                        permanentAddress,
                        residentialAddress,
                        nationality,
                        dateOfBirth,
                        contactNumber,
                        telephoneNumber,
                        occupation,
                        workplaceContactNo,
                        workplaceAddress,
                        emailAddress,
                        religion,
                        education
                    }
                });
            }

            console.log('Father\'s data saved successfully');
            navigate('/guardian'); // Navigate to the guardian form page
        } catch (error) {
            console.error('Error saving father\'s data: ', error);
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    const handlePrevious = () => {
        navigate('/mother-info'); // Navigate to the mother info page
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

            <div className="form">
                <h2>FATHER'S INFORMATION</h2>

                <form onSubmit={handleNext}>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={unableToProvide}
                                onChange={() => setUnableToProvide(!unableToProvide)}
                            />
                            If unable to provide please tick this one
                        </label>
                    </div>

                    {!unableToProvide && (
                        <>
                            <div className="form-group">
                                <label>Child's Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter the child's name here"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)} // Update childName state
                                    required // Making it a required field
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Name of child's father *</label>
                                <input
                                    type="text"
                                    placeholder="Full Name (without initials) here"
                                    value={fatherName}
                                    onChange={(e) => setFatherName(e.target.value)}
                                    required // Making it a required field
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
                                    required // Making it a required field
                                />
                            </div>

                            <div className="form-group">
                                <label>Nationality</label>
                                <input
                                    type="text"
                                    placeholder="Nationality"
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Contact No *</label>
                                <input
                                    type="text"
                                    placeholder="Enter the contact number here"
                                    value={contactNumber}
                                    onChange={handleInputChange(setContactNumber)} // Handle input change
                                    required // Making it a required field
                                />
                            </div>

                            <div className="form-group">
                                <label>Telephone Number (Home) *</label>
                                <input
                                    type="text"
                                    placeholder="Telephone Number"
                                    value={telephoneNumber}
                                    onChange={handleInputChange(setTelephoneNumber)} // Handle input change
                                    required // Making it a required field
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

                            <div className="form-group">
                                <label>Workplace Contact No</label>
                                <input
                                    type="text"
                                    placeholder="Workplace Number"
                                    value={workplaceContactNo}
                                    onChange={handleInputChange(setWorkplaceContactNo)} // Handle input change
                                />
                            </div>

                            <div className="form-group">
                                <label>Workplace Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter the workplace address here"
                                    value={workplaceAddress}
                                    onChange={(e) => setWorkplaceAddress(e.target.value)}
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
                                <label>Religion</label>
                                <input
                                    type="text"
                                    placeholder="Religion"
                                    value={religion}
                                    onChange={(e) => setReligion(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Educational Qualifications</label>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={education.OL}
                                            onChange={() => handleCheckboxChange('OL')}
                                        />
                                        OL
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={education.AL}
                                            onChange={() => handleCheckboxChange('AL')}
                                        />
                                        AL
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={education.Diploma}
                                            onChange={() => handleCheckboxChange('Diploma')}
                                        />
                                        Diploma
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={education.Degree}
                                            onChange={() => handleCheckboxChange('Degree')}
                                        />
                                        Degree
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={education.MScPhd}
                                            onChange={() => handleCheckboxChange('MScPhd')}
                                        />
                                        MSc/PhD
                                    </label>
                                </div>
                            </div>

                            <div className="button-container">
                                <button type="button" onClick={handlePrevious}>Previous</button>
                                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Next'}</button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ParentGuardianDetails;