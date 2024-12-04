



import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Navbar from '../homepage/components/navbar';
import { Container, Typography, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import './OurSchool.css';
import event from '../../Assets/Image5.png';
import image2 from '../../Assets/Image2.jpg';
import Logo from "../../Assets/Logo.png";

const OurSchool = () => {
  const [staffData, setStaffData] = useState([]);
  const scrollContainerRef = useRef(null);

  // Fetch staff data from Firestore
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'staffs'));
        const staffArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffData(staffArray);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };
    fetchStaffData();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let scrollAmount = 0;

    const autoScroll = () => {
      if (scrollContainer) {
        scrollAmount += 1; // Increment the scroll amount (adjust speed here)
        scrollContainer.scrollLeft = scrollAmount;

        // Reset to the start when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
        }
      }

      // Schedule the next frame
      requestAnimationFrame(autoScroll);
    };

    // Start the auto-scrolling
    const animationFrame = requestAnimationFrame(autoScroll);

    // Cleanup when the component unmounts
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="our-school-container">
      <Navbar className="nav" />
      {/* Other sections here */}

      <section className="introduction" style={{ marginTop: '120px' }}>
  <Container maxWidth="lg">
    <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', fontSize: '36px', color: '#333' }}>
      HOW WE STARTED...
    </Typography>
    <Typography variant="h6" gutterBottom style={{ fontSize: '24px', color: '#555' }}>
      What is Bodhiraja Foundation?
    </Typography>
    <Typography variant="body1" paragraph style={{ fontSize: '18px', lineHeight: '1.6', color: '#666' }}>
      Bodhiraja Foundation is a non-profit organization committed to providing quality education and supporting community development.
      We believe that education is a powerful tool for transforming lives and creating opportunities for a brighter future.
    </Typography>
    <Typography variant="h6" gutterBottom style={{ fontSize: '24px', color: '#555' }}>
      How did the preschool start?
    </Typography>
    <Typography variant="body1" paragraph style={{ fontSize: '18px', lineHeight: '1.6', color: '#666' }}>
      In 2008, the preschool embarked on its mission to deliver high-quality early childhood education in a nurturing and stimulating environment. The journey started with a small group of passionate educators dedicated to fostering growth and curiosity in young minds.
    </Typography>
    <img src={event} alt="event" className="intro-image" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }} />
  </Container>
</section>

<section className="current-status">
  <Container maxWidth="lg">
    <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: 'bold', fontSize: '36px', color: '#333' }}>
      HOW IT'S GOING...
    </Typography>
    <Typography variant="body1" paragraph style={{ fontSize: '18px', lineHeight: '1.6', color: '#666' }}>
      Today, the preschool thrives as a vibrant hub of learning and development, nurturing the creativity, critical thinking, and problem-solving skills of young learners. With a dedicated team of educators, the preschool continues to evolve and meet the changing needs of the community.
    </Typography>
    <img src={image2} alt="image2" className="current-status-image" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }} />
  </Container>
</section>


      {/* Meet Our Staff Section */}
      <section>
      <Container maxWidth="lg">
      <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
          style={{
            fontWeight: 'bold',            // Makes the text bold
            fontSize: '36px',              // Larger font size for impact
            color: '#006400',              // Set the color to your theme color
            textTransform: 'uppercase',    // Uppercase letters for a strong impact
            letterSpacing: '2px',          // Adds spacing between letters for a modern look
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)', // Soft text shadow for emphasis
            marginBottom: '30px'           // Space below the heading
          }}
        >
          MEET OUR STAFF
        </Typography>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            overflowX: 'hidden', // Hide scrollbars
            gap: 2,
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
        >
          {staffData.map((staff) => (
            <Card
              key={staff.id}
              sx={{
                minWidth: 200,
                flex: '0 0 auto', // Keep cards inline
                borderRadius: '16px',
                boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <CardMedia
                component="img"
                image={staff.images[0]}
                alt={staff.staffName}
                sx={{
                  height: 120,
                  width: 120,
                  objectFit: 'cover',
                  borderRadius: '50%',
                  margin: '20px auto',
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {staff.staffName}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {staff.description}
                </Typography>
                <Button
                variant="contained"
                sx={{
                  backgroundColor: '#145e51', // Custom green
                  '&:hover': {
                    backgroundColor: '#45A049', // Slightly darker green on hover
                  },
                }}
              >
                Learn More
              </Button>

              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </section>

      {/* Footer Section */}
      <footer className="our-school-footer">
        <Container maxWidth="lg">
          <div className="footer-content">
            <img src={Logo} alt="School Logo" style={{ maxWidth: '200px', marginBottom: '20px' }} />
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
        </Container>
      </footer>
    </div>
  );
};

export default OurSchool;

