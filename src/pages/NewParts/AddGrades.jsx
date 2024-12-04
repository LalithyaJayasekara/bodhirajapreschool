import React, { useState } from 'react';
import './AddGrades.css';
// Firebase imports
import { collection, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase'; // Adjust path if necessary

const ReportGenerate = () => {
    const [studentId, setStudentId] = useState('');
    const [term, setTerm] = useState('');
    const [subjects, setSubjects] = useState(['', '', '', '']);
    const [marks, setMarks] = useState(['', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubjectChange = (index, value) => {
        const newSubjects = [...subjects];
        newSubjects[index] = value;
        setSubjects(newSubjects);
    };

    const handleMarkChange = (index, value) => {
        const newMarks = [...marks];
        newMarks[index] = value;
        setMarks(newMarks);
    };

    const validateForm = () => {
        let isValid = true;

        // Check if any required field is empty
        if (!studentId || !term) isValid = false;

        subjects.forEach((subject, i) => {
            if (!subject || !marks[i] || isNaN(marks[i]) || marks[i] < 0 || marks[i] > 100) {
                isValid = false;
            }
        });

        // Check for duplicate subjects
        if (new Set(subjects).size !== subjects.length) {
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        // Create the data object to be stored
        const formData = {
            studentId,
            subjects: [
                { subject: subjects[0], marks: marks[0] },
                { subject: subjects[1], marks: marks[1] },
                { subject: subjects[2], marks: marks[2] },
                { subject: subjects[3], marks: marks[3] }
            ],
            timestamp: new Date(),
        };

        try {
            // Reference to the student's document
            const studentDocRef = doc(db, "studentsGrade", studentId);

            // Check if the student document exists
            const studentDocSnap = await getDoc(studentDocRef);
            if (!studentDocSnap.exists()) {
                // If the student document doesn't exist, create it
                await setDoc(studentDocRef, {});
            }

            // Reference to the specific term
            const termRef = doc(db, "studentsGrade", studentId, term, "marks");

            // Check if the term document already has marks
            const termDocSnap = await getDoc(termRef);
            if (termDocSnap.exists()) {
                // If the term document already has marks, prevent overwriting
                alert('Marks already exist for this term and student.');
                setIsSubmitting(false);
                return;
            }

            // Set data for the selected term inside the student's document
            await setDoc(termRef, formData);

            setSubmitMessage('Submitted successfully!');
            setStudentId('');
            setTerm('');
            setSubjects(['', '', '', '']);
            setMarks(['', '', '', '']);
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error saving data.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grade-bottle-form">
            <div className="form-bottle-group">
                <label>Student ID:* </label>
                <input 
                    type="text" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-bottle-group">
                <label>Term:* </label>
                <select 
                    value={term} 
                    onChange={(e) => setTerm(e.target.value)} 
                    required
                >
                    <option value="">Select Term</option>
                    <option value="1stTerm">1st Term</option>
                    <option value="2ndTerm">2nd Term</option>
                    <option value="3rdTerm">3rd Term</option>
                </select>
            </div>

            <div className="subjects-bottle-row">
                {[0, 1, 2, 3].map((i) => (
                    <div className="subject-bottle" key={i}>
                        <label>{`Subject ${i + 1}:*`}</label>
                        <select 
                            value={subjects[i]} 
                            onChange={(e) => handleSubjectChange(i, e.target.value)} 
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="Art & Crafts">Art & Crafts</option>
                            <option value="Music">Music</option>
                            <option value="English">English</option>
                            <option value="Environmental Studies">Environmental Studies</option>
                        </select>
                        <input 
                            type="number" 
                            placeholder="Marks" 
                            value={marks[i]} 
                            onChange={(e) => handleMarkChange(i, e.target.value)} 
                            required 
                            min="0" 
                            max="100"
                        />
                    </div>
                ))}
            </div>

            {isSubmitting ? <button type="submit" disabled>Submitting...</button> : <button type="submit">Submit</button>}
            {submitMessage && <div className="submit-bottle-message" style={{ color: 'black' }}>{submitMessage}</div>}
        </form>
    );
};

export default ReportGenerate;