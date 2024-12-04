import React from 'react';

const GuardianInfoForm = ({ nextStep, prevStep, handleChange, formData }) => {
    return (
        <div>
            <h2>Guardian's Information</h2>
            <form>
                <label>Relationship with Child</label>
                <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => handleChange('guardian', 'relationship', e.target.value)}
                />

                <label>Permanent Address</label>
                <input
                    type="text"
                    value={formData.permanentAddress}
                    onChange={(e) => handleChange('guardian', 'permanentAddress', e.target.value)}
                />

                <label>Residential Address</label>
                <input
                    type="text"
                    value={formData.residentialAddress}
                    onChange={(e) => handleChange('guardian', 'residentialAddress', e.target.value)}
                />

                <label>Contact Number</label>
                <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange('guardian', 'contactNumber', e.target.value)}
                />

                <label>Email Address</label>
                <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleChange('guardian', 'emailAddress', e.target.value)}
                />

                <label>Occupation</label>
                <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange('guardian', 'occupation', e.target.value)}
                />

                <button type="button" onClick={prevStep}>Previous</button>
                <button type="button" onClick={nextStep}>Next</button>
            </form>
        </div>
    );
};

export default GuardianInfoForm;
