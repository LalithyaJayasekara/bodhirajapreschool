import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen.jsx'; // Import the loading screen component
import Homepage from './pages/homepage/Homepage';
import Login from './pages/Login/Login';
import Teacher from './pages/Login/Teacher';
import Location from './pages/Location/Location';
import OurSchool from './pages/OurSchool/OurSchool';
import Admissions from './pages/Admission/Admission';
import ForgotPw from './pages/ForgotPw/ForgotPw';
import Sidebar from './pages/homepage/components/Slidebar/Slidebar';
import EventsSlideshow from './pages/homepage/components/EventsSlideshow/EventsSlideshow';
import LearningResources from './pages/LearningResources/LearningResources';
import Tutorial from './pages/LearningResources/Tutorial/Tutorial';
import EmbeddedWebsite from './pages/LearningResources/EmbeddedWebsites/Embeddedwebsite';
import Student from './pages/Login/Student';
import Download from './pages/OurSchool/Download';
import DownloadButton from './pages/OurSchool/Download';
import ResetPw from './pages/ResetPw/Resetpw';
import Feedback from './pages/Feedback/Feedback';
import Home1 from './pages/AdmissionForm/Home1/Home1';
// import Home2 from './pages/AdmissionForm/Home2/Home2';
import Home3 from './pages/AdmissionForm/Home3/Home3';
import Home4 from './pages/AdmissionForm/Home4/Home4';
import MotherInformation from './pages/AdmissionForm/Home2/Components/mother/mother';
import ParentGuardianDetails from './pages/AdmissionForm/Home2/Components/father/father';
import GuardianForm from './pages/AdmissionForm/Home2/Components/guardian/guardian';
import CombinedForm from './pages/AdmissionForm/Last/Last';
import LearningMaterials from './pages/ProgressReport/LearningMaterials';
import Payments from './pages/ProgressReport/Payments';
import ProgressChart from './pages/ProgressReport/ProgressChart';

import ProgressReportPage from './pages/ProgressReport/ProgressReportPage';
import AdmitionformNew from './pages/AdmissionForm/AdmitionFormNew.jsx';

import AddGrage from './pages/NewParts/AddGrades.jsx';

function App() {
  const [isLoading, setIsLoading] = useState(true); // Manage loading state

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide the loading screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen /> // Display the loading screen
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/student" element={<Student />} />
            <Route path="/location" element={<Location />} />
            <Route path="/ourschool" element={<OurSchool />} />
            <Route path="/admission" element={<Admissions />} />
            <Route path="/forgotpw" element={<ForgotPw />} />
            {/* <Route path="/slidebar" element={<Sidebar />} /> */}
            <Route path="/event" element={<EventsSlideshow />} />
            <Route path="/learn" element={<LearningResources />} />
            <Route path="/vid" element={<Tutorial />} />
            <Route path="/story" element={<EmbeddedWebsite />} />
            <Route path="/download" element={<Download />} />
            <Route path="/downloadbutton" element={<DownloadButton />} />
            <Route path="/resetpw" element={<ResetPw />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/home1" element={<Home1 />} />
            {/* <Route path="/home2" element={<Home2 />} /> */}
            <Route path="/home3" element={<Home3 />} />
            <Route path="/home4" element={<Home4 />} />

            <Route path="/mother-info" element={<MotherInformation />} />
            <Route path="/parent-guardian-details" element={<ParentGuardianDetails />} />
            <Route path="/guardian" element={<GuardianForm />} />
            {/* <Route path="/last" element={<CombinedForm />} /> */}
            <Route path="/learning-materials" element={<LearningMaterials />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/progress-chart" element={<ProgressChart />} />
            {/* Add other routes as needed */}
            <Route path="/progress-report" element={<ProgressReportPage />} />
            <Route path="/admitionformNew" element={<AdmitionformNew />} />

            <Route path="/addGrage" element={<AddGrage />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
