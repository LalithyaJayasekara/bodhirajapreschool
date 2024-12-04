import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressChart from './ProgressChart';
import html2canvas from 'html2canvas'; // For capturing the chart as an image
import './ProgressReportPage.css';

const ProgressReportPageSuprise = () => {
  const location = useLocation(); // Get the data passed from Dashboard
  const { marksData, studentDetails } = location.state || {};
  const navigate = useNavigate();

  // Function to download the chart as an image
  const downloadChartSuprise = () => {
    const chartElement = document.getElementById('progress-chart-suprise');
    html2canvas(chartElement).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${studentDetails.name}_Progress_Report.png`;
      link.click();
    });
  };

  return (
    <div className="progress-report-page-suprise">
      <h2>{studentDetails.firstName} Progress Report</h2>
      <div id="progress-chart-suprise">
        <ProgressChart marksData={marksData} />
      </div>
      <button onClick={downloadChartSuprise}>Download Progress Chart</button>
      
    </div>
  );
};

export default ProgressReportPageSuprise;