import React, { useState, useRef, useEffect } from "react";
import RubaImage from "../assets/Ruba.jpg"; // Adjust the path according to your folder structure
import LogoImage from "../assets/icons/Goalden_LogoSB.png"; // Import the logo image
import { Link } from "react-router-dom";
import YouTube from 'react-youtube'; // Import YouTube player
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome styles

interface SideBarProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SideBar: React.FC<SideBarProps> = ({ setActiveTab }) => {
  const fixedWidth = 250; // Set your desired fixed width here

  const [playlistId, setPlaylistId] = useState<string>(() => localStorage.getItem('playlistId') || ""); // Load from localStorage
  const [currentSongTitle, setCurrentSongTitle] = useState<string>(""); // State to store the current song's title
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to check if the player is playing
  const playerRef = useRef<any>(null); // Reference to control the YouTube player

  // Save playlistId to localStorage whenever it changes
  useEffect(() => {
    if (playlistId) {
      localStorage.setItem('playlistId', playlistId);
    }
  }, [playlistId]);

  // Save playing state in localStorage
  useEffect(() => {
    localStorage.setItem('isPlaying', JSON.stringify(isPlaying));
  }, [isPlaying]);

  // Retrieve the playing state from localStorage and play the video if needed
  useEffect(() => {
    const savedIsPlaying = JSON.parse(localStorage.getItem('isPlaying') || "false");
    if (savedIsPlaying && playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  // YouTube player options for audio-only mode
  const opts = {
    height: '0', // Hide the video
    width: '0',  // Hide the video
    playerVars: {
      autoplay: 1, // Autoplay is on when loaded
      listType: 'playlist',
      list: playlistId, // Use the dynamic playlist ID
      mute: 1, // Mute the player to allow autoplay (many browsers block autoplay if not muted)
      loop: 1, // Loop the playlist
      enablejsapi: 1, // Enable JS API for player control
    },
  };

  // Function to handle player ready state
  const onPlayerReady = (event: any) => {
    playerRef.current = event.target; // Store the player instance in the ref
    const savedIsPlaying = JSON.parse(localStorage.getItem('isPlaying') || "false");

    if (savedIsPlaying) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  // Function to toggle play/pause
  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying); // Toggle playing state
    }
  };

  // Function to go to the previous song
  const handlePrevious = () => {
    if (playerRef.current) {
      playerRef.current.previousVideo();
    }
  };

  // Function to go to the next song
  const handleNext = () => {
    if (playerRef.current) {
      playerRef.current.nextVideo();
    }
  };

  // Function to update the song title when a new song starts playing
  const onPlayerStateChange = (event: any) => {
    if (window.YT) {
      if (event.data === window.YT.PlayerState.PLAYING && playerRef.current) {
        const videoData = playerRef.current.getVideoData();
        setCurrentSongTitle(videoData.title);
        setIsPlaying(true);
      }
      if (event.data === window.YT.PlayerState.PAUSED) {
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className="flex h-full bg-[#1e1e1e] text-white flex-col items-center py-8"
      style={{ width: `${fixedWidth}px` }}
    >
      {/* Logo Image */}
      <div className="relative w-full flex justify-center mb-3">
        <img
          src={LogoImage}
          alt="Logo"
          className="absolute top-[15px] w-48" // Adjust top and width to position like a rainbow
          style={{ zIndex: 1 }}
        />
      </div>

      {/* Profile Picture and Greeting */}
      <img
        src={RubaImage}
        alt="Profile"
        className="rounded-full w-20 h-20 mb-3 mt-16" // Adjust the margin to create space for the logo
        style={{ zIndex: 2 }}
      />
      <h2 className="text-xl font-bold mb-3">Hi Ruba!</h2>

      {/* Horizontal line */}
      <hr className="w-3/4 border-t border-white mb-8" />

      {/* Navigation Links */}
      <div className="flex flex-col space-y-4 mb-8">
        <Link to="/" className="cursor-pointer font-bold" onClick={() => setActiveTab('pomo')}>
          Pomo
        </Link>
        <Link to="/todos" className="cursor-pointer font-bold" onClick={() => setActiveTab('todos')}>
          Todos
        </Link>
        <Link to="/job" className="cursor-pointer font-bold" onClick={() => setActiveTab('job')}>
          Job
        </Link>
        <Link to="/settings" className="cursor-pointer font-bold" onClick={() => setActiveTab('settings')}>
          Settings
        </Link>
      </div>

      {/* Invisible spacer to push content to the top */}
      <div className="flex-grow"></div>

      {/* Input field to enter playlist ID */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Playlist ID"
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          className="p-2 bg-[#333] text-white rounded-md outline-none"
        />
      </div>

      {/* Display Current Song Title */}
      {currentSongTitle && (
        <div className="mb-2 text-center">
          <h3 className="text-sm font-bold">{currentSongTitle}</h3>
        </div>
      )}

      {/* Previous, Play/Pause, and Next Icons */}
      {playlistId && (
        <div className="mb-4 flex space-x-4">
          {/* Previous Icon */}
          <button onClick={handlePrevious} className="text-white text-2xl">
            <i className="fas fa-step-backward"></i>
          </button>
          {/* Play/Pause Icon */}
          <button onClick={handlePlayPause} className="text-white text-2xl">
            {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
          </button>
          {/* Next Icon */}
          <button onClick={handleNext} className="text-white text-2xl">
            <i className="fas fa-step-forward"></i>
          </button>
        </div>
      )}

      {/* YouTube Audio Player (Hidden) */}
      {playlistId && (
        <div style={{ height: '0px', width: '0px', overflow: 'hidden' }}>
          <YouTube videoId="" opts={opts} onReady={onPlayerReady} onStateChange={onPlayerStateChange} />
        </div>
      )}
    </div>
  );
};

export default SideBar;
