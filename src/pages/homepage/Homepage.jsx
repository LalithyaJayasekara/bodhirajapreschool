import React from 'react';

import { Link } from 'react-router-dom';

import './homepage.css'; // Import the updated CSS file

import Navbar from './components/navbar';


import EventsSlideshow from './components/EventsSlideshow/EventsSlideshow';

import Feedback from '../Feedback/Feedback';


import Logo from "../../Assets/Logo.png";

import ChildFriendly from '../../Assets/child-friendly-icon.png';
import Holistic from '../../Assets/Holistic.png';
import Confidence from '../../Assets/Confidence.png';
import Safety from '../../Assets/Safety.png';



function Homepage() {

    return (

        <div className="App">

            <Navbar />

            {/* <Sidebar /> */}



            <div className="hero-section">

                <h1>Bodhiraja<br />International<br />Preschool</h1>

                <div className="features">
                    <div className="feature">
                    <img src={Holistic} alt="Child Friendly Icon" /> 
                        <span>Holistic Learning</span>
                    </div>
                    <div className="feature">
                        <img src={ChildFriendly} alt="Child Friendly Icon" /> 
                        <span>Child-Friendly Environment</span>
                    </div>
                    <div className="feature">
                    <img src={Confidence} alt="Child Friendly Icon" /> 
                        <span>Confidence Building</span>
                    </div>
                    <div className="feature">
                    <img src={Safety} alt="Child Friendly Icon" />
                        <span>Safety & Security</span>
                    </div>
                    </div>


            </div>



            <section className="vision-mission">

                <div className="vision">

                    <h2>OUR VISION</h2>

                    <p>

                        To nurture a community of lifelong learners where each child is empowered to explore, create, and grow in a safe, inclusive, and inspiring environment. We envision a preschool that fosters curiosity, compassion, and confidence, laying the foundation for children to become thoughtful, empathetic, and innovative members of society.

                    </p>

                </div>

                <div className="mission">

                    <h2>OUR MISSION</h2>

                    <p>

                        Our mission is to provide a nurturing, stimulating, and safe environment where young children can develop their unique abilities through play-based learning, creativity, and exploration. We are committed to fostering a love of learning, promoting emotional and social development, and partnering with families to create a supportive community that celebrates diversity and inclusion.

                    </p>

                </div>

            </section>



            <section className="our-events">

                <h2>Our Events</h2>

                <EventsSlideshow />

            </section>



          



            <Feedback />
            {/* <CombinedForm /> */}


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
    </div>

    );

}



export default Homepage;