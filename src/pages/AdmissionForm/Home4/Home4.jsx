import React, { useState } from 'react';
import { db } from '../../../firebase/firebase'; // Adjust the import path according to your project structure
import { collection, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import './Home4.css'; // Import your CSS here for styling

const TermsAndConditionsForm = () => {
  const [agree, setAgree] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [childName, setChildName] = useState(''); // State to capture child's name
  const [generatedStudentId, setGeneratedStudentId] = useState(''); // State to store the generated student ID
  const [childData, setChildData] = useState(null); // State to store the retrieved child data

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setAgree(!agree);
  };

  // Handle child name input change
  const handleChildNameChange = (e) => {
    setChildName(e.target.value);
  };

  // Function to generate a new student ID
  const generateStudentId = async () => {
    try {
      // Reference to the 'admissions' collection
      const admissionsRef = collection(db, 'admissions');
      // Query to order by 'studentId' descending
      const q = query(admissionsRef, orderBy('studentId', 'desc'));
      const querySnapshot = await getDocs(q);

      let lastId = 'B/P/000'; // Default ID if none exist
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        const data = firstDoc.data();
        if (data.studentId) {
          lastId = data.studentId;
        }
      }

      // Extract numeric part and increment
      const lastNum = parseInt(lastId.split('/')[2], 10);
      const newNum = lastNum + 1;
      const newStudentId = `B/P/${String(newNum).padStart(3, '0')}`;

      return newStudentId;
    } catch (error) {
      console.error('Error generating student ID:', error);
      throw new Error('Failed to generate student ID.');
    }
  };

  // Function to fetch child data by student ID or child name
  const fetchChildData = async (id) => {
    try {
      const admissionsRef = collection(db, 'admissions');
      const q = query(
        admissionsRef,
        where('studentId', '==', id),
        where('childName', '==', childName.trim())
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const childDoc = querySnapshot.docs[0];
        const childData = childDoc.data();
        return { ...childData, id: childDoc.id }; // Include document ID
      }

      // If not found by studentId and childName
      // Attempt to find by childName only
      const qNameOnly = query(admissionsRef, where('childName', '==', childName.trim()));
      const querySnapshotNameOnly = await getDocs(qNameOnly);

      if (!querySnapshotNameOnly.empty) {
        const childDoc = querySnapshotNameOnly.docs[0];
        const childData = childDoc.data();
        return { ...childData, id: childDoc.id };
      }

      return null;
    } catch (error) {
      console.error('Error fetching child data:', error);
      throw new Error('Failed to fetch child data.');
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!agree) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    if (childName.trim() === '') {
      alert("Please enter the child's name.");
      return;
    }

    try {
      // Generate a new student ID
      const newStudentId = await generateStudentId();

      // Fetch child data using the generated student ID and child name
      const fetchedChildData = await fetchChildData(newStudentId);

      if (fetchedChildData) {
        // Update Firestore document with the new student ID
        const childRef = doc(db, 'admissions', fetchedChildData.id);
        await updateDoc(childRef, { studentId: newStudentId });

        // Update state
        setGeneratedStudentId(newStudentId);
        setChildData(fetchedChildData);
        setIsModalOpen(true);
      } else {
        alert(`No child found with the name "${childName}". Please check the name and try again.`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting your data. Please try again.');
    }
  };

  // Function to load image as Base64
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // This enables CORS
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/jpeg'); // Adjust format if needed
        resolve(base64Image);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = url;
    });
  };

  // Function to generate the PDF
  const generatePDF = async () => {
    const doc = new jsPDF();

    if (childData) {
      // Add text content
      doc.setFontSize(12);
      doc.text(`Child's Name: ${childData.childName}`, 10, 10);
      doc.text(`Date of Birth: ${childData.birthDate}`, 10, 20);
      doc.text(`Address: ${childData.address}, ${childData.city}`, 10, 30);
      doc.text(`Father's Name: ${childData.fatherDetails?.name}`, 10, 40);
      doc.text(`Father's Occupation: ${childData.fatherDetails?.occupation}`, 10, 50);
      doc.text(`Father's Contact: ${childData.fatherDetails?.contactNumber}`, 10, 60);
      doc.text(`Mother's Name: ${childData.motherDetails?.fullName}`, 10, 70);
      doc.text(`Mother's Occupation: ${childData.motherDetails?.occupation}`, 10, 80);
      doc.text(`Mother's Contact: ${childData.motherDetails?.contactNo}`, 10, 90);
      doc.text(`Guardian's Name: ${childData.guardianDetails?.relationship} ${childData.guardianDetails?.contactNumber}`, 10, 100);
      doc.text(`Additional Children Details: ${childData.additionalChildrenDetails}`, 10, 110);
      doc.text(`Student ID: ${generatedStudentId}`, 10, 120);

      // Add image if available
      if (childData.uploadedFileURL) {
        try {
          const base64Image = await loadImageAsBase64(childData.uploadedFileURL);
          // Adjust the position and size as needed
          doc.addImage(base64Image, 'JPEG', 10, 130, 50, 50);
        } catch (error) {
          console.error('Error loading image for PDF:', error);
          doc.text('Image could not be loaded.', 10, 130);
        }
      }
    }

    return doc;
  };

  // Function to view the PDF in a new tab
  // const viewPDF = async () => {
  //   try {
      
  //     const pdfBlob = doc.output('blob');
  //     const pdfUrl = URL.createObjectURL(pdfBlob);
  //     window.open(pdfUrl, '_blank');
  //   } catch (error) {
  //     console.error('Error viewing PDF:', error);
  //     alert('An error occurred while generating the PDF.');
  //   }
  // };

  // Function to download the PDF
  const downloadPDF = async () => {
    try {
      const doc = await generatePDF();
      doc.save(`Child_Information_${generatedStudentId}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('An error occurred while generating the PDF.');
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally reset the form here
    // setChildName('');
    // setAgree(false);
    // setGeneratedStudentId('');
    // setChildData(null);
  };

  return (
    <div className="container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step active-step">01</div>
        <div className="step active-step">02</div>
        <div className="step">03</div>
        <div className="step">04</div>
      </div>

      {/* Step Titles */}
      <div className="step-titles">
        <p>CHILD'S INFORMATION</p>
        <p>PARENT OR GUARDIAN DETAILS</p>
        <p>OTHER INFORMATION</p>
        <p>TERMS AND CONDITIONS</p>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h2>TERMS AND CONDITIONS</h2>
        <p className="guidelines">
          APPLICATION GUIDELINES:
          <br /> → All details and documents provided should be 100% accurate and valid
          <br /> → Any invalid details or forged documents will result in your application being immediately rejected
          <br /> → Canvassing in any form will be a disqualification
          <br /> → Decisions made by the School Management will be final. Letters of appeals will not be acknowledged nor considered.
          <br /> → No phone calls / appointments will be accepted by the School Office regarding any details about your application/subsequent interview
        </p>

        <p className="confirmation">
          By submitting this duly completed application, I certify that the information given is true to the best of my knowledge. I agree to be bound by the School's rules & regulations. I agree to the terms & conditions listed above with regards to this application. I understand that should any information submitted (including documents) be found to be invalid or forged, that my application will be rejected immediately.
        </p>

        {/* Agreement Checkbox */}
        <div className="checkbox">
          <input type="checkbox" id="agree" checked={agree} onChange={handleCheckboxChange} />
          <label htmlFor="agree">I AGREE to the terms & conditions mentioned above and understand them clearly</label>
        </div>

        {/* Child's Name Input */}
        <div className="child-name-input">
          <label htmlFor="childName">Child's Name:</label>
          <input 
            type="text" 
            id="childName" 
            value={childName} 
            onChange={handleChildNameChange} 
            placeholder="Enter child's name" 
          />
        </div>

        {/* Form Buttons */}
        <div className="buttons">
          <button 
            className="primary-btn" 
            onClick={() => {
              // Reset form or handle cancellation
              setAgree(false);
              setChildName('');
              setGeneratedStudentId('');
              setChildData(null);
              alert('Cancelled');
            }}
          >
            Cancel
          </button>
          <button 
            className="secondary-btn" 
            onClick={handleSubmit}
            disabled={!agree || childName.trim() === ''}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Modal for Success Message */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>The form has been submitted successfully!</h3>
            <p>Your generated Student ID is: {generatedStudentId}</p>
            <div className="pdf-buttons">
              {/* <button onClick={viewPDF}>View PDF</button> */}
              <button onClick={downloadPDF}>View & Download PDF</button>
            </div>
            <button className="close-btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Display Child Details (Optional) */}
      {/* {childData && (
        <div className="child-details">
          <h2>Child Details</h2>
          <p><strong>Child's Name:</strong> {childData.childName}</p>
          <p><strong>Date of Birth:</strong> {childData.birthDate}</p>
          <p><strong>Address:</strong> {childData.address}, {childData.city}</p>
          <p><strong>Father's Name:</strong> {childData.fatherDetails?.name}</p>
          <p><strong>Father's Occupation:</strong> {childData.fatherDetails?.occupation}</p>
          <p><strong>Father's Contact:</strong> {childData.fatherDetails?.contactNumber}</p>
          <p><strong>Mother's Name:</strong> {childData.motherDetails?.fullName}</p>
          <p><strong>Mother's Occupation:</strong> {childData.motherDetails?.occupation}</p>
          <p><strong>Mother's Contact:</strong> {childData.motherDetails?.contactNo}</p>
          <p><strong>Guardian's Name:</strong> {childData.guardianDetails?.relationship} {childData.guardianDetails?.contactNumber}</p>
          <p><strong>Additional Children Details:</strong> {childData.additionalChildrenDetails}</p>
          <p><strong>Uploaded File:</strong> <a href={childData.uploadedFileURL} target="_blank" rel="noopener noreferrer">View File</a></p>
          <p><strong>Student ID:</strong> {generatedStudentId}</p>
        </div>
      )} */}
    </div>
  );
};

export default TermsAndConditionsForm;
