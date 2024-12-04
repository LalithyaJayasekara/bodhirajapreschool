import React from 'react';
import { Link } from 'react-router-dom'; // Ensure 'Link' is imported properly
import EmbeddedWebsites from './EmbeddedWebsites/Embeddedwebsite';
import Tutorial from './Tutorial/Tutorial';
import './LearningResources.css';
import Logo from "../../Assets/Logo.png";

function LearningResources() {
    return (
        <>
            <div className="LearningResources-container">
                <Tutorial />
                <EmbeddedWebsites />
            </div>

            <footer className="our-school-footer">
                <div className="footer-content">
                    <img src={Logo} alt="School Logo" />
                    <div className="footer-links">
                        <nav>
                            <Link to="/">Home</Link> | 
                            <Link to="/login">Login</Link> | 
                            <Link to="/location">Location</Link> | 
                            <Link to="/ourschool">OurSchool</Link>
                        </nav>
                    </div>
                    <address>Higura ara, Embilipitiya, Sri Lanka</address>
                </div>
            </footer>
        </>
    );
}

export default LearningResources;
