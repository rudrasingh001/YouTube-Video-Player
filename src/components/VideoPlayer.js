import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './VideoPlayer.css'; // Import the CSS file for custom player styling

const VideoPlayer = ({ videoId }) => {
  const [videoTitle, setVideoTitle] = useState('');
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyCB3qfR0ukofjJI2WiEWTLtVW6rA_kEwVQ`
        );
        const videoSnippet = response.data.items[0].snippet;
        setVideoTitle(videoSnippet.title);
      } catch (error) {
        setError('Error fetching video data');
        console.error('Error fetching video data:', error);
      }
    };

    fetchData();
  }, [videoId]);

  useEffect(() => {
    const initializePlayer = () => {
      player.current = new window.YT.Player(videoRef.current, {
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    };

    // Load the YouTube IFrame Player API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = initializePlayer;

    return () => {
      window.onYouTubeIframeAPIReady = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies here if initializePlayer doesn't change over time

  const onPlayerReady = (event) => {
    event.target.setVolume(isMuted ? 0 : 100);
    setDuration(player.current.getDuration());
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const onPlayerError = (event) => {
    setError('Error loading the video');
    console.error('Error loading the video:', event);
  };

  const togglePlay = () => {
    if (player.current) {
      if (isPlaying) {
        player.current.pauseVideo();
      } else {
        player.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (player.current) {
      if (isMuted) {
        player.current.unMute();
      } else {
        player.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="video-player">
      <h2>{videoTitle}</h2>
      <div className="video-controls">
        <button className="control-button" onClick={togglePlay}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="control-button" onClick={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      <div className="video-container">
        <div className="youtube-player" ref={videoRef}></div>
        <div className="time-container">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
