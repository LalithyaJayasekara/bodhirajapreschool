import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, serverTimestamp } from '../../../firebase/firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Home1.css';
import axios from 'axios';

const FormStep = () => {
    const [formData, setFormData] = useState({
        childName: '',
        gender: '',
        birthDate: '',
        address: '',
        city: '',
        phoneNumber: '',
        distance: '',
        email: '',
        uploadedFile: null,
    });
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();

    const cityCodes = {
        Colombo: '011',
        Avissawella: '036',
        Negombo: '031',
        Gampaha: '033',
        Panadura: '038',
        Kalutara: '034',
        Nawalapitiya: '054',
        Kandy: '081',
        Hatton: '051',
        NuwaraEliya: '052',
        Matale: '066',
        Galle: '091',
        Matara: '041',
        Hambantota: '047',
        Chilaw: '032',
        Kurunegala: '037',
        Jaffna: '021',
        Mannar: '023',
        Vavuniya: '024',
        Ampara: '063',
        Kalmunai: '067',
        Batticaloa: '065',
        Trincomalee: '026',
        Anuradhapura: '025',
        Polonnaruwa: '027',
        Monaragala: '055',
        Badulla: '055',
        Bandarawela: '057',
        Ratnapura: '045',
        Kegalle: '035',
    };

    const handleFileUpload = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            uploadedFile: event.target.files[0],
        }));
    };

    const validateForm = () => {
        const errors = {};
        const nameRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
        const birthDateLimit = new Date('2020-01-01'); // Dates after 2019

        if (!formData.childName) {
            errors.childName = 'Child name is required.';
        } else if (!nameRegex.test(formData.childName)) {
            errors.childName = 'Child name must contain only letters.';
        }

        if (!formData.gender) errors.gender = 'Gender is required.';

        if (!formData.birthDate) {
            errors.birthDate = 'Birth date is required.';
        } else if (new Date(formData.birthDate) < birthDateLimit) {
            errors.birthDate = 'Birth date must be after 2019.';
        }

        if (!formData.city) errors.city = 'City is required.';
        if (formData.phoneNumber.length < 10) errors.phoneNumber = 'Phone number must be 10 digits.';
        
        setErrorMessages(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextClick = async () => {
        if (!validateForm()) return;
    
        const expectedCode = cityCodes[formData.city];
        if (formData.phoneNumber.length === 10 && !formData.phoneNumber.startsWith(expectedCode)) {
            setErrorMessages((prev) => ({
                ...prev,
                phoneNumber: 'Please enter a valid landline number according to the city code.',
            }));
            return;
        }
    
        setLoading(true);
        try {
            let fileURL = '';
            // Upload file to Cloudinary
            if (formData.uploadedFile) {
                const formDataObj = new FormData();
                formDataObj.append('file', formData.uploadedFile);
                formDataObj.append('upload_preset', 'jmrpithq'); // Replace with your Cloudinary upload preset
                formDataObj.append('cloud_name', 'dgecq2e6l'); // Replace with your Cloudinary cloud name
    
                try {
                    const response = await axios.post(
                        'https://api.cloudinary.com/v1_1/dgecq2e6l/image/upload', // Replace with your Cloudinary cloud name
                        formDataObj
                    );
                    fileURL = response.data.secure_url; // URL of the uploaded file
                    console.log('File uploaded successfully, URL: ', fileURL);
                } catch (fileError) {
                    console.error('File upload error: ', fileError);
                    alert('File upload failed. Please try again.');
                    setLoading(false);
                    return;
                }
            } else {
                console.log('No file uploaded');
            }
    
            // Generate admission ID
            const admissionId = await generateAdmissionId();
    
            // Prepare data to store in Firestore
            const newData = {
                ...formData,
                admission: admissionId,
                imageURL: fileURL, // Store the uploaded file's URL
                createdAt: serverTimestamp(),
            };
    
            // Remove the uploadedFile field before sending to Firestore
            delete newData.uploadedFile;
    
            // Save data to Firestore
            console.log('Form Data: ', newData);
            await setDoc(doc(db, 'admissions', admissionId), newData);
            console.log('Document written with ID: ', admissionId);
            navigate('/mother-info');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error occurred while submitting the form. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    const generateAdmissionId = async () => {
        const admissionsCollection = await getDocs(collection(db, 'admissions'));
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
        <div className="form-container">
            <div className="step-indicator">
                <div className="step active-step">01</div>
                <div className="step">02</div>
                <div className="step">03</div>
                <div className="step">04</div>
            </div>

            <div className="step-titles">
                <p>CHILD'S INFORMATION</p>
                <p>PARENT'S INFORMATION</p>
                <p>OTHER INFORMATION</p>
                <p>TERMS AND CONDITIONS</p>
            </div>

            <div className="form">
                <h2>CHILD'S INFORMATION</h2>

                <form>
                    <div className="form-group">
                        <label>Full Name of the Child *</label>
                        <input 
                            type="text" 
                            placeholder="Full Name of the child (without initials)" 
                            value={formData.childName} 
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Only allow letters and spaces
                                setFormData({ ...formData, childName: value });
                            }} 
                            required
                        />
                        {errorMessages.childName && <p className="error">{errorMessages.childName}</p>}
                    </div>

                    <div className="form-group">
                        <label>Gender *</label>
                        <div className="radio-group">
                            <label>
                                <input 
                                    type="radio" 
                                    value="Male" 
                                    checked={formData.gender === 'Male'}
                                    onChange={() => setFormData({ ...formData, gender: 'Male' })} 
                                    required
                                />
                                Male
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="Female" 
                                    checked={formData.gender === 'Female'}
                                    onChange={() => setFormData({ ...formData, gender: 'Female' })} 
                                    required
                                />
                                Female
                            </label>
                        </div>
                        {errorMessages.gender && <p className="error">{errorMessages.gender}</p>}
                    </div>

                    <div className="form-group">
                        <label>Birth Date of the Child *</label>
                        <input 
                            type="date" 
                            value={formData.birthDate} 
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} 
                            required
                            min="2020-01-01" // Restrict date selection to after 2019
                        />
                        {errorMessages.birthDate && <p className="error">{errorMessages.birthDate}</p>}
                    </div>

                    <div className="form-group">
                        <label>Home Address</label>
                        <input 
                            type="text" 
                            placeholder="Enter the current home address" 
                            value={formData.address} 
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        />
                    </div>

                    <div className="form-group">
                        <label>City</label>
                        <select 
                            value={formData.city} 
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                        >
                            <option value="">Select a city</option>
                            {Object.keys(cityCodes).map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        {errorMessages.city && <p className="error">{errorMessages.city}</p>}
                    </div>

                    <div className="form-group">
                        <label>Telephone Number (Home)</label>
                        <input 
                            type="tel" 
                            placeholder="Enter home phone number" 
                            value={formData.phoneNumber} 
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, ''); // Keep only digits
                                setFormData({ ...formData, phoneNumber: value });
                            }} 
                            maxLength={10} 
                        />
                        {errorMessages.phoneNumber && <p className="error">{errorMessages.phoneNumber}</p>}
                    </div>

                    <div className="form-group">
                        <label>Distance from the mentioned address to preschool</label>
                        <input 
                            type="text" 
                            placeholder="In km" 
                            value={formData.distance} 
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, ''); // Keep only digits
                                setFormData({ ...formData, distance: value });
                            }} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address (Optional)</label>
                        <input 
                            type="email" 
                            placeholder="Enter email address" 
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Child's Birth Certificate *</label>
                        <input 
                            type="file" 
                            onChange={handleFileUpload} 
                            required
                        />
                    </div>

                    <button type="button" onClick={handleNextClick} disabled={loading}>
                        {loading ? 'Submitting...' : 'Next'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormStep;
