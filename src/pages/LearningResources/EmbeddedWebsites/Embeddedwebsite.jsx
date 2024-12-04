import React from 'react';
import { Link } from 'react-router-dom';
import '../EmbeddedWebsites.css';

function EmbeddedWebsite() {
    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <iframe
                src="https://www.storyberries.com/"
                style={{
                    height: '100%',
                    width: '100%',
                    border: 'none',
                }}
                title="Embedded Website" />





        </div>


    );
}

export default EmbeddedWebsite;
