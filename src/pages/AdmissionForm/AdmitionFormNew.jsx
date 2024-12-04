import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Import Firestore
import { useNavigate } from 'react-router-dom';
import { Label } from "@mui/icons-material";
import Navbar from '../homepage/components/navbar';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Step 1: Child's Info
    childName: '',
    gender: '',
    birthDate: '',
    address: '',
    city: '',
    phoneNumber: '',
    distance: '',
    email: '',
    uploadedFile: null,

    // Step 2: Mother's Info
    motherfullName: '',
    motherpermanentAddress: '',
    mothercurrentResidentialAddress: '',
    mothernationality: '',
    motherdateOfBirth: '',
    mothercontactNo: '',
    mothertelephoneNumber: '',
    motheroccupation: '',
    motherworkplaceContactNo: '',
    motherworkplaceAddress: '',
    motheremailAddress: '',
    motherreligion: '',
    mothereducationalQualification: [],

    // Step 3: Father's Info
    fatherfullName: '',
    fatherpermanentAddress: '',
    fathercurrentResidentialAddress: '',
    fathernationality: '',
    fatherdateOfBirth: '',
    fathercontactNo: '',
    fathertelephoneNumber: '',
    fatheroccupation: '',
    fatherworkplaceContactNo: '',
    fatherworkplaceAddress: '',
    fatheremailAddress: '',
    fatherreligion: '',
    fathereducationalQualification: [],

    // Step 4: Guardian's Info
    guardianrelationship: '',
    guardianpermanentAddress: '',
    guardianresidentialAddress: '',
    guardiancontactNumber: '',
    guardianemailAddress: '',
    guardianoccupation: '',

    // Step 5: Other Info
    hasSiblings: '',
    siblingDetails: [], // array of { siblingName: '', siblingYear: '' }
    studiedInSchool: '',
    referralSource: '',

    // Step 6: Terms
    termsAccepted: false,
  });

  const handleNext = () => {
    // Check if the current step is 4
    if (step === 4) {
      if (
        !formData.motherfullName.trim() &&
        !formData.fatherfullName.trim() &&
        !formData.guardianrelationship.trim()
      ) {
        alert("To proceed to the next step, you must provide details for at least one parent(Mother Or Father) or guardian. And Also Check Theri All Details are Provided.!");
        return; // Stop execution if the condition is not met
      }
    }
  
    // Validate the current step's fields
    const currentErrors = validateStep(step);
    if (Object.keys(currentErrors).length === 0) {
      setErrors({}); // Clear errors
      setStep((prev) => prev + 1);
    } else {
      setErrors(currentErrors); // Set validation errors
    }
  };
  
  

  const handlePrevious = () => setStep((prev) => prev - 1);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let allErrors = {};
    // Validate all steps (assuming there are 6 steps)
    for (let i = 1; i <= 6; i++) {
      const stepErrors = validateStep(i);
      allErrors = { ...allErrors, ...stepErrors };
    }
  
    // Check for validation errors
    if (Object.keys(allErrors).length === 0) {
      try {
        // Check if terms are accepted
        if (!formData.termsAccepted) {
          alert("You must accept the terms and conditions before submitting.");
          return;
        }
  
        // Upload file if present
        let uploadedFileUrl = "";
        if (formData.uploadedFile) {
          uploadedFileUrl = await handleFileUpload(formData.uploadedFile);
          formData.uploadedFile = uploadedFileUrl;
        }
  
        // Generate admission ID
        const admissionId = await generateAdmissionId();
  
        // Save to Firestore
        await setDoc(doc(db, "newadmission", admissionId), {
          ...formData,
          admission: admissionId,
        });
        console.log("Document written with ID: ", admissionId);
  
        // Reset form
        alert("Form submitted successfully!");
        setFormData({
          childName: "",
          gender: "",
          birthDate: "",
          address: "",
          city: "",
          phoneNumber: "",
          distance: "",
          email: "",
          uploadedFile: null,
          motherName: "",
          motherAge: "",
          motherEmail: "",
          fatherName: "",
          fatherAge: "",
          fatherEmail: "",
          guardianName: "",
          guardianAge: "",
          guardianEmail: "",
          hasSiblings: "",
          siblingDetails: [],
          studiedInSchool: "",
          referralSource: "",
          termsAccepted: false, // Reset to false
          admissionId: "",
        });
        setStep(1);
  
        // Navigate
        navigate("/admission");
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error submitting the form!");
      }
    } else {
      // Set and display validation errors
      setErrors(allErrors);
      alert("Please Check Your Form And fix the errors before submitting.");
    }
  };
  

  const validateStep = (currentStep) => {
    const currentErrors = {};
    switch (currentStep) {
      case 1: // Step 1: Child's Info validations
        if (!formData.childName.trim()) currentErrors.childName = "Child's name is required.";
        if (!formData.gender) currentErrors.gender = "Gender is required.";
        if (!formData.birthDate || !isValidDOB(formData.birthDate))
          currentErrors.birthDate = "Date of birth must be 3–5 years from today.";
        if (!formData.address.trim()) currentErrors.address = "Address is required.";
        if (!formData.city.trim()) currentErrors.city = "City is required.";
        if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber))
          currentErrors.phoneNumber = "Enter a valid Sri Lankan phone number.";
        if (!formData.email || !isValidEmail(formData.email))
          currentErrors.email = "Enter a valid email address.";
        if (formData.uploadedFile && !isValidFileType(formData.uploadedFile))
          currentErrors.uploadedFile = "Invalid file type. Only JPG, JPEG, PNG, and PDF files are allowed.";
        if (!formData.distance || !isValidDistance(formData.distance))
          currentErrors.distance = "Enter a valid distance around 1KM - 5KM.";
        break;
  
        case 2: // Step 2: Mother's Info validations
        // If motherFullName is provided, other fields should be required
        if (formData.motherfullName.trim()) {
          if (!formData.motherpermanentAddress.trim())
            currentErrors.motherpermanentAddress = "Permanent address is required.";
          if (!formData.mothercurrentResidentialAddress.trim())
            currentErrors.mothercurrentResidentialAddress = "Current residential address is required.";
          if (!formData.mothernationality.trim())
            currentErrors.mothernationality = "Mother's nationality is required.";
          if (!formData.motherdateOfBirth || !isValidDOBpartnt(formData.motherdateOfBirth))
            currentErrors.motherdateOfBirth = "Mother's birthdate cannot be a future date.";
          if (!formData.mothercontactNo || !isValidPhoneNumber(formData.mothercontactNo))
            currentErrors.mothercontactNo = "Enter a valid phone number for the mother.";
          if (!formData.motheremailAddress || !isValidEmail(formData.motheremailAddress))
            currentErrors.motheremailAddress = "Enter a valid email for the mother.";
          if (!formData.motherreligion.trim())
            currentErrors.motherreligion = "Mother's religion is required.";
          if (!formData.mothereducationalQualification.length)
            currentErrors.mothereducationalQualification = "Mother's educational qualifications are required.";
        }
        break;
  
        case 3: // Step 3: Father's Info validations
        // If fatherFullName is provided, other fields should be required
        if (formData.fatherfullName.trim()) {
          if (!formData.fatherpermanentAddress.trim())
            currentErrors.fatherpermanentAddress = "Permanent address is required.";
          if (!formData.fathercurrentResidentialAddress.trim())
            currentErrors.fathercurrentResidentialAddress = "Current residential address is required.";
          if (!formData.fathernationality.trim())
            currentErrors.fathernationality = "Father's nationality is required.";
          if (!formData.fatherdateOfBirth || !isValidDOBpartnt(formData.fatherdateOfBirth))
            currentErrors.fatherdateOfBirth = "Father's birthdate cannot be a future date.";
          if (!formData.fathercontactNo || !isValidPhoneNumber(formData.fathercontactNo))
            currentErrors.fathercontactNo = "Enter a valid phone number for the father.";
          if (!formData.fatheremailAddress || !isValidEmail(formData.fatheremailAddress))
            currentErrors.fatheremailAddress = "Enter a valid email for the father.";
          if (!formData.fatherreligion.trim())
            currentErrors.fatherreligion = "Father's religion is required.";
          if (!formData.fathereducationalQualification.length)
            currentErrors.fathereducationalQualification = "Father's educational qualifications are required.";
        }
        break;
  
        case 4: // Step 4: Guardian's Info validations
        // If guardianrelationship is provided, validate other fields
        if (formData.guardianrelationship.trim()) {
          if (!formData.guardianpermanentAddress.trim())
            currentErrors.guardianpermanentAddress = "Permanent address for the guardian is required.";
          if (!formData.guardianresidentialAddress.trim())
            currentErrors.guardianresidentialAddress = "Current residential address for the guardian is required.";
          if (!formData.guardiancontactNumber || !isValidPhoneNumber(formData.guardiancontactNumber))
            currentErrors.guardiancontactNumber = "Enter a valid phone number for the guardian.";
          if (!formData.guardianemailAddress || !isValidEmail(formData.guardianemailAddress))
            currentErrors.guardianemailAddress = "Enter a valid email for the guardian.";
          if (!formData.guardianoccupation.trim())
            currentErrors.guardianoccupation = "Guardian's occupation is required.";
        }
        break;
  
      case 5: // Step 5: Other Info validations
        if (formData.hasSiblings === "yes" && (!formData.siblingDetails || !formData.siblingDetails.length))
          currentErrors.siblingDetails = "Sibling details are required if you selected 'Yes' for siblings.";
        if (formData.studiedInSchool === "yes" && !formData.referralSource.trim())
          currentErrors.referralSource = "Referral source is required if the child studied in school.";
        break;
  
      case 6: // Step 6: File Upload & Terms validations
        if (!formData.termsAccepted)
          currentErrors.termsAccepted = "You must accept the terms and conditions.";
        break;
  
      default:
        break;
    }
    return currentErrors;
  };
  
  
  const isValidFileType = (file) => {
    const allowedExtensions = /(\.pdf|\.jpg|\.jpeg|\.png)$/i;
    return allowedExtensions.test(file.name);
  };  


  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^07\d{8}$/;
    return phoneRegex.test(phoneNumber);
  };

  const isValidDOB = (dob) => {
    const date = new Date(dob);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
    return date >= minDate && date <= maxDate;
  };

  const isValidDOBpartnt = (dob) => {
    const date = new Date(dob);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date >= minDate && date <= maxDate;
  };

  // Function to validate distance (greater than 5KM)
  const isValidDistance = (distance) => {
    const distanceValue = parseFloat(distance);
    return !isNaN(distanceValue) && distanceValue <= 5; // Ensure distance is greater than or equal to 5KM
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name.startsWith('siblingDetails')) {
      // Handle sibling details updates
      const index = parseInt(name.match(/\[(\d+)\]/)[1]);
      const field = name.split('.').pop(); // Either 'siblingName' or 'siblingYear'
      
      setFormData((prev) => {
        const updatedSiblings = [...prev.siblingDetails];
        updatedSiblings[index][field] = value;  // Update the specific sibling's field
  
        return {
          ...prev,
          siblingDetails: updatedSiblings,
        };
      });
    } else {
      // Handle regular fields (checkbox, text, etc.)
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when user starts typing
    }
  };
  

// handle file change (uploading an image)
const handleFileChange = (file) => {
    setFormData({
      ...formData,
      uploadedFile: file,
    });
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "jmrpithq");

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dgecq2e6l/upload`,
      formData
    );

    return res.data.secure_url;
  };

  const handleCheckboxChange = (fieldName, value) => {
    setFormData((prevData) => {
      const currentValues = prevData[fieldName];
  
      if (currentValues.includes(value)) {
        // Remove the value if it's already checked
        return {
          ...prevData,
          [fieldName]: currentValues.filter((item) => item !== value),
        };
      } else {
        // Add the value if it's not already checked
        return {
          ...prevData,
          [fieldName]: [...currentValues, value],
        };
      }
    });
  };
  

  const addSibling = () => {
    setFormData((prevData) => ({
      ...prevData,
      siblingDetails: [
        ...prevData.siblingDetails,
        { siblingName: "", siblingYear: "" }, // Default sibling object
      ],
    }));
  };
  

  const removeSibling = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      siblingDetails: prevData.siblingDetails.filter(
        (_, siblingIndex) => siblingIndex !== index
      ),
    }));
  };
  
  
  const generateAdmissionId = async () => {
    const admissionsCollection = await getDocs(collection(db, 'newadmission'));
    let highestId = 0;

    admissionsCollection.forEach((doc) => {
        const id = doc.id;
        const match = id.match(/(\d+)$/);
        if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (num > highestId) highestId = num;
        }
    });

    return String(highestId + 1).padStart(3, '0');
};
  return (
<form onSubmit={handleSubmit} style={styles.formContainer}>
<Navbar />

  {/* Progress Indicator */}
  <div style={styles.progressContainer}>
    {['1', '2', '3', '4', '5', '6'].map((stepNumber, index) => (
      <div
        key={index}
        style={{
          ...styles.stepCircle,
          backgroundColor: step === index + 1 ? '#4CAF50' : '#ddd', // Active step color
        }}
      >
        {stepNumber}
      </div>
    ))}
  </div>

  <div style={styles.formStep}>
    {step === 1 && (
      <ChildInfo
        formData={formData}
        handleChange={handleChange}
        handleFileChange={handleFileChange} // Specific for file uploads
        errors={errors}
      />
    )}
    {step === 2 && (
      <MotherInfo
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange} // Specific for checkboxes
        handleNext={handleNext}
        errors={errors}
      />
    )}
    {step === 3 && (
      <FatherInfo
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange} // Specific for checkboxes
        handleNext={handleNext}
        errors={errors}
      />
    )}
    {step === 4 && (
      <GuardianInfo
        formData={formData}
        handleChange={handleChange}
        handleNext={handleNext}
        errors={errors}
      />
    )}
    {step === 5 && (
      <OtherInfo
        formData={formData}
        handleChange={handleChange}
        addSibling={addSibling} // Specific for adding siblings
        removeSibling={removeSibling} // Specific for removing siblings
        errors={errors}
      />
    )}
    {step === 6 && (
      <TermsAndConditions
        formData={formData}
        handleChange={handleChange}
        errors={errors}
      />
    )}
  </div>

  <div style={styles.formNavigation}>
    {step > 1 && (
      <button
        type="button"
        onClick={handlePrevious}
        style={styles.previousButton}
      >
        Previous
      </button>
    )}
    {step < 6 && (
      <button
        type="button"
        onClick={handleNext}
        style={styles.nextButton}
      >
        Next
      </button>
    )}
    {step === 6 && (
      <button type="submit" style={styles.submitButton}>
        Submit
      </button>
    )}
  </div>
</form>
  );
};

const styles = {
    formContainer: {
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Roboto', sans-serif",
      marginTop: '110px',
    },
    progressContainer: {
      position: 'fixed', // Fixed position at the top of the page
      top: '125px', // 110px from the top of the page
      left: '50%', // Centers horizontally
      transform: 'translateX(-50%)', // Ensures it's perfectly centered
      display: 'flex', // Flexbox for layout
      justifyContent: 'center', // Center circles horizontally
      alignItems: 'flex-start', // Aligns circles to the top
      zIndex: 9999, // Ensure it stays on top of other content
    },
    stepCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 10px', // Space between the circles
    },
    formStep: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputField: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      width: '100%',
      boxSizing: 'border-box',
    },
    label: {
      fontWeight: '500',
      marginBottom: '10px',
    },
    h2: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333',
    },
    formNavigation: {
      marginTop: '20px',
    },
    buttonBase: {
      padding: '12px 25px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.3s ease',
    },
    navButton: {
      backgroundColor: '#4CAF50',
      color: '#fff',
    },
    previousButton: {
      backgroundColor: 'rgb(119, 162, 120)',
      color: '#fff',
      border: 'none',
        borderRadius: '25px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        marginTop: '20px',
        marginBottom: '20px',
        display: 'block',
        margin: '0 auto 20px auto',
        width: '20%',
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        marginBottom: '20px',
        display: 'block',
        margin: '0 auto 20px auto',
        width: '20%',
      },
    skipButton: {
        backgroundColor: '#0c3529',
        color: '#fff',
        border: 'none',
        borderRadius: '25px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        marginTop: '25px',
        marginBottom: '20px',
        display: 'block',
        margin: '0 auto 20px auto',
        width: '20%',
      },
    submitButton: {
      backgroundColor: '#1f4f41',
      color: '#fff',
      borderRadius: '25px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        marginBottom: '20px',
        display: 'block',
        margin: '0 auto 20px auto',
        width: '30%',
    },

    // form styles 

    stepContainer: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Roboto, sans-serif',
      },
      heading: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
      },
      inputField: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.3s ease-in-out',
      },
      inputFieldFocus: {
        borderColor: '#4CAF50',
      },
      fileInput: {
        margin: '10px 0',
      },
      imagePreview: {
        marginTop: '15px',
        textAlign: 'center',
      },
      image: {
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      },

    //   mothers

    stepContainer: {
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Roboto, sans-serif',
        maxWidth: '800px',
        margin: '20px auto',
      },
      heading: {
        fontSize: '24px',
        marginBottom: '20px',
        color: '#fff',
        textAlign: 'center',
      },
      

      nextButtonHover: {
        backgroundColor: '#45a049',
      },
      inputField: {
        width: '100%',
        padding: '12px',
        margin: '10px 0',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.3s ease-in-out',
      },
      checkboxContainer: {
        marginTop: '20px',
      },
      checkboxLabel: {
        display: 'inline-block',
        marginRight: '10px',
        fontSize: '16px',
      },
      checkbox: {
        marginRight: '5px',
      },
      label: {
        fontSize: '16px',
        marginBottom: '10px',
      },

    //   other form
 
      checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px',
      },
      label: {
        fontSize: '16px',
        color: '#555',
        marginLeft: '8px',
      },
      checkbox: {
        width: '16px',
        height: '16px',
      },
      siblingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px',
      },
      
      addButton: {
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px',
        marginBottom: '20px',
        width: '20%',
      },
      removeButton: {
        padding: '10px 15px',
        backgroundColor: '#FF5722',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
      },
      selectField: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '16px',
        backgroundColor: '#f9f9f9',
        margin: '10px 0',
      },

    //   Terms and Conditions

      infoText: {
        fontSize: "16px",
        color: "#34495e",
        marginBottom: "20px",
      },
      guidelinesContainer: {
        backgroundColor: "#ecf0f1",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "20px",
      },
      guidelinesHeading: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#0c3529",
        marginBottom: "10px",
      },
      guidelinesList: {
        listStyleType: "disc",
        paddingLeft: "20px",
        fontSize: "16px",
        color: "#2c3e50",
      },
      confirmationContainer: {
        margin: "20px 0",
      },
      confirmationText: {
        fontSize: "16px",
        color: "#34495e",
        lineHeight: "1.6",
      },
      checkboxLabel: {
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        color: "#2c3e50",
        marginTop: "20px",
      },
      checkbox: {
        marginRight: "10px",
        width: "18px",
        height: "18px",
      },
      
  };


// Individual Steps as Components
const ChildInfo = ({ formData, handleChange, handleFileChange, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 1: Child's Info</h2>
  
      <input
        type="text"
        name="childName"
        value={formData.childName}
        onChange={handleChange}
        placeholder="Child's Name"
        style={styles.inputField}
      />
       {errors.childName && <span style={{ color: 'red' }}>{errors.childName}</span>}
      
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        style={styles.inputField}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <span style={{ color: 'red' }}>{errors.gender}</span>}

      <label>Birthday :</label>
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        style={styles.inputField}
      />
       {errors.birthDate && <span style={{ color: 'red' }}>{errors.birthDate}</span>}
      
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        style={styles.inputField}
      />
      {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}

      <select
        name="city"
        value={formData.city}
        onChange={handleChange}
        style={styles.inputField}
      >
        <option value="" disabled>
          Select a City
        </option>
        <option value="Colombo">Colombo</option>
        <option value="Avissawella">Avissawella</option>
        <option value="Negombo">Negombo</option>
        <option value="Gampaha">Gampaha</option>
        <option value="Panadura">Panadura</option>
        <option value="Kalutara">Kalutara</option>
        <option value="Nawalapitiya">Nawalapitiya</option>
        <option value="Kandy">Kandy</option>
        <option value="Hatton">Hatton</option>
        <option value="NuwaraEliya">Nuwara Eliya</option>
        <option value="Matale">Matale</option>
        <option value="Galle">Galle</option>
        <option value="Matara">Matara</option>
        <option value="Hambantota">Hambantota</option>
        <option value="Chilaw">Chilaw</option>
        <option value="Kurunegala">Kurunegala</option>
        <option value="Jaffna">Jaffna</option>
        <option value="Mannar">Mannar</option>
        <option value="Vavuniya">Vavuniya</option>
        <option value="Ampara">Ampara</option>
        <option value="Kalmunai">Kalmunai</option>
        <option value="Batticaloa">Batticaloa</option>
        <option value="Trincomalee">Trincomalee</option>
        <option value="Anuradhapura">Anuradhapura</option>
        <option value="Polonnaruwa">Polonnaruwa</option>
        <option value="Monaragala">Monaragala</option>
        <option value="Badulla">Badulla</option>
        <option value="Bandarawela">Bandarawela</option>
        <option value="Ratnapura">Ratnapura</option>
        <option value="Kegalle">Kegalle</option>
      </select>
      {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>}

      <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        style={styles.inputField}
      />
      {errors.phoneNumber && <span style={{ color: 'red' }}>{errors.phoneNumber}</span>}
      <input
        type="number"
        name="distance"
        value={formData.distance}
        onChange={handleChange}
        placeholder="Distance to School (KM)"
        style={styles.inputField}
      />
      {errors.distance && <span style={{ color: 'red' }}>{errors.distance}</span>}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email ( Provide your primery email to get updates about the Child )"
        style={styles.inputField}
      />
      {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      
      <label>Upload Birth Certificate : </label>
      <input
        type="file"
        onChange={(e) => handleFileChange(e.target.files[0])}
        accept="image/*"
        style={styles.fileInput}
      />
      {errors.uploadedFile && <span style={{ color: 'red' }}>{errors.uploadedFile}</span>}
      
      {formData.uploadedFile && (
        <div style={styles.imagePreview}>
          <img
            src={URL.createObjectURL(formData.uploadedFile)}
            alt="Selected"
            width="100"
            style={styles.image}
          />
        </div>
      )}
    </div>
  );


  const MotherInfo = ({ formData, handleChange, handleCheckboxChange, handleNext, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 2: Mother's Info</h2>
  
      <button
        type="button"
        onClick={handleNext}
        style={styles.skipButton}
      >
        Skip
      </button>
  
      <input
        type="text"
        name="motherfullName"
        value={formData.motherfullName}
        onChange={handleChange}
        placeholder="Mother's Full Name"
        style={styles.inputField}
      />

      <input
        type="text"
        name="motherpermanentAddress"
        value={formData.motherpermanentAddress}
        onChange={handleChange}
        placeholder="Permanent Address"
        style={styles.inputField}
      />
      {errors.motherpermanentAddress && <span style={{ color: 'red' }}>{errors.motherpermanentAddress}</span>}
      
      <input
        type="text"
        name="mothercurrentResidentialAddress"
        value={formData.mothercurrentResidentialAddress}
        onChange={handleChange}
        placeholder="Residential Address"
        style={styles.inputField}
      />
      {errors.mothercurrentResidentialAddress && <span style={{ color: 'red' }}>{errors.mothercurrentResidentialAddress}</span>}

      <input
        type="text"
        name="mothernationality"
        value={formData.mothernationality}
        onChange={handleChange}
        placeholder="Nationality"
        style={styles.inputField}
      />
      {errors.mothernationality && <span style={{ color: 'red' }}>{errors.mothernationality}</span>}

      <label>
        Mother's Birthday:
      </label>
      <input
        type="date"
        name="motherdateOfBirth"
        value={formData.motherdateOfBirth}
        onChange={handleChange}
        style={styles.inputField}
      />
      {errors.motherdateOfBirth && <span style={{ color: 'red' }}>{errors.motherdateOfBirth}</span>}
      <input
        type="text"
        name="mothercontactNo"
        value={formData.mothercontactNo}
        onChange={handleChange}
        placeholder="Contact Number"
        style={styles.inputField}
      />
      {errors.mothercontactNo && <span style={{ color: 'red' }}>{errors.mothercontactNo}</span>}
      <input
        type="text"
        name="mothertelephoneNumber"
        value={formData.mothertelephoneNumber}
        onChange={handleChange}
        placeholder="Telephone Number"
        style={styles.inputField}
      />
      {errors.mothertelephoneNumber && <span style={{ color: 'red' }}>{errors.mothertelephoneNumber}</span>}

      <input
        type="text"
        name="motheroccupation"
        value={formData.motheroccupation}
        onChange={handleChange}
        placeholder="Occupation"
        style={styles.inputField}
      />
      {errors.motheroccupation && <span style={{ color: 'red' }}>{errors.motheroccupation}</span>}

      <input
        type="text"
        name="motherworkplaceContactNo"
        value={formData.motherworkplaceContactNo}
        onChange={handleChange}
        placeholder="Workplace Contact Number"
        style={styles.inputField}
      />
      {errors.motherworkplaceContactNo && <span style={{ color: 'red' }}>{errors.motherworkplaceContactNo}</span>}

      <input
        type="text"
        name="motherworkplaceAddress"
        value={formData.motherworkplaceAddress}
        onChange={handleChange}
        placeholder="Workplace Address"
        style={styles.inputField}
      />
      {errors.motherworkplaceAddress && <span style={{ color: 'red' }}>{errors.motherworkplaceAddress}</span>}

      <input
        type="email"
        name="motheremailAddress"
        value={formData.motheremailAddress}
        onChange={handleChange}
        placeholder="Email Address"
        style={styles.inputField}
      />
      {errors.motheremailAddress && <span style={{ color: 'red' }}>{errors.motheremailAddress}</span>}
      <input
        type="text"
        name="motherreligion"
        value={formData.motherreligion}
        onChange={handleChange}
        placeholder="Religion"
        style={styles.inputField}
      />
      {errors.motherreligion && <span style={{ color: 'red' }}>{errors.motherreligion}</span>}

      <div style={styles.checkboxContainer}>
        <label style={styles.label}>Educational Qualification:</label>
        {["Primary", "Secondary", "Degree", "Master"].map((level) => (
          <label key={level} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={level}
              checked={formData.mothereducationalQualification.includes(level)}
              onChange={(e) =>
                handleCheckboxChange("mothereducationalQualification", e.target.value)
              }
              style={styles.checkbox}
            />
            {level}
          </label>
        ))}
      </div>
      {errors.mothereducationalQualification && <span style={{ color: 'red' }}>{errors.mothereducationalQualification}</span>}

    </div>
  );

  const FatherInfo = ({ formData, handleChange, handleCheckboxChange, handleNext, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 3: Father's Info</h2>
  
      <button
        type="button"
        onClick={handleNext}
        style={styles.skipButton}
      >
        Skip
      </button>
  
      <input
        type="text"
        name="fatherfullName"
        value={formData.fatherfullName}
        onChange={handleChange}
        placeholder="Father's Full Name"
        style={styles.inputField}
      />
      <input
        type="text"
        name="fatherpermanentAddress"
        value={formData.fatherpermanentAddress}
        onChange={handleChange}
        placeholder="Permanent Address"
        style={styles.inputField}
      />
      {errors.fatherpermanentAddress && <span style={{ color: 'red' }}>{errors.fatherpermanentAddress}</span>}

      <input
        type="text"
        name="fathercurrentResidentialAddress"
        value={formData.fathercurrentResidentialAddress}
        onChange={handleChange}
        placeholder="Residential Address"
        style={styles.inputField}
      />
      {errors.fathercurrentResidentialAddress && <span style={{ color: 'red' }}>{errors.fathercurrentResidentialAddress}</span>}

      <input
        type="text"
        name="fathernationality"
        value={formData.fathernationality}
        onChange={handleChange}
        placeholder="Nationality"
        style={styles.inputField}
      />
      {errors.fathernationality && <span style={{ color: 'red' }}>{errors.fathernationality}</span>}

      <input
        type="date"
        name="fatherdateOfBirth"
        value={formData.fatherdateOfBirth}
        onChange={handleChange}
        style={styles.inputField}
      />
      {errors.fatherdateOfBirth && <span style={{ color: 'red' }}>{errors.fatherdateOfBirth}</span>}
      <input
        type="text"
        name="fathercontactNo"
        value={formData.fathercontactNo}
        onChange={handleChange}
        placeholder="Contact Number"
        style={styles.inputField}
      />
      {errors.fathercontactNo && <span style={{ color: 'red' }}>{errors.fathercontactNo}</span>}
      <input
        type="text"
        name="fathertelephoneNumber"
        value={formData.fathertelephoneNumber}
        onChange={handleChange}
        placeholder="Telephone Number"
        style={styles.inputField}
      />
      {errors.fathertelephoneNumber && <span style={{ color: 'red' }}>{errors.fathertelephoneNumber}</span>}
      
      <input
        type="text"
        name="fatheroccupation"
        value={formData.fatheroccupation}
        onChange={handleChange}
        placeholder="Occupation"
        style={styles.inputField}
      />
      {errors.fatheroccupation && <span style={{ color: 'red' }}>{errors.fatheroccupation}</span>}

      <input
        type="text"
        name="fatherworkplaceContactNo"
        value={formData.fatherworkplaceContactNo}
        onChange={handleChange}
        placeholder="Workplace Contact Number"
        style={styles.inputField}
      />
      <input
        type="text"
        name="fatherworkplaceAddress"
        value={formData.fatherworkplaceAddress}
        onChange={handleChange}
        placeholder="Workplace Address"
        style={styles.inputField}
      />
      <input
        type="email"
        name="fatheremailAddress"
        value={formData.fatheremailAddress}
        onChange={handleChange}
        placeholder="Email Address"
        style={styles.inputField}
      />
      {errors.fatheremailAddress && <span style={{ color: 'red' }}>{errors.fatheremailAddress}</span>}
      <input
        type="text"
        name="fatherreligion"
        value={formData.fatherreligion}
        onChange={handleChange}
        placeholder="Religion"
        style={styles.inputField}
      />
      {errors.fatherreligion && <span style={{ color: 'red' }}>{errors.fatherreligion}</span>}

  
      <div style={styles.checkboxContainer}>
        <label style={styles.label}>Educational Qualification:</label>
        {["Primary", "Secondary", "Degree", "Master"].map((level) => (
          <label key={level} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              value={level}
              checked={formData.fathereducationalQualification.includes(level)}
              onChange={(e) =>
                handleCheckboxChange("fathereducationalQualification", e.target.value)
              }
              style={styles.checkbox}
            />
            {level}
          </label>
        ))}
      </div>
      {errors.fathereducationalQualification && <span style={{ color: 'red' }}>{errors.fathereducationalQualification}</span>}
    </div>
  );

  const GuardianInfo = ({ formData, handleChange, handleNext, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 4: Guardian's Info</h2>

      <button
        type="button"
        onClick={handleNext}
        style={styles.skipButton}
      >
        Skip
      </button>
  
      <input
        type="text"
        name="guardianrelationship"
        value={formData.guardianrelationship}
        onChange={handleChange}
        placeholder="Relationship And Name"
        style={styles.inputField}
      />
      {errors.guardianrelationship && <span style={{ color: 'red' }}>{errors.guardianrelationship}</span>}
      <input
        type="text"
        name="guardianpermanentAddress"
        value={formData.guardianpermanentAddress}
        onChange={handleChange}
        placeholder="Permanent Address"
        style={styles.inputField}
      />
      {errors.guardianpermanentAddress && <span style={{ color: 'red' }}>{errors.guardianpermanentAddress}</span>}

      <input
        type="text"
        name="guardianresidentialAddress"
        value={formData.guardianresidentialAddress}
        onChange={handleChange}
        placeholder="Residential Address"
        style={styles.inputField}
      />
      {errors.guardianresidentialAddress && <span style={{ color: 'red' }}>{errors.guardianresidentialAddress}</span>}

      <input
        type="text"
        name="guardiancontactNumber"
        value={formData.guardiancontactNumber}
        onChange={handleChange}
        placeholder="Contact Number"
        style={styles.inputField}
      />
      {errors.guardiancontactNumber && <span style={{ color: 'red' }}>{errors.guardiancontactNumber}</span>}
      <input
        type="email"
        name="guardianemailAddress"
        value={formData.guardianemailAddress}
        onChange={handleChange}
        placeholder="Email Address"
        style={styles.inputField}
      />
      {errors.guardianemailAddress && <span style={{ color: 'red' }}>{errors.guardianemailAddress}</span>}
      <input
        type="text"
        name="guardianoccupation"
        value={formData.guardianoccupation}
        onChange={handleChange}
        placeholder="Occupation"
        style={styles.inputField}
      />
      {errors.guardianoccupation && <span style={{ color: 'red' }}>{errors.guardianoccupation}</span>}
    </div>
  );

  const OtherInfo = ({ formData, handleChange, addSibling, removeSibling, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 5: Other Info</h2>
  
      {/* Sibling Information */}
      <div style={styles.checkboxContainer}>
        <label style={styles.label}>
          <input
            type="checkbox"
            name="hasSiblings"
            checked={formData.hasSiblings}
            onChange={handleChange}
            style={styles.checkbox}
          />
          Are there other children in the family?
        </label>
        {errors.siblingDetails && <span style={{ color: 'red' }}>{errors.siblingDetails}</span>}
      </div>
  
      {formData.hasSiblings &&
        formData.siblingDetails.map((sibling, index) => (
          <div key={index} style={styles.siblingContainer}>
            <input
              type="text"
              name={`siblingDetails[${index}].siblingName`}
              value={sibling.siblingName}
              onChange={handleChange}
              placeholder="Sibling Name"
              style={styles.inputField}
            />
            <input
              type="text"
              name={`siblingDetails[${index}].siblingYear`}
              value={sibling.siblingYear}
              onChange={handleChange}
              placeholder="Year"
              style={styles.inputField}
            />
            <button
              type="button"
              onClick={() => removeSibling(index)}
              style={styles.removeButton}
            >
              Remove
            </button>
          </div>  
        ))
        }

    {formData.hasSiblings && (
      <button type="button" onClick={addSibling} style={styles.addButton}>
        Add Sibling
      </button>
    )}
  
     
  
      {/* Studied in School Selection */}
      <select
        name="studiedInSchool"
        value={formData.studiedInSchool}
        onChange={handleChange}
        style={styles.selectField}
      >
        <option value="">Did they study in Bodhiraja Pre School?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
  
      {/* Referral Source Selection */}
      <select
        name="referralSource"
        value={formData.referralSource}
        onChange={handleChange}
        style={styles.selectField}
      >
        <option value="">How did you hear about the preschool?</option>
        <option value="Friend">Friend</option>
        <option value="Advertisement">Advertisement</option>
        <option value="Other">Other</option>
      </select>
      {errors.referralSource && <span style={{ color: 'red' }}>{errors.referralSource}</span>}
    </div>
  );

  const TermsAndConditions = ({ formData, handleChange, errors }) => (
    <div style={styles.stepContainer}>
      <h2 style={styles.heading}>Step 6: Terms and Conditions</h2>
      <p style={styles.infoText}>
        Please read and accept our terms and conditions before submitting your
        application.
      </p>
  
      {/* Application Guidelines */}
      <div style={styles.guidelinesContainer}>
        <p style={styles.guidelinesHeading}>APPLICATION GUIDELINES:</p>
        <ul style={styles.guidelinesList}>
          <li>All details and documents provided should be 100% accurate and valid.</li>
          <li>
            Any invalid details or forged documents will result in your application being
            immediately rejected.
          </li>
          <li>Canvassing in any form will be a disqualification.</li>
          <li>
            Decisions made by the School Management will be final. Letters of appeal will
            not be acknowledged nor considered.
          </li>
          <li>
            No phone calls or appointments will be accepted by the School Office regarding
            details about your application or subsequent interview.
          </li>
        </ul>
      </div>
  
      {/* Confirmation Text */}
      <div style={styles.confirmationContainer}>
        <p style={styles.confirmationText}>
          By submitting this duly completed application, I certify that the information
          given is true to the best of my knowledge. I agree to be bound by the School's
          rules & regulations. I agree to the terms & conditions listed above with regards
          to this application. I understand that should any information submitted
          (including documents) be found to be invalid or forged, my application will be
          rejected immediately.
        </p>
      </div>
  
      {/* Terms Acceptance Checkbox */}
      <label style={styles.checkboxLabel}>
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={(e) =>
            handleChange({ target: { name: "termsAccepted", value: e.target.checked } })
          }
          style={styles.checkbox}
        />
        <span>I accept the terms and conditions.</span>
      </label>
      {errors.termsAccepted && <span style={{ color: 'red' }}>{errors.termsAccepted}</span>}
    </div>
  );


export default MultiStepForm;
