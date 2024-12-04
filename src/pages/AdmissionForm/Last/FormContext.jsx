import React, { useState } from 'react';
import './Last.css';

const CombinedForm = () => {
    const [formData, setFormData] = useState({
        child: {
            fullName: '',
            nameWithInitials: '',
            birthDate: '',
            age: '',
            gender: '',
            homeAddress: '',
            city: '',
            telephone: '',
            distanceToPreschool: '',
            image: ''
        },
        father: {
            fullName: '',
            permanentAddress: '',
            currentResidentialAddress: '',
            nationality: '',
            dateOfBirth: '',
            age: '',
            religion: '',
            schoolAttended: '',
            occupation: '',
            workplaceContactNo: '',
            workplaceAddress: '',
            contactNo: '',
            telephoneNo: '',
            emailAddress: '',
            education: {
                ol: false,
                al: false,
                higherDiploma: false,
                undergraduateDegree: false,
                mscPhd: false,
            }
        },
        mother: {
            fullName: '',
            permanentAddress: '',
            currentResidentialAddress: '',
            nationality: '',
            dateOfBirth: '',
            age: '',
            religion: '',
            schoolAttended: '',
            occupation: '',
            workplaceContactNo: '',
            workplaceAddress: '',
            contactNo: '',
            telephoneNo: '',
            emailAddress: '',
            education: {
                ol: false,
                al: false,
                higherDiploma: false,
                undergraduateDegree: false,
                mscPhd: false,
            }
        },
        guardian: {
            fullName: '',
            relationshipWithChild: '',
            permanentAddress: '',
            currentResidentialAddress: '',
            contactNo: '',
            telephoneNo: '',
            dateOfBirth: '',
            age: '',
            religion: '',
            schoolAttended: '',
            occupation: '',
            workplaceContactNo: '',
            workplaceAddress: '',
            education: {
                ol: false,
                al: false,
                higherDiploma: false,
                undergraduateDegree: false,
                mscPhd: false,
            }
        },
        otherInfo: {
            childrenInFamily: '',
            childName: '',
            studyInBodhiraja: '',
            studyYear: '',
            howKnowPreschool: ''
        }
    });

    const handleChange = (e, section, parent = null) => {
        const { name, value, type, checked } = e.target;
        if (parent) {
            if (type === 'checkbox') {
                setFormData({
                    ...formData,
                    [parent]: {
                        ...formData[parent],
                        education: {
                            ...formData[parent].education,
                            [name]: checked
                        }
                    }
                });
            } else {
                setFormData({
                    ...formData,
                    [parent]: {
                        ...formData[parent],
                        [name]: value
                    }
                });
            }
        } else {
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    [name]: value
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h2>Admission Form</h2>

            {/* Child's Information */}
            <h3>CHILD'S INFORMATION</h3>
            <div className="form-section">
                <div className="form-group">
                    <label>Full Name of the child *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.child.fullName}
                        placeholder="Full Name (without initials)"
                        onChange={(e) => handleChange(e, 'child')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Full Name of the child (with initials) *</label>
                    <input
                        type="text"
                        name="nameWithInitials"
                        value={formData.child.nameWithInitials}
                        placeholder="Name with initials"
                        onChange={(e) => handleChange(e, 'child')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.child.birthDate}
                        onChange={(e) => handleChange(e, 'child')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.child.age}
                        onChange={(e) => handleChange(e, 'child')}
                        placeholder="Age"
                    />
                </div>
                <div className="form-group">
                    <label>Gender</label>
                    <select
                        name="gender"
                        value={formData.child.gender}
                        onChange={(e) => handleChange(e, 'child')}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Home Address</label>
                    <input
                        type="text"
                        name="homeAddress"
                        value={formData.child.homeAddress}
                        placeholder="Enter home address"
                        onChange={(e) => handleChange(e, 'child')}
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.child.city}
                        placeholder="Enter city"
                        onChange={(e) => handleChange(e, 'child')}
                    />
                </div>
                <div className="form-group">
                    <label>Telephone No</label>
                    <input
                        type="text"
                        name="telephone"
                        value={formData.child.telephone}
                        placeholder="Enter phone number"
                        onChange={(e) => handleChange(e, 'child')}
                    />
                </div>
                <div className="form-group">
                    <label>Distance to Preschool</label>
                    <input
                        type="text"
                        name="distanceToPreschool"
                        value={formData.child.distanceToPreschool}
                        placeholder="Enter distance"
                        onChange={(e) => handleChange(e, 'child')}
                    />
                </div>
                <div className="form-group">
                    <label>Image Upload</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 'child')}
                    />
                </div>
            </div>

            {/* Parent or Guardian Details */}
            <h3>PARENT OR GUARDIAN DETAILS</h3>

            {/* Father's Information */}
            <h4>FATHER'S INFORMATION</h4>
            <div className="form-section">
                <div className="form-group">
                    <label>Full Name of child's father *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.father.fullName}
                        placeholder="Full Name (without initials)"
                        onChange={(e) => handleChange(e, 'father')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Permanent Address</label>
                    <input
                        type="text"
                        name="permanentAddress"
                        value={formData.father.permanentAddress}
                        placeholder="Permanent Address"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Current Residential Address *</label>
                    <input
                        type="text"
                        name="currentResidentialAddress"
                        value={formData.father.currentResidentialAddress}
                        placeholder="Current Residential Address"
                        onChange={(e) => handleChange(e, 'father')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nationality</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.father.nationality}
                        placeholder="Nationality"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.father.dateOfBirth}
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.father.age}
                        onChange={(e) => handleChange(e, 'father')}
                        placeholder="Age"
                    />
                </div>
                <div className="form-group">
                    <label>Religion</label>
                    <input
                        type="text"
                        name="religion"
                        value={formData.father.religion}
                        placeholder="Religion"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>School Attended</label>
                    <input
                        type="text"
                        name="schoolAttended"
                        value={formData.father.schoolAttended}
                        placeholder="Enter the school name"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Occupation</label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.father.occupation}
                        placeholder="Occupation"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Contact No</label>
                    <input
                        type="text"
                        name="workplaceContactNo"
                        value={formData.father.workplaceContactNo}
                        placeholder="Workplace Contact Number"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Address</label>
                    <input
                        type="text"
                        name="workplaceAddress"
                        value={formData.father.workplaceAddress}
                        placeholder="Workplace Address"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Contact No</label>
                    <input
                        type="text"
                        name="contactNo"
                        value={formData.father.contactNo}
                        placeholder="Contact Number"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Telephone Number (Home)</label>
                    <input
                        type="text"
                        name="telephoneNo"
                        value={formData.father.telephoneNo}
                        placeholder="Landphone Number"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={formData.father.emailAddress}
                        placeholder="Email Address"
                        onChange={(e) => handleChange(e, 'father')}
                    />
                </div>
                <div className="form-group">
                    <label>Educational Qualification</label>
                    <div className="checkbox-group">
                        <label><input type="checkbox" name="ol" checked={formData.father.education.ol} onChange={(e) => handleChange(e, 'father')} /> O/L</label>
                        <label><input type="checkbox" name="al" checked={formData.father.education.al} onChange={(e) => handleChange(e, 'father')} /> A/L</label>
                        <label><input type="checkbox" name="higherDiploma" checked={formData.father.education.higherDiploma} onChange={(e) => handleChange(e, 'father')} /> Higher Diploma/Diploma</label>
                        <label><input type="checkbox" name="undergraduateDegree" checked={formData.father.education.undergraduateDegree} onChange={(e) => handleChange(e, 'father')} /> Undergraduate Degree</label>
                        <label><input type="checkbox" name="mscPhd" checked={formData.father.education.mscPhd} onChange={(e) => handleChange(e, 'father')} /> MSc/PhD</label>
                    </div>
                </div>
            </div>

            {/* Mother's Information */}
            <h4>MOTHER'S INFORMATION</h4>
            <div className="form-section">
                <div className="form-group">
                    <label>Full Name of child's mother *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.mother.fullName}
                        placeholder="Full Name (without initials)"
                        onChange={(e) => handleChange(e, 'mother')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Permanent Address</label>
                    <input
                        type="text"
                        name="permanentAddress"
                        value={formData.mother.permanentAddress}
                        placeholder="Permanent Address"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Current Residential Address *</label>
                    <input
                        type="text"
                        name="currentResidentialAddress"
                        value={formData.mother.currentResidentialAddress}
                        placeholder="Current Residential Address"
                        onChange={(e) => handleChange(e, 'mother')}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Nationality</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.mother.nationality}
                        placeholder="Nationality"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.mother.dateOfBirth}
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.mother.age}
                        onChange={(e) => handleChange(e, 'mother')}
                        placeholder="Age"
                    />
                </div>
                <div className="form-group">
                    <label>Religion</label>
                    <input
                        type="text"
                        name="religion"
                        value={formData.mother.religion}
                        placeholder="Religion"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>School Attended</label>
                    <input
                        type="text"
                        name="schoolAttended"
                        value={formData.mother.schoolAttended}
                        placeholder="Enter the school name"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Occupation</label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.mother.occupation}
                        placeholder="Occupation"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Contact No</label>
                    <input
                        type="text"
                        name="workplaceContactNo"
                        value={formData.mother.workplaceContactNo}
                        placeholder="Workplace Contact Number"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Address</label>
                    <input
                        type="text"
                        name="workplaceAddress"
                        value={formData.mother.workplaceAddress}
                        placeholder="Workplace Address"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Contact No</label>
                    <input
                        type="text"
                        name="contactNo"
                        value={formData.mother.contactNo}
                        placeholder="Contact Number"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Telephone Number (Home)</label>
                    <input
                        type="text"
                        name="telephoneNo"
                        value={formData.mother.telephoneNo}
                        placeholder="Landphone Number"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={formData.mother.emailAddress}
                        placeholder="Email Address"
                        onChange={(e) => handleChange(e, 'mother')}
                    />
                </div>
                <div className="form-group">
                    <label>Educational Qualification</label>
                    <div className="checkbox-group">
                        <label><input type="checkbox" name="ol" checked={formData.mother.education.ol} onChange={(e) => handleChange(e, 'mother')} /> O/L</label>
                        <label><input type="checkbox" name="al" checked={formData.mother.education.al} onChange={(e) => handleChange(e, 'mother')} /> A/L</label>
                        <label><input type="checkbox" name="higherDiploma" checked={formData.mother.education.higherDiploma} onChange={(e) => handleChange(e, 'mother')} /> Higher Diploma/Diploma</label>
                        <label><input type="checkbox" name="undergraduateDegree" checked={formData.mother.education.undergraduateDegree} onChange={(e) => handleChange(e, 'mother')} /> Undergraduate Degree</label>
                        <label><input type="checkbox" name="mscPhd" checked={formData.mother.education.mscPhd} onChange={(e) => handleChange(e, 'mother')} /> MSc/PhD</label>
                    </div>
                </div>
            </div>

            {/* Guardian's Information */}
            <h4>GUARDIAN'S INFORMATION (if applicable)</h4>
            <div className="form-section">
                <div className="form-group">
                    <label>Full Name of Guardian</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.guardian.fullName}
                        placeholder="Full Name"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Relationship with Child</label>
                    <input
                        type="text"
                        name="relationshipWithChild"
                        value={formData.guardian.relationshipWithChild}
                        placeholder="Relationship"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Permanent Address</label>
                    <input
                        type="text"
                        name="permanentAddress"
                        value={formData.guardian.permanentAddress}
                        placeholder="Permanent Address"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Current Residential Address</label>
                    <input
                        type="text"
                        name="currentResidentialAddress"
                        value={formData.guardian.currentResidentialAddress}
                        placeholder="Current Residential Address"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Contact No</label>
                    <input
                        type="text"
                        name="contactNo"
                        value={formData.guardian.contactNo}
                        placeholder="Contact Number"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Telephone Number (Home)</label>
                    <input
                        type="text"
                        name="telephoneNo"
                        value={formData.guardian.telephoneNo}
                        placeholder="Landphone Number"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.guardian.dateOfBirth}
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.guardian.age}
                        onChange={(e) => handleChange(e, 'guardian')}
                        placeholder="Age"
                    />
                </div>
                <div className="form-group">
                    <label>Religion</label>
                    <input
                        type="text"
                        name="religion"
                        value={formData.guardian.religion}
                        placeholder="Religion"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>School Attended</label>
                    <input
                        type="text"
                        name="schoolAttended"
                        value={formData.guardian.schoolAttended}
                        placeholder="Enter the school name"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Occupation</label>
                    <input
                        type="text"
                        name="occupation"
                        value={formData.guardian.occupation}
                        placeholder="Occupation"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Contact No</label>
                    <input
                        type="text"
                        name="workplaceContactNo"
                        value={formData.guardian.workplaceContactNo}
                        placeholder="Workplace Contact Number"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Workplace Address</label>
                    <input
                        type="text"
                        name="workplaceAddress"
                        value={formData.guardian.workplaceAddress}
                        placeholder="Workplace Address"
                        onChange={(e) => handleChange(e, 'guardian')}
                    />
                </div>
                <div className="form-group">
                    <label>Educational Qualification</label>
                    <div className="checkbox-group">
                        <label><input type="checkbox" name="ol" checked={formData.guardian.education.ol} onChange={(e) => handleChange(e, 'guardian')} /> O/L</label>
                        <label><input type="checkbox" name="al" checked={formData.guardian.education.al} onChange={(e) => handleChange(e, 'guardian')} /> A/L</label>
                        <label><input type="checkbox" name="higherDiploma" checked={formData.guardian.education.higherDiploma} onChange={(e) => handleChange(e, 'guardian')} /> Higher Diploma/Diploma</label>
                        <label><input type="checkbox" name="undergraduateDegree" checked={formData.guardian.education.undergraduateDegree} onChange={(e) => handleChange(e, 'guardian')} /> Undergraduate Degree</label>
                        <label><input type="checkbox" name="mscPhd" checked={formData.guardian.education.mscPhd} onChange={(e) => handleChange(e, 'guardian')} /> MSc/PhD</label>
                    </div>
                </div>
            </div>

            {/* Other Information */}
            <h3>OTHER INFORMATION</h3>
            <div className="form-section">
                <div className="form-group">
                    <label>Children in Family</label>
                    <input
                        type="number"
                        name="childrenInFamily"
                        value={formData.otherInfo.childrenInFamily}
                        placeholder="Number of children"
                        onChange={(e) => handleChange(e, 'otherInfo')}
                    />
                </div>
                <div className="form-group">
                    <label>Child Name</label>
                    <input
                        type="text"
                        name="childName"
                        value={formData.otherInfo.childName}
                        placeholder="Enter child's name"
                        onChange={(e) => handleChange(e, 'otherInfo')}
                    />
                </div>
                <div className="form-group">
                    <label>Does the child study in Bodhiraja? (Yes/No)</label>
                    <input
                        type="text"
                        name="studyInBodhiraja"
                        value={formData.otherInfo.studyInBodhiraja}
                        placeholder="Yes or No"
                        onChange={(e) => handleChange(e, 'otherInfo')}
                    />
                </div>
                <div className="form-group">
                    <label>If yes, which year?</label>
                    <input
                        type="text"
                        name="studyYear"
                        value={formData.otherInfo.studyYear}
                        placeholder="Enter study year"
                        onChange={(e) => handleChange(e, 'otherInfo')}
                    />
                </div>
                <div className="form-group">
                    <label>How did you know about the preschool?</label>
                    <input
                        type="text"
                        name="howKnowPreschool"
                        value={formData.otherInfo.howKnowPreschool}
                        placeholder="Enter details"
                        onChange={(e) => handleChange(e, 'otherInfo')}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default CombinedForm;