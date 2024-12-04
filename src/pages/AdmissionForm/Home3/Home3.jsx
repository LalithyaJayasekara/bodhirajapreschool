import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { doc, updateDoc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firebase functions
import { db } from '../../../firebase/firebase'; // Adjust the path to your Firebase configuration
import './Home3.css'; // Import the CSS file for styling

const OtherInformationForm = ({ documentNumber }) => {
  const [childName, setChildName] = useState(''); // Child name state
  const [siblings, setSiblings] = useState([{ name: '', year: '2008' }]); // Siblings state
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [bodhirajaPreSchool, setBodhirajaPreSchool] = useState('yes'); // State for Bodhiraja Pre School
  const [howDidYouKnow, setHowDidYouKnow] = useState('social-media'); // State for how they heard about the preschool
  const [additionalChildrenDetails, setAdditionalChildrenDetails] = useState(''); // State for additional children details
  const navigate = useNavigate(); // Initialize navigate

  // Function to add a new sibling
  const addSibling = () => {
    setSiblings([...siblings, { name: '', year: '2008' }]);
  };

  // Handle changes for sibling inputs
  const handleSiblingChange = (index, event) => {
    const newSiblings = siblings.map((sibling, i) => {
      if (i === index) {
        return { ...sibling, [event.target.name]: event.target.value };
      }
      return sibling;
    });
    setSiblings(newSiblings);
  };

  // Handle form submission
  const handleNext = async () => {
    setIsSubmitting(true); // Set submitting state to true

    try {
      // Query to find the document based on childName
      const admissionsRef = collection(db, 'admissions');
      const q = query(admissionsRef, where('childName', '==', childName.trim()));
      const querySnapshot = await getDocs(q);

      // Prepare data to be saved
      const otherInformation = {
        siblings,
        bodhirajaPreSchool: bodhirajaPreSchool === 'yes', // Convert to boolean
        howDidYouKnow,
        additionalChildrenDetails // Include additional children details
      };

      if (!querySnapshot.empty) {
        // If the document exists, update it
        const childDocRef = doc(db, 'admissions', querySnapshot.docs[0].id); // Get the document reference
        await updateDoc(childDocRef, {
          ...otherInformation // Merge with existing document data
        });
        alert("Data updated successfully!"); // Notify user of successful update
      } else {
        // If the document does not exist, create it with childName
        const newDocRef = doc(admissionsRef); // Create a new document reference
        await setDoc(newDocRef, {
          childName: childName.trim(), // Include childName
          ...otherInformation,
        });
        alert("Data saved successfully!"); // Notify user of successful creation
      }

      navigate('/home4'); // Navigate after successful submission
    } catch (error) {
      console.error("Error saving other information:", error); // Detailed error logging
      alert(`An error occurred while saving data: ${error.message}`); // Show specific error message
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  // Handle navigation to the previous step
  const handlePrevious = () => {
    navigate('/guardian'); // Navigate to /guardian when "Previous" button is clicked
  };

  return (
    <div className="form-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="step active">01</div>
        <div className="step active">02</div>
        <div className="step">03</div>
        <div className="step">04</div>
      </div>
      <div className="step-titles">
        <p>CHILD'S INFORMATION</p>
        <p>PARENT OR GUARDIAN DETAILS</p>
        <p>OTHER INFORMATION</p>
        <p>TERMS AND CONDITIONS</p>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h2>OTHER INFORMATION</h2>
        <form>
          <div className="form-group">
            <label>Child's Full Name</label>
            <input
              type="text"
              placeholder="Enter the child's full name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Are there any other children in the family other than this child?</label>
            <input 
              type="text" 
              placeholder="Enter details here" 
              value={additionalChildrenDetails}
              onChange={(e) => setAdditionalChildrenDetails(e.target.value)}
            />
          </div>

          {/* Siblings Section */}
          {siblings.map((sibling, index) => (
            <div key={index} className="sibling-group">
              <div className="form-group">
                <label>Name of the child</label>
                <input
                  type="text"
                  placeholder="Enter the name here"
                  name="name"
                  value={sibling.name}
                  onChange={(event) => handleSiblingChange(index, event)}
                />
              </div>

              <div className="form-group">
                <label>Year</label>
                <select
                  name="year"
                  value={sibling.year}
                  onChange={(event) => handleSiblingChange(index, event)}
                >
                  {Array.from({ length: 25 }, (_, i) => 2000 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button type="button" onClick={addSibling} className="add-sibling-btn">
            + Add Sibling
          </button>

          <div className="form-group">
            <label>Did they study in Bodhiraja Pre School?</label>
            <select value={bodhirajaPreSchool} onChange={(e) => setBodhirajaPreSchool(e.target.value)}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>How did you get to know about the preschool?</label>
            <select value={howDidYouKnow} onChange={(e) => setHowDidYouKnow(e.target.value)}>
              <option value="social-media">Social Media</option>
              <option value="friends">Friends</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Button Group */}
          <div className="button-group">
            <button type="button" className="btn-green" onClick={handlePrevious}>Previous</button>
            <button
              type="button"
              className="btn-black"
              onClick={handleNext}
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting ? 'Submitting...' : 'Next'} {/* Conditional button text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtherInformationForm;
