import React, { useState, useEffect } from 'react';
import './Teacher.css';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { signOut } from 'firebase/auth'; // Import the signOut function
import { auth } from '../../firebase/firebase'; // Make sure to adjust the path to your firebase.js
import axios from 'axios'; // To make HTTP requests
import { Container, Grid, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal } from '@mui/material';
import { green } from '@mui/material/colors';

const ClassAraliya = () => {
  const [teacherData, setTeacherData] = useState(() => {
    const savedData = localStorage.getItem('teacherData');
    return savedData ? JSON.parse(savedData) : null;
  });
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore();

  // Fetch teacher data
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && !teacherData) {
          const email = user.email;
          const teachersRef = collection(db, 'teachers');
          const q = query(teachersRef, where('email', '==', email));

          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const teacherDoc = querySnapshot.docs[0].data();
            setTeacherData(teacherDoc);
            localStorage.setItem('teacherData', JSON.stringify(teacherDoc));
          }
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setMessage('Error fetching teacher data.');
      }
    };

    fetchTeacherData();
  }, [teacherData, db]);

  // Fetch students based on teacher's className
  useEffect(() => {
    const fetchStudents = async () => {
      if (teacherData) {
        try {
          const studentsRef = collection(db, 'students');
          const q = query(studentsRef, where('className', '==', teacherData.class));

          const querySnapshot = await getDocs(q);
          const studentList = querySnapshot.docs.map((doc) => doc.data());
          setStudents(studentList);
        } catch (error) {
          console.error('Error fetching students:', error);
          setMessage('Error fetching students.');
        }
      }
    };

    fetchStudents();
  }, [teacherData, db]);

 // Handle search functionality
 useEffect(() => {
  const filtered = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.admissionNumber.toLowerCase().includes(searchLower) ||
      student.childName.toLowerCase().includes(searchLower) ||
      student.gender.toLowerCase().includes(searchLower) ||
      student.birthDate.toLowerCase().includes(searchLower) ||
      (student.contactNo && student.contactNo.toLowerCase().includes(searchLower)) ||
      (student.telephoneNumber && student.telephoneNumber.toLowerCase().includes(searchLower)) ||
      (student.phoneNumber && student.phoneNumber.toLowerCase().includes(searchLower)) ||
      (student.motherDetails?.fullName && student.motherDetails.fullName.toLowerCase().includes(searchLower))
    );
  });
  setFilteredStudents(filtered);
}, [students, searchTerm]);

const highlightText = (text) => {
  if (!text || typeof text !== 'string') return ""; // Ensure text is a valid string
  if (!searchTerm || typeof searchTerm !== 'string') return text; // Ensure searchTerm is valid

  const regex = new RegExp(`(${searchTerm})`, 'gi'); // Create regex safely
  const matches = text.match(regex); // Find matches

  if (!matches) {
    return text; // Return original text without modification
  }

  return text.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? ( // Compare case-insensitively
      <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>{part}</span>
    ) : (
      part
    )
  );
};

  const downloadTimetable = async () => {
    try {
      const timetableFolderRef = ref(storage, 'timetable');
      const fileList = await listAll(timetableFolderRef); 

      if (fileList.items.length === 0) {
        setMessage('No files found in the timetable folder.');
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
      setMessage('Error downloading timetable.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a PDF file to upload.');
      return;
    }

    try {
      const fileRef = ref(storage, `learningMaterials/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setMessage(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Error uploading file:', error);
          setMessage('Error uploading file.');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          await addDoc(collection(db, 'learningMaterial'), {
            fileName: file.name,
            fileURL: downloadURL,
            uploadedAt: new Date(),
            teacher: teacherData?.fullName || 'Unknown Teacher',
            class: teacherData?.class || 'Unknown Class',
          });

          setMessage('File uploaded and saved successfully!');
          setShowModal(false);
          setFile(null);
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file.');
    }
  };

    // Handle Logout
    const handleLogout = () => {
      signOut(auth) // Sign out the user
        .then(() => {
          console.log('User logged out');
          navigate('/login'); // Redirect to the login page after successful logout
        })
        .catch((error) => {
          console.error('Logout error:', error);
        });
    };


    const handlePropicChange = async () => {
      // Open file input dialog to select a new profile picture
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*'; // Only allow image files
      fileInput.click();
    
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
    
        if (!file) {
          return; // If no file is selected, exit the function
        }
    
        // Create FormData to send the file to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'jmrpithq'); // Cloudinary upload preset
        formData.append('cloud_name', 'dgecq2e6l'); // Your Cloudinary cloud name
    
        try {
          // Upload the image to Cloudinary
          const response = await axios.post('https://api.cloudinary.com/v1_1/dgecq2e6l/image/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          // Get the URL of the uploaded image
          const photoURL = response.data.secure_url;
    
          // Update the teacher's photo URL in the state and Firestore
          setTeacherData((prevData) => {
            const updatedData = { ...prevData, photo: photoURL };
            localStorage.setItem('teacherData', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
          });
    
          // Optionally, you can update Firestore if needed
          if (teacherData) {
            const teacherRef = collection(db, 'teachers');
            const q = query(teacherRef, where('email', '==', teacherData.email));
    
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const teacherDocId = querySnapshot.docs[0].id;
              await updateDoc(doc(db, 'teachers', teacherDocId), { photo: photoURL });
            }
          }
    
          // Optionally, show a success message or update UI
          setMessage('Profile picture updated successfully!');
        } catch (error) {
          console.error('Error uploading image:', error);
          setMessage('Error uploading profile picture.');
        }
      };
    };
    


  return (
<Container style={{ backgroundColor: green[50], paddingTop: '20px' }}>
      {/* Header */}
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: green[500], marginBottom: '20px' }}>
        <Typography variant="h4" style={{ color: 'white' }}>
          Welcome Back Ms. {teacherData ? teacherData.fullName : '...'} to Teacher Dashboard
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Section: Class Info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white' }}>
            <Typography variant="h5" style={{ marginBottom: '20px' }}>
              Class {teacherData ? teacherData.class : '...'}
            </Typography>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={10}>
                <TextField
                  label="Search..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained"  style={{ height: '100%', backgroundColor: '#333' }} onClick={() => {}}>
                  Search
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>DOB</TableCell>
                    <TableCell>Telephone</TableCell>
                    <TableCell>Parents' Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>{highlightText(student.admissionNumber)}</TableCell>
                        <TableCell>{highlightText(student.childName)}</TableCell>
                        <TableCell>{highlightText(student.gender)}</TableCell>
                        <TableCell>{highlightText(student.birthDate)}</TableCell>
                        <TableCell>{highlightText(student.contactNo || student.telephoneNumber || student.phoneNumber || 'N/A')}</TableCell>
                        <TableCell>{highlightText(student.motherDetails?.fullName || 'N/A')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                        No matching students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Section: Profile Info */}
        <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white' }}>
    {teacherData && teacherData.photo ? (
      <img
        src={teacherData.photo}
        alt="Teacher"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '20px',
        }}
      />
    ) : (
        <div
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            marginBottom: '20px',
          }}
        />
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={handlePropicChange}
        style={{ marginBottom: '20px', backgroundColor: '#0e5c1e' }}
      >
        Add/Edit Profile Picture
      </Button>
            {teacherData && (
              <div>
                <Typography variant="h6">Ms.{teacherData.fullName}</Typography>
                <Typography variant="body1">Class {teacherData.class}</Typography>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Sidebar Buttons (No Sidebar, Just Actions) */}
      <Grid container spacing={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={downloadTimetable}
            style={{ padding: '15px', backgroundColor: '#0e5c45' }}
          >
            Time Table
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setShowModal(true)}
            style={{ padding: '15px', backgroundColor: '#0e5c45' }}
          >
            Study Materials
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate('/addGrage')}
            style={{ padding: '15px', backgroundColor: '#0e5c45' }}
          >
            Add Grades
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            style={{ padding: '15px', backgroundColor: '#3b7d3c' }}
          >
            Logout
          </Button>
        </Grid>
      </Grid>

      {/* Modal for Study Material Upload */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Paper
          elevation={5}
          style={{
            padding: '30px',
            margin: 'auto',
            maxWidth: '600px',
            marginTop: '100px',
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            Upload Study Material
          </Typography>
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #388E3C',
              padding: '20px',
              marginBottom: '20px',
              cursor: 'pointer',
            }}
          >
            {file ? <Typography>{file.name}</Typography> : <Typography>Drag & drop a PDF here or click to select one.</Typography>}
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <Button variant="contained" color="primary" onClick={handleFileUpload} style={{ marginRight: '10px' }}>
            Upload
          </Button>
          <Button variant="outlined" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Paper>
      </Modal>

      {/* Message Box */}
      {message && (
        <Paper
          style={{
            backgroundColor: green[500],
            color: 'white',
            padding: '10px',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          {message}
        </Paper>
      )}
    </Container>


    
  );
};

export default ClassAraliya;