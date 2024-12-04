import React from 'react';
import './HeaderT.css';
import Navbar from '../../homepage/components/navbar';
import { Link } from 'react-router-dom';

export default function New(){ 

  return (
 <div>
    <Navbar/>
    <header className="main-header">
      {/* <h1> Learning Resources</h1> */}
      <nav>
        <ul>
        <Link to="/vid">
        <li>
          Youtube Resources
        </li>
        </Link>

          <Link to="/story">
          <li>Story Time</li>
          </Link>

        </ul>
      </nav>
      
 

  
    </header>
    </div>
  );

}


