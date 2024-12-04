import React from 'react';

const FatherInfoForm = ({ nextStep, prevStep, handleChange, formData }) => {
    return (
        <div>
            <h2>Father's Information</h2>
            <form>
                <label>Father's Name</label>
                <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleChange('father', 'fatherName', e.target.value)}
                />

                <label>Permanent Address</label>
                <input
                    type="text"
                    value={formData.permanentAddress}
                    onChange={(e) => handleChange('father', 'permanentAddress', e.target.value)}
                />

                <label>Residential Address</label>
                <input
                    type="text"
                    value={formData.residentialAddress}
                    onChange={(e) => handleChange('father', 'residentialAddress', e.target.value)}
                />

                <label>Nationality</label>
                <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleChange('father', 'nationality', e.target.value)}
                />

                <label>Date of Birth</label>
                <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('father', 'dateOfBirth', e.target.value)}
                />

                <label>Contact Number</label>
                <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange('father', 'contactNumber', e.target.value)}
                />

                <label>Telephone Number</label>
                <input
                    type="tel"
                    value={formData.telephoneNumber}
                    onChange={(e) => handleChange('father', 'telephoneNumber', e.target.value)}
                />

                <label>Occupation</label>
                <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => handleChange('father', 'occupation', e.target.value)}
                />

                <label>Workplace Contact Number</label>
                <input
                    type="tel"
                    value={formData.workplaceContactNo}
                    onChange={(e) => handleChange('father', 'workplaceContactNo', e.target.value)}
                />

                <label>Workplace Address</label>
                <input
                    type="text"
                    value={formData.workplaceAddress}
                    onChange={(e) => handleChange('father', 'workplaceAddress', e.target.value)}
                />

                <label>Email Address</label>
                <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => handleChange('father', 'emailAddress', e.target.value)}
                />

                <label>Religion</label>
                <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleChange('father', 'religion', e.target.value)}
                />

                <label>Educational Qualification</label>
                <input
                    type="text"
                    value={formData.educationalQualification}
                    onChange={(e) => handleChange('father', 'educationalQualification', e.target.value)}
                />

                <button type="button" onClick={prevStep}>Previous</button>
                <button type="button" onClick={nextStep}>Next</button>
            </form>
        </div>
    );
};

export default FatherInfoForm;
