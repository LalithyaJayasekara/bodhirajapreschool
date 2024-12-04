import React, { useState } from 'react';
import './Payments.css';
import { db } from '../../firebase/firebase'; // Ensure Firebase path
import { collection, addDoc, updateDoc, doc } from "firebase/firestore"; // Add updateDoc, doc for URL update

const Payments = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !studentId || !email || !file) {
      setErrorMessage("Please fill out all fields and upload a file.");
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Step 1: Add Student Details to Firestore
      const paymentsCollectionRef = collection(db, "Payments");
      const docRef = await addDoc(paymentsCollectionRef, {
        name,
        studentId,
        email,
        fileURL: "", // Placeholder for the file URL
        status: "pending", // Default status
      });

      try {
        // Step 2: Upload File to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "jmrpithq");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dgecq2e6l/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload image to Cloudinary");
        }

        const data = await response.json();

        // Step 3: Update Firestore with the Cloudinary URL
        const paymentDocRef = doc(db, "Payments", docRef.id);
        await updateDoc(paymentDocRef, {
          fileURL: data.secure_url,
        });

        setSuccessMessage("Submitted successfully!");
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error: ", cloudinaryError);
        setErrorMessage("File upload to Cloudinary failed. Please try again.");
      }
    } catch (firestoreError) {
      console.error("Firestore error: ", firestoreError);
      setErrorMessage("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
      setName('');
      setStudentId('');
      setEmail('');
      setFile(null);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>

        <div className="upload-section">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default Payments;
