import React, { useState } from 'react';

const OtherInfoForm = ({ nextStep, prevStep, handleChange, formData }) => {
    const [siblings, setSiblings] = useState(formData.siblings || []);

    const addSibling = () => {
        setSiblings([...siblings, { name: '', year: '' }]);
    };

    const updateSibling = (index, field, value) => {
        const newSiblings = [...siblings];
        newSiblings[index][field] = value;
        setSiblings(newSiblings);
        handleChange('other', 'siblings', newSiblings);
    };

    return (
        <div>
            <h2>Other Information</h2>
            <form>
                <label>Are there other children in the family?</label>
                <select value={formData.hasSiblings} onChange={(e) => handleChange('other', 'hasSiblings', e.target.value)}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>

                {formData.hasSiblings &&
                    siblings.map((sibling, index) => (
                        <div key={index}>
                            <label>Sibling Name</label>
                            <input
                                type="text"
                                value={sibling.name}
                                onChange={(e) => updateSibling(index, 'name', e.target.value)}
                            />
                            <label>Year</label>
                            <input
                                type="text"
                                value={sibling.year}
                                onChange={(e) => updateSibling(index, 'year', e.target.value)}
                            />
                        </div>
                    ))}

                <button type="button" onClick={addSibling}>Add Sibling</button>

                <label>Did they study in Bodhiraja Pre School?</label>
                <select value={formData.studiedInBodhiraja} onChange={(e) => handleChange('other', 'studiedInBodhiraja', e.target.value)}>
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                </select>

                <label>How did you get to know about the preschool?</label>
                <input type="text" value={formData.reference} onChange={(e) => handleChange('other', 'reference', e.target.value)} />

                <button type="button" onClick={prevStep}>Previous</button>
                <button type="button" onClick={nextStep}>Next</button>
            </form>
        </div>
    );
};

export default OtherInfoForm;
