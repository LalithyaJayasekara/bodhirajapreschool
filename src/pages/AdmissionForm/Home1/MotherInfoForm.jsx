import React from 'react';

const MotherInfoForm = ({ nextStep, prevStep, handleChange, formData }) => {
    return (
        <div>
            <h2>Mother's Information</h2>
            <form>
                <label>Full Name</label>
                <input type="text" value={formData.fullName} onChange={(e) => handleChange('mother', 'fullName', e.target.value)} />

                <label>Permanent Address</label>
                <input type="text" value={formData.permanentAddress} onChange={(e) => handleChange('mother', 'permanentAddress', e.target.value)} />

                <label>Current Residential Address</label>
                <input type="text" value={formData.currentResidentialAddress} onChange={(e) => handleChange('mother', 'currentResidentialAddress', e.target.value)} />

                <label>Nationality</label>
                <input type="text" value={formData.nationality} onChange={(e) => handleChange('mother', 'nationality', e.target.value)} />

                <label>Date of Birth</label>
                <input type="date" value={formData.dateOfBirth} onChange={(e) => handleChange('mother', 'dateOfBirth', e.target.value)} />

                <label>Contact Number</label>
                <input type="tel" value={formData.contactNo} onChange={(e) => handleChange('mother', 'contactNo', e.target.value)} />

                <label>Telephone Number</label>
                <input type="tel" value={formData.telephoneNumber} onChange={(e) => handleChange('mother', 'telephoneNumber', e.target.value)} />

                <label>Occupation</label>
                <input type="text" value={formData.occupation} onChange={(e) => handleChange('mother', 'occupation', e.target.value)} />

                <label>Workplace Contact Number</label>
                <input type="tel" value={formData.workplaceContactNo} onChange={(e) => handleChange('mother', 'workplaceContactNo', e.target.value)} />

                <label>Workplace Address</label>
                <input type="text" value={formData.workplaceAddress} onChange={(e) => handleChange('mother', 'workplaceAddress', e.target.value)} />

                <label>Email Address</label>
                <input type="email" value={formData.emailAddress} onChange={(e) => handleChange('mother', 'emailAddress', e.target.value)} />

                <label>Religion</label>
                <input type="text" value={formData.religion} onChange={(e) => handleChange('mother', 'religion', e.target.value)} />

                <label>Educational Qualification</label>
                <input type="text" value={formData.educationalQualification} onChange={(e) => handleChange('mother', 'educationalQualification', e.target.value)} />

                <button type="button" onClick={prevStep}>Previous</button>
                <button type="button" onClick={nextStep}>Next</button>
            </form>
        </div>
    );
};

export default MotherInfoForm;
