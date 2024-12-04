import React, { useState } from 'react';

const ChildInfoForm = ({ nextStep, handleChange, formData }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'jmrpithq');
        formData.append('cloud_name', 'dgecq2e6l');

        setUploading(true);

        const res = await fetch('https://api.cloudinary.com/v1_1/dgecq2e6l/image/upload', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        setUploading(false);
        handleChange('child', 'birthCertificateUrl', data.secure_url);
    };

    return (
        <div>
            <h2>Child's Information</h2>
            <form>
                <label>Child Name</label>
                <input type="text" value={formData.childName} onChange={(e) => handleChange('child', 'childName', e.target.value)} />

                <label>Gender</label>
                <select value={formData.gender} onChange={(e) => handleChange('child', 'gender', e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <label>Birth Date</label>
                <input type="date" value={formData.birthDate} onChange={(e) => handleChange('child', 'birthDate', e.target.value)} />

                <label>Address</label>
                <input type="text" value={formData.address} onChange={(e) => handleChange('child', 'address', e.target.value)} />

                <label>City</label>
                <input type="text" value={formData.city} onChange={(e) => handleChange('child', 'city', e.target.value)} />

                <label>Phone Number</label>
                <input type="tel" value={formData.phoneNumber} onChange={(e) => handleChange('child', 'phoneNumber', e.target.value)} />

                <label>Distance to School (in km)</label>
                <input type="number" value={formData.distance} onChange={(e) => handleChange('child', 'distance', e.target.value)} />

                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => handleChange('child', 'email', e.target.value)} />

                <label>Child Birth Certificate</label>
                <input type="file" onChange={handleFileUpload} />
                {uploading && <p>Uploading...</p>}

                <button type="button" onClick={nextStep}>Next</button>
            </form>
        </div>
    );
};

export default ChildInfoForm;
