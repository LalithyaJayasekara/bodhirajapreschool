import React, { useEffect, useState } from "react";
import "./ProgressReport.css";
import { db, storage } from "../../firebase/firebase"; // Import storage if you're using Firebase Storage
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref as getStorageRef } from "firebase/storage"; // Firebase storage functions
import StudentProgressChart from "./ProgressChart";

const StudentProgressReport = () => {
  const [marksData, setMarksData] = useState({
    firstTerm: {
      "Art & Crafts": "",
      Music: "",
      English: "",
      "Environmental Studies": "",
    },
    secondTerm: {
      "Art & Crafts": "",
      Music: "",
      English: "",
      "Environmental Studies": "",
    },
    thirdTerm: {
      "Art & Crafts": "",
      Music: "",
      English: "",
      "Environmental Studies": "",
    },
  });

  const [studentDetails, setStudentDetails] = useState({
    id: "",
    name: "",
    class: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation
  const auth = getAuth(); // Firebase Authentication

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("No user logged in");
          return;
        }

        const email = user.email; // Get the authenticated user's email
        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const studentDoc = querySnapshot.docs[0]; // Get the first matched document
          const studentData = studentDoc.data();

          setStudentDetails({
            id: studentData.admissionNumber,
            name: studentData.firstName,
            class: studentData.class,
          });

          // You can now fetch marks or other data as required.
        } else {
          setError("No student found for the logged-in email.");
        }
      } catch (err) {
        setError("Failed to fetch student details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [auth]);

  const handleViewProgress = () => {
    console.log("Viewing progress...");
  };

  const downloadTimetable = async () => {
    try {
      const storageRef = getStorageRef(storage, "Timetables/lastUploadedFile.pdf");
      const url = await getDownloadURL(storageRef);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "timetable.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Timetable downloaded successfully.");
    } catch (error) {
      console.error("Error downloading timetable:", error);
    }
  };

  const downloadLearningMaterials = async () => {
    try {
      const storageRef = getStorageRef(storage, "LearningMaterials/material.pdf");
      const url = await getDownloadURL(storageRef);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "learning-materials.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("Learning materials downloaded successfully.");
    } catch (error) {
      console.error("Error downloading learning materials:", error);
    }
  };

  const handlePaymentsClick = () => {
    console.log("Navigating to Payments page...");
    navigate("/payments");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="dashboard-container">
        <div className="header">
          <h2 style={{ color: "white" }}>
            Welcome Back, {studentDetails.name}!
          </h2>
        </div>

        <div className="content">
          <div className="marks-section">
            <h2 style={{ color: "white" }}>Student Profile</h2>
            <div className="personalDetails">
              <h3>Personal Details</h3>
              <p>StudentID: {studentDetails.id}</p>
              <p>Student Name: {studentDetails.name}</p>
            </div>

            <h3>End Term Marks</h3>
            <div className="marks-box">
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th colSpan="4">1st Term</th>
                    <th colSpan="4">2nd Term</th>
                    <th colSpan="4">3rd Term</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>Art & Crafts</th>
                    <th>Music</th>
                    <th>English</th>
                    <th>Environmental Studies</th>
                    <th>Art & Crafts</th>
                    <th>Music</th>
                    <th>English</th>
                    <th>Environmental Studies</th>
                    <th>Art & Crafts</th>
                    <th>Music</th>
                    <th>English</th>
                    <th>Environmental Studies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{studentDetails.id}</td>
                    <td>{studentDetails.name}</td>
                    <td>{studentDetails.class}</td>
                    <td>{marksData.firstTerm["Art & Crafts"]}</td>
                    <td>{marksData.firstTerm.Music}</td>
                    <td>{marksData.firstTerm.English}</td>
                    <td>{marksData.firstTerm["Environmental Studies"]}</td>
                    <td>{marksData.secondTerm["Art & Crafts"]}</td>
                    <td>{marksData.secondTerm.Music}</td>
                    <td>{marksData.secondTerm.English}</td>
                    <td>{marksData.secondTerm["Environmental Studies"]}</td>
                    <td>{marksData.thirdTerm["Art & Crafts"]}</td>
                    <td>{marksData.thirdTerm.Music}</td>
                    <td>{marksData.thirdTerm.English}</td>
                    <td>{marksData.thirdTerm["Environmental Studies"]}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button onClick={handleViewProgress} className="progress-link">
              Find Your Progress Here
            </button>
          </div>
        </div>

        <div className="sidebar">
          <ul>
            <li onClick={downloadTimetable}>Download Timetable</li>
            <li onClick={downloadLearningMaterials}>Learning Materials</li>
            <li onClick={handlePaymentsClick}>Payments</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default StudentProgressReport;