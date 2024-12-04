import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase'; // Ensure Firebase configuration is correct
import './LearningMaterials.css'; // Create a CSS file for styling if needed

const LearningMaterials = () => {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    const fetchLearningMaterials = async () => {
      try {
        const learningMaterialsRef = ref(storage, 'learningMaterials/');
        
        // List all items (PDF files) in the learningMaterials/ folder
        const res = await listAll(learningMaterialsRef);
        const files = await Promise.all(
          res.items.map(async (itemRef) => {
            const downloadURL = await getDownloadURL(itemRef);
            return {
              name: itemRef.name,
              url: downloadURL,
            };
          })
        );
        setPdfFiles(files);
      } catch (error) {
        console.error('Error fetching learning materials:', error);
      }
    };

    fetchLearningMaterials();
  }, []);

  return (
    <div className="learning-materials-container">
      <h2>Learning Materials</h2>
      <ul>
        {pdfFiles.length > 0 ? (
          pdfFiles.map((file, index) => (
            <li key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </li>
          ))
        ) : (
          <p>No learning materials available at the moment.</p>
        )}
      </ul>
    </div>
  );
};

export default LearningMaterials;