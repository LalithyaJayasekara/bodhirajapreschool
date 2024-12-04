import React, { useState, useEffect } from 'react';
import './Tutorial.css';
import HeaderT from '../Header/HeaderT';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../../firebase/firebase'; // Import Firebase configuration

function Tutorial() {
  const [videos, setVideos] = useState({
    nurseryRhymes: [],
    shortStories: [],
    basicManners: [],
    basicMaths: []
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetching data from the Firestore collections
        const nurseryRhymesCollection = await getDocs(collection(db, 'Nursery Rhymes'));
        const nurseryRhymesData = nurseryRhymesCollection.docs.map(doc => doc.data());

        const shortStoriesCollection = await getDocs(collection(db, 'Short Stories'));
        const shortStoriesData = shortStoriesCollection.docs.map(doc => doc.data());

        const basicMannersCollection = await getDocs(collection(db, 'Basic Manners'));
        const basicMannersData = basicMannersCollection.docs.map(doc => doc.data());

        const basicMathsCollection = await getDocs(collection(db, 'Basic Math Concepts'));
        const basicMathsData = basicMathsCollection.docs.map(doc => doc.data());

        setVideos({
          nurseryRhymes: nurseryRhymesData,
          shortStories: shortStoriesData,
          basicManners: basicMannersData,
          basicMaths: basicMathsData
        });
      } catch (error) {
        console.error("Error fetching video data: ", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="tutorial-page"> {/* Added class "tutorial-page" */}
      <HeaderT />
      <div className="learning-resources-container">
        <h2>Learning Resources</h2>

        <h3>Pre Kindergarten (Age 3-4)</h3>

        <div className="section">
          <h4>Nursery Rhymes</h4>
          <div className="video-scroller">
            {videos.nurseryRhymes.map((video, index) => (
              <iframe
                key={index}
                src={video.link}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))}
          </div>
          <p>Classic nursery rhymes and children's songs with animations that help with language development and rhythm.</p>
        </div>

        <div className="section">
          <h4>Short Stories</h4>
          <div className="video-scroller">
            {videos.shortStories.map((video, index) => (
              <iframe
                key={index}
                src={video.link}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))}
          </div>
          <p>Animated stories and fairy tales that boost imagination and listening skills for young children.</p>
        </div>

        <h3>Upper Kindergarten (Age 5-6)</h3>

        <div className="section">
          <h4>Basic Manners</h4>
          <div className="video-scroller">
            {videos.basicManners.map((video, index) => (
              <iframe
                key={index}
                src={video.link}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))}
          </div>
          <p>Videos that teach respect, empathy, and good manners through interactive stories and scenarios.</p>
        </div>

        <div className="section">
          <h4>Basic Maths concepts</h4>
          <div className="video-scroller">
            {videos.basicMaths.map((video, index) => (
              <iframe
                key={index}
                src={video.link}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            ))}
          </div>
          <p>Stories that provide life lessons and promote critical thinking, problem-solving, and teamwork for upper kindergarten students.</p>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
