import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './../components/navbar.css';
import Logo from '../../../Assets/Logo.png';

function Navbar() {
  const location = useLocation();

  // Helper function to apply active class
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <div className="nav">
      <div className="nav-container">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className='new-nav-fixer'>
            <ul className="nav-links">
              <li className={isActive('/')}>
                <Link to="/">Home</Link>
              </li>
              <li className={isActive('/ourschool')}>
                <Link to="/ourschool">Our School</Link>
              </li>
              <li className={isActive('/admission')}>
                <Link to="/admission">Admission</Link>
              </li>
              <li className={isActive('/learn')}>
                <Link to="/learn">Learning Resources</Link>
              </li>
              
            </ul> 
        
          <a href='/login' className="log-button">Login</a>
              
        </div>
      </div>
    </div>
  );
}

export default Navbar;
