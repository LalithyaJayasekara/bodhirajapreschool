import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { db, auth,storage } from '../../firebase/firebase'; // Ensure Firebase configuration is correct
import '../Login/Student.css';
import { signOut } from 'firebase/auth';
import './Student.css';
import axios from 'axios'; // To make HTTP requests
import { Button, Container, Grid, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Download, FileDownload, Payment } from '@mui/icons-material';
import { EmojiEmotions, SentimentDissatisfied, SentimentSatisfied } from '@mui/icons-material';

const StudentProfileAndProgress = () => {
  const { state } = useLocation();
  const user = state?.user;
  const navigate = useNavigate();

  const [marksData, setMarksData] = useState({
    firstTerm: [],
    secondTerm: [],
    thirdTerm: [],
  });

  const [studentDetails, setStudentDetails] = useState({
    id: user?.admissionNumber || 'N/A',
    name: user?.firstName || 'N/A',
    class: 'Grade 1', 
  });

  

  useEffect(() => {
    const fetchStudentMarks = async () => {
      if (user?.admissionNumber) {
        try {
          const firstTermMarksRef = collection(db, 'studentsGrade', user.admissionNumber, '1stTerm');
          const secondTermMarksRef = collection(db, 'studentsGrade', user.admissionNumber, '2ndTerm');
          const thirdTermMarksRef = collection(db, 'studentsGrade', user.admissionNumber, '3rdTerm');

          const [firstTermSnap, secondTermSnap, thirdTermSnap] = await Promise.all([
            getDocs(firstTermMarksRef),
            getDocs(secondTermMarksRef),
            getDocs(thirdTermMarksRef),
          ]);

          const extractMarks = (querySnapshot) => {
            let subjects = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.subjects) {
                subjects = data.subjects;
              }
            });
            return subjects;
          };

          setMarksData({
            firstTerm: extractMarks(firstTermSnap),
            secondTerm: extractMarks(secondTermSnap),
            thirdTerm: extractMarks(thirdTermSnap),
          });
        } catch (error) {
          console.error('Error fetching marks data:', error);
        }
      } else {
        console.error('Student ID is not defined');
      }
    };

    fetchStudentMarks();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate('/'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleViewProgress = () => {
    console.log('Viewing progress...');
    navigate('/progress-report', {
      state: {
        marksData,
        studentDetails,
      },
    });
  };

  // Fetch and download the last modified timetable PDF file
  const downloadTimetable = async () => {
    try {
      const timetableFolderRef = ref(storage, 'timetable');
      const fileList = await listAll(timetableFolderRef);

      if (fileList.items.length === 0) {
        console.log('No files found in timetable folder.');
        return;
      }

      const fileWithLatestDate = await Promise.all(
        fileList.items.map(async (fileRef) => {
          const metadata = await getMetadata(fileRef);
          return {
            fileRef,
            lastModified: metadata.updated,
          };
        })
      );

      const latestFile = fileWithLatestDate.reduce((latest, current) =>
        new Date(current.lastModified) > new Date(latest.lastModified) ? current : latest
      );

      const downloadURL = await getDownloadURL(latestFile.fileRef);
      window.open(downloadURL, '_blank');
    } catch (error) {
      console.error('Error downloading timetable:', error);
    }
  };

  const downloadLearningMaterials = () => {
    navigate('/learning-materials');
  };

  const handlePaymentsClick = () => {
    navigate('/payments');
  };

  const renderMarks = (termMarks) => {
    if (!termMarks || termMarks.length === 0) {
      return <td colSpan="4">No marks available</td>;
    }
  
    return termMarks.map((subject, index) => {
      let faceIcon = '😐'; // Default neutral face
      const marks = subject.marks || 'N/A';
  
      // Set the appropriate face icon based on the marks
      if (marks !== 'N/A') {
        if (marks >= 0 && marks <= 40) {
          faceIcon = '😞'; // Sad face for marks 0-40
        } else if (marks >= 41 && marks <= 69) {
          faceIcon = '😐'; // Neutral face for marks 41-69
        } else if (marks >= 70 && marks <= 100) {
          faceIcon = '😊'; // Happy face for marks 70-100
        }
      }
  
      return (
        <TableCell key={index} align="center">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{marks}</span>
            <span style={{ fontSize: '24px', marginTop: '5px' }}>{faceIcon}</span>
          </div>
        </TableCell>
      );
    });
  };

  const handleChangeProPic = async () => {
    try {
      // Step 1: Prompt the user to select an image file
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*'; // Only allow image files
      fileInput.click();
  
      // Step 2: Wait for the user to select a file
      fileInput.onchange = async () => {
        const file = fileInput.files[0]; // Get the selected file
  
        if (file) {
          // Step 3: Upload the file to Cloudinary
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'jmrpithq'); // Your Cloudinary upload preset
          formData.append('cloud_name', 'dgecq2e6l'); // Your Cloudinary cloud name
  
          try {
            // Step 4: Make a request to Cloudinary to upload the image
            const response = await axios.post(
              'https://api.cloudinary.com/v1_1/dgecq2e6l/image/upload',
              formData
            );
  
            // Step 5: Get the image URL from Cloudinary's response
            const imageUrl = response.data.secure_url;
            console.log('Image uploaded to Cloudinary:', imageUrl);
  
            // Step 6: Update the student's profile picture URL in Firebase
            if (user?.admissionNumber) {
              const studentRef = doc(db, 'students', user.admissionNumber); // Reference the student's document in Firestore
              console.log('Updating Firestore for user:', user.admissionNumber);
  
              // Update Firestore with the new photo URL
              await updateDoc(studentRef, {
                photo: imageUrl, // Update the photo field in Firestore
              });
  
              // Log success message after the update
              console.log('Successfully updated photo URL in Firebase Firestore.');
  
              // Optionally, update local state to reflect the new photo
              setStudentDetails((prevDetails) => ({
                ...prevDetails,
                photo: imageUrl, // Update the local state
              }));
            }
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error handling profile picture change:', error);
    }
  };



  if (!user) {
    return <div className="rare-error-message">No user data available</div>;
  }

  return (
    <>
<Container maxWidth="lg" style={{ paddingTop: 20 }}>
  <Grid container spacing={3}>
    {/* Left Section: Dashboard and Marks */}
    <Grid item xs={12} md={8}>
      {/* Dashboard Section */}
      <Box mb={4}>
        <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#388E3C' }}>
          Welcome {user.childName}! To Your Student Dashboard
        </Typography>

        {/* Marks Section */}
        <Paper elevation={5} style={{ padding: 20, borderRadius: 8, backgroundColor: '#F1F8E9' }}>
          <Typography variant="h5" gutterBottom style={{ color: '#388E3C', fontWeight: 'bold' }}>
            End Term Marks
          </Typography>
          <TableContainer component={Paper} style={{ borderRadius: 8 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', color: '#388E3C' }}>Student ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#388E3C' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: '#388E3C' }}>Class</TableCell>
                  <TableCell colSpan={4} align="center" style={{ fontWeight: 'bold', color: '#388E3C' }}>1st Term</TableCell>
                  <TableCell colSpan={4} align="center" style={{ fontWeight: 'bold', color: '#388E3C' }}>2nd Term</TableCell>
                  <TableCell colSpan={4} align="center" style={{ fontWeight: 'bold', color: '#388E3C' }}>3rd Term</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>Art & Crafts</TableCell>
                  <TableCell>Environmental Studies</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell>Music</TableCell>
                  <TableCell>Art & Crafts</TableCell>
                  <TableCell>Environmental Studies</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell>Music</TableCell>
                  <TableCell>Art & Crafts</TableCell>
                  <TableCell>Environmental Studies</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell>Music</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{studentDetails.id}</TableCell>
                  <TableCell>{user.childName}</TableCell>
                  <TableCell>{studentDetails.class}</TableCell>
                  {renderMarks(marksData.firstTerm)}
                  {renderMarks(marksData.secondTerm)}
                  {renderMarks(marksData.thirdTerm)}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleViewProgress} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#388E3C' }}>
              Find Your Progress Here
            </Button>
          </Box>
        </Paper>
      </Box>
    </Grid>

    {/* Right Section: Profile and Quick Links */}
    <Grid item xs={12} md={4}>
      {/* Profile Section */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4} p={3} bgcolor="#81C784" borderRadius={3} boxShadow={5} style={{ transition: 'all 0.3s ease' }}>
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#fff' }}>
          Student Profile
        </Typography>
        <img src={user.photo} alt="Student" className="student-photo-door" style={{ width: 150, height: 150, borderRadius: '50%', marginBottom: 10, border: '4px solid #fff' }} />
        <Button variant="contained" color="secondary" onClick={handleChangeProPic} style={{ marginBottom: 10, backgroundColor: '#388E3C', color: '#fff', padding: '5px 5px', fontSize: '12px' }}>
          Add/Edit Profile Picture
        </Button>
        <Typography variant="body1" style={{ color: '#fff', fontSize: '18px' }}>Name: {user.childName}</Typography>
        <Typography variant="body1" style={{ color: '#fff', fontSize: '18px' }}>Admission Number: {studentDetails.id}</Typography>
        <Button
            variant="outlined"
            color="default"
            onClick={handleLogout}
            style={{
              marginTop: 10,
              borderColor: '#388E3C',
              color: '#388E3C',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
            }}
            sx={{
              '&:hover': {
                backgroundColor: '#81C784',  // Light green on hover
                borderColor: '#81C784',  // Light green border on hover
                color: '#388E3C',  // Dark green text on hover
              },
            }}
          >
            Logout
        </Button>

      </Box>

      {/* Quick Links Section */}
      <Box>
        <Paper elevation={5} style={{ padding: 20, backgroundColor: '#81C784', borderRadius: 8 }}>
          <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', color: '#fff' }}>
            Quick Links
          </Typography>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            <li>
              <Button variant="outlined" color="primary" onClick={downloadTimetable} fullWidth style={{ marginBottom: 10, backgroundColor: '#388E3C', color: '#fff' }}>
                <Download /> Download Timetable
              </Button>
            </li>
            <li>
              <Button variant="outlined" color="primary" onClick={downloadLearningMaterials} fullWidth style={{ marginBottom: 10, backgroundColor: '#388E3C', color: '#fff' }}>
                <FileDownload /> Learning Materials
              </Button>
            </li>
            <li>
              <Button variant="outlined" color="primary" onClick={handlePaymentsClick} fullWidth style={{ backgroundColor: '#388E3C', color: '#fff' }}>
                <Payment /> Payments
              </Button>
            </li>
          </ul>
        </Paper>
      </Box>
    </Grid>
  </Grid>
</Container>




    </>
  );
};

export default StudentProfileAndProgress;
