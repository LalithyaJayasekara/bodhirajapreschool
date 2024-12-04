import React from 'react';
import './Download.css'; // Import the CSS file

const DownloadButton = () => {
  const documentUrl = 'https://www.researchgate.net/publication/367232285_Technology_education_in_early_childhood_education_systematic_review/link/65c206631bed776ae33309cd/download?_tp=eyJjb250ZXh0Ijp7InBhZ2UiOiJwdWJsaWNhdGlvbiIsInByZXZpb3VzUGFnZSI6bnVsbH19'; // Replace with your document URL

  return (
    <div className="download-button-container">
      <a href={documentUrl} download="document.pdf" className="download-button">
        Download Document
      </a>
    </div>
  );
};

export default DownloadButton;
