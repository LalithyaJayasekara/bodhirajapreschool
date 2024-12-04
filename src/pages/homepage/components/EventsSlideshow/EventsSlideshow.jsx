import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { db } from '../../../../firebase/firebase'; // Named import from firebase
import './EventsSlideshow.css';

const Events = () => {
  const [events, setEvents] = useState([]); // State to store events data
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch events from Firestore when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsList = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firestore document ID
          ...doc.data(), // Spread the rest of the event data (eventId, eventName, eventDescription, imageUrl)
        }));
        setEvents(eventsList); // Store fetched data in state
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching events data: ", error);
      }
    };

    fetchEvents();
  }, []);

  const toggleDescription = (eventId) => {
    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    } else {
      setSelectedEventId(eventId);
    }
  };

  if (loading) {
    return <div>Loading events...</div>; // Loading indicator
  }

  return (
    <div className="events-container">
      <div className="events-content">
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-square" key={event.eventId}>
                {/* Use imageUrl for displaying event images */}
                {event.mainImageUrl ? (
                  <img src={event.mainImageUrl} alt={event.eventName} className="event-image" />
                ) : (
                  <div className="no-image-placeholder">
                    <span>No Image Available</span>
                  </div>
                )}
                <h3 className="event-name">{event.eventName}</h3>
                
                {/* Toggle description button */}
                <div className="button-container">
                  <button
                    className="see-more-button"
                    onClick={() => toggleDescription(event.eventId)}
                  >
                    {selectedEventId === event.eventId ? 'See Less' : 'See More'}
                  </button>
                </div>
              </div>

          ))}
        </div>

        {selectedEventId && (
          <div className="event-description-box">
            <h3>{events.find(event => event.eventId === selectedEventId).eventName}</h3>
            <p>{events.find(event => event.eventId === selectedEventId).eventDescription}</p>

            <div className="event-gallery">
              {/* Display the event's image from imageUrl */}
              {events.find(event => event.eventId === selectedEventId).imageUrl && (
                <img
                  src={events.find(event => event.eventId === selectedEventId).imageUrl}
                  alt={`${events.find(event => event.eventId === selectedEventId).eventName} image`}
                  className="gallery-image"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
