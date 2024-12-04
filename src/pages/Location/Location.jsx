import React from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported for navigation
import "./Location.css";
import Navbar from '../homepage/components/navbar';
import Logo from "../../Assets/Logo.png";

function Location() {
  return (
    <div className="App">
      <Navbar />
      <section className="locate-us">
        <h1>Locate Us</h1>
        <div className="location-container">
          <div className="location-info">
            <h2>Embilipitiya, Sabaragamuwa Province, Sri Lanka</h2>
            {/* <button className="direction-button">Directions</button> */}
            {/* <button className="nearby-button">Nearby</button> */}
            <p>Embilipitiya is a town, governed by an urban council, in Ratnapura District, Sabaragamuwa Province, Sri Lanka.</p>
            <p><strong>Population:</strong> 58,315 (2012 census)</p>
            <p><strong>Country:</strong> Sri Lanka</p>
            <p><strong>Province:</strong> Sabaragamuwa Province</p>
            <p><strong>District:</strong> Ratnapura District</p>
            <p><strong>Local Government:</strong> Embilipitiya Urban Council</p>
            <p><strong>Time zone:</strong> +5:30</p>
            <h3>Nearby</h3>
           
          </div>
          <div className="map-section">
            <div className='gmap-frame'>
              <iframe 
                id='gmap_canvas' 
                width="520" 
                height="400" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=Higura%20ara%20,%20Embilipitiya%20Embilipitiya,%20Sri%20Lanka+(Bodhiraja%20International%20Preschool)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              >
                <a href="https://www.gps.ie/">gps devices</a>
              </iframe>
            </div>  
          </div>
        </div>
      </section>

      <footer className="our-school-footer">
        <div className="footer-content">
        <img src={Logo} alt="School Logo" />
          <div className="footer-links">
            <nav>
              <Link to="/">Home</Link> | 
              <Link to="/login">Login</Link> | 
              <Link to="/location">Location</Link> | 
              <Link to="/ourschool">Our School</Link>
            </nav>
          </div>
          <address>Higura ara, Embilipitiya, Sri Lanka</address>
        </div>
      </footer>
    </div> // Closing the main div here
  );
}

export default Location;
