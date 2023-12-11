import React, { useState } from 'react';
import VideoPlayer from './components/VideoPlayer'; // Assuming your VideoPlayer component is in a separate file
import './App.css'; // Import the CSS file for custom styling

function App() {
  const [inputVideoId, setInputVideoId] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('');

  const handleInputChange = (event) => {
    setInputVideoId(event.target.value);
  };

  const handleSubmit = () => {
    setCurrentVideoId(inputVideoId);
    setInputVideoId(''); // Clear the input field after submission
  };

  return (
    <div className="app">
      <h1 className="app-title">Custom YouTube Video Player</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputVideoId}
          onChange={handleInputChange}
          placeholder="Paste YouTube Video ID here"
          className="input-field"
        />
        <button onClick={handleSubmit} className="submit-button">
          Display Video
        </button>
      </div>
      {currentVideoId && <VideoPlayer videoId={currentVideoId} />}
    </div>
  );
}

export default App;