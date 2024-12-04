import React, { useState } from 'react';

const TermsAndConditionsForm = ({ prevStep, handleSubmit, formData }) => {
    const [agreed, setAgreed] = useState(false);

    const handleAgreementChange = (e) => {
        setAgreed(e.target.value === 'true');
    };

    return (
        <div>
            <h2>Terms and Conditions</h2>
            <form>
                <p>
                    By submitting this form, I hereby agree to all terms and conditions of the Bodhiraja Pre School. I confirm that the information provided is accurate and complete.
                </p>
                <label>Do you agree to the terms and conditions?</label>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="true"
                            checked={agreed === true}
                            onChange={handleAgreementChange}
                        />
                        Yes
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="false"
                            checked={agreed === false}
                            onChange={handleAgreementChange}
                        />
                        No
                    </label>
                </div>

                <button type="button" onClick={prevStep}>
                    Previous
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit(agreed)}
                    disabled={!agreed}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TermsAndConditionsForm;
