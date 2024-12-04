import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentProgressChart = ({ marksData }) => {
  const subjects = ['Art & Crafts', 'Music', 'English', 'Environmental Studies'];

  const data = {
    labels: subjects,
    datasets: [
      {
        label: '1st Term',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: marksData?.firstTerm?.map((subject) => subject.marks),
      },
      {
        label: '2nd Term',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        data: marksData?.secondTerm?.map((subject) => subject.marks),
      },
      {
        label: '3rd Term',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: marksData?.thirdTerm?.map((subject) => subject.marks),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio control to manually manage size
    aspectRatio: 1.5, // Increase the chart's aspect ratio to make it larger
  };

  return (
    <div style={{ width: '800px', height: '500px', margin: '0 auto' }}> {/* Increased container size */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default StudentProgressChart;
