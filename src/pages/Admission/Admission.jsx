import React from 'react';
import './Admission.css';
import Abc from '../../Assets/Image2.jpg';
import Def from '../../Assets/Image6.jpg';
import Lsg from '../../Assets/Logo.png';
import Navbar from '../homepage/components/navbar';
import { Link } from 'react-router-dom';
import Logo from "../../Assets/Logo.png";

function Admissions() {
  return (
    <div className="admissions-page">
      <Navbar />

      <section className="banner">
        <h2 className="banner-title">JOIN WITH US...</h2>
        <p className="banner-text">
          At Bodhiraja International Preschool, we believe in nurturing young minds through play, creativity, and exploration. Our dedicated team of passionate educators is committed to providing a safe and supportive environment where children can grow, learn, and thrive. We invite you to join our vibrant community, where your child will embark on an exciting educational journey filled with discovery, friendship, and fun. Whether you’re a parent looking for the perfect place for your little one or an educator eager to make a difference, we welcome you to be part of our family. Together, let's inspire the future!
        </p>
      </section>

      <section className="kindergarten-sections">
        <div className="kindergarten pre-kindergarten">
          <div className="kindergarten-text">
            <h3>Pre Kindergarten</h3>
            <span>(3-4 years)</span>
          </div>
          <img src={Abc} alt="Abc" className="kindergarten-image" />
          <p className="kindergarten-description">
            Lower Kindergarten (LKG) at our preschool is designed to engage and educate children at this formative age, nurturing their natural curiosity. Our experienced teachers create a stimulating environment where children can explore, discover, and care for their world. Through a range of hands-on activities, children develop essential skills in literacy, numeracy, and social interaction, all while having fun. LKG is a unique foundation that prepares your child for the exciting educational journey ahead.
          </p>
        </div>

        <div className="kindergarten upper-kindergarten">
          <div className="kindergarten-text">
            <h3>Upper Kindergarten</h3>
            <span>(4-5 years)</span>
          </div>
          <img src={Def} alt="Def" className="kindergarten-image" />
          <p className="kindergarten-description">
            Places will be offered on receipt of the application form and, once accepted, in the order they are received. There is a minimum of informal assessment and an initial entry requirement of 4 years old. Once your child's status has been confirmed, we offer a settling-in session prior to your child's arrival.
          </p>
        </div>
      </section>

      <div className="join-now-button-container">
        <Link to="/admitionformNew"> {/* Updated Link */}
          <button className="join-now-button">Join Now</button>
        </Link>
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
    </div>
  );
}

export default Admissions;
