// import React, { useState } from 'react';
// import './Slidebar.css';
// import { Link } from 'react-router-dom';
// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);

//   function toggleSidebar() {
//     setIsOpen(!isOpen);
//   }

//   return (
//     <div className="sidebar-container">
//       <div className={`sidebar ${isOpen ? 'open' : ''}`}>
//         <button className="close-btn" onClick={toggleSidebar}>×</button>
//         <h2>Sidebar</h2>
//         <ul>
//         <Link to="/"><li><a href="#home">Home</a></li></Link>
//         <Link to="/ourschool"><li><a href="#Our School">Our School</a></li></Link>
//         <Link to="/admission"><li><a href="#Admission">Admission</a></li></Link>
//         <Link to="/learn"><li><a href="#Learning Resourses">Learning Resourses</a></li></Link>
//         <Link to="/location"><li><a href="#contact"> Contact </a></li></Link>
//         </ul>
//       </div>
//       <div className="content">
//         <button className="open-btn" onClick={toggleSidebar}>☰</button>
        
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
