// Persistent Audio Player Component
// Uses react-h5-audio-player for AI-generated financial content playback

import React, { createContext, useContext, useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// Audio Player Context for global state management
const AudioPlayerContext = createContext();

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

// Audio Player Provider
export const AudioPlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsVisible(true);
    setIsPlaying(true);
  };

  const addToPlaylist = (tracks) => {
    const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
    setPlaylist(prev => [...prev, ...tracksArray]);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentTrack(null);
    setIsVisible(false);
    setIsPlaying(false);
  };

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < playlist.length) {
      setCurrentTrack(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (!currentTrack || playlist.length === 0) return;

    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      setCurrentTrack(playlist[prevIndex]);
    }
  };

  const hidePlayer = () => {
    setIsVisible(false);
  };

  const showPlayer = () => {
    if (currentTrack) {
      setIsVisible(true);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        playlist,
        isVisible,
        isPlaying,
        playTrack,
        addToPlaylist,
        clearPlaylist,
        playNext,
        playPrevious,
        hidePlayer,
        showPlayer,
        setIsPlaying
      }}
    >
      {children}
      <PersistentPlayer />
    </AudioPlayerContext.Provider>
  );
};

// Persistent Player Component
const PersistentPlayer = () => {
  const {
    currentTrack,
    playlist,
    isVisible,
    playNext,
    playPrevious,
    hidePlayer,
    setIsPlaying
  } = useAudioPlayer();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible || !currentTrack) return null;

  const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform duration-300 ${
      isMinimized ? 'transform translate-y-16' : 'transform translate-y-0'
    }`}>
      {/* Player Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Aperio.fin Audio</span>
          {currentTrack.type && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded">
              {currentTrack.type.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/80 hover:text-white transition-colors"
            title={isMinimized ? 'Expand Player' : 'Minimize Player'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
          <button
            onClick={hidePlayer}
            className="text-white/80 hover:text-white transition-colors"
            title="Close Player"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Player Content */}
      {!isMinimized && (
        <div className="p-4">
          {/* Track Information */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 truncate">
              {currentTrack.title}
            </h3>
            {currentTrack.description && (
              <p className="text-sm text-gray-600 truncate">
                {currentTrack.description}
              </p>
            )}
            {currentTrack.duration && (
              <p className="text-xs text-gray-500">
                Duration: {currentTrack.duration}
              </p>
            )}
          </div>

          {/* Audio Player */}
          <div className="mb-4">
            <AudioPlayer
              autoPlay={true}
              src={currentTrack.audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={hasNext ? playNext : undefined}
              showSkipControls={playlist.length > 1}
              onClickNext={hasNext ? playNext : undefined}
              onClickPrevious={hasPrevious ? playPrevious : undefined}
              customAdditionalControls={[]}
              customVolumeControls={[]}
              showJumpControls={true}
              showDownloadProgress={true}
              style={{
                backgroundColor: '#f8fafc',
                color: '#1f2937'
              }}
              className="rounded-lg"
            />
          </div>

          {/* Playlist Info */}
          {playlist.length > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>
                Track {currentIndex + 1} of {playlist.length}
              </span>
              {currentTrack.characters && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Voices:</span>
                  {currentTrack.characters.map((character, index) => (
                    <span key={character} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {character}
                      {index < currentTrack.characters.length - 1 && ','}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Track Metadata */}
          {currentTrack.metadata && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 border-t pt-3">
              {currentTrack.metadata.generatedAt && (
                <div>
                  <span className="font-medium">Generated:</span>
                  <br />
                  {new Date(currentTrack.metadata.generatedAt).toLocaleDateString()}
                </div>
              )}
              {currentTrack.metadata.wordCount && (
                <div>
                  <span className="font-medium">Words:</span>
                  <br />
                  {currentTrack.metadata.wordCount}
                </div>
              )}
              {currentTrack.metadata.estimatedDuration && (
                <div>
                  <span className="font-medium">Est. Length:</span>
                  <br />
                  {Math.floor(currentTrack.metadata.estimatedDuration / 60)}:
                  {(currentTrack.metadata.estimatedDuration % 60).toString().padStart(2, '0')}
                </div>
              )}
              {currentTrack.metadata.contentType && (
                <div>
                  <span className="font-medium">Type:</span>
                  <br />
                  {currentTrack.metadata.contentType}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Audio Track Component for individual tracks
export const AudioTrackItem = ({ track, className = "" }) => {
  const { playTrack, addToPlaylist } = useAudioPlayer();

  const handlePlay = () => {
    playTrack(track);
    addToPlaylist([track]);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">
            {track.title}
          </h4>
          {track.description && (
            <p className="text-sm text-gray-600 mb-2">
              {track.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            {track.duration && (
              <span>⏱️ {track.duration}</span>
            )}
            {track.type && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {track.type}
              </span>
            )}
            {track.characters && (
              <span>🎙️ {track.characters.length} voices</span>
            )}
          </div>

          {track.characters && (
            <div className="flex flex-wrap gap-1 mb-3">
              {track.characters.map((character) => (
                <span key={character} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {character}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handlePlay}
          className="ml-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <span>▶️</span>
          <span className="text-sm font-medium">Play</span>
        </button>
      </div>
    </div>
  );
};

// Playlist Component
export const AudioPlaylist = ({ tracks, title = "Audio Playlist" }) => {
  const { addToPlaylist, clearPlaylist, playTrack } = useAudioPlayer();

  const handlePlayAll = () => {
    clearPlaylist();
    addToPlaylist(tracks);
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {tracks.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            ▶️ Play All ({tracks.length})
          </button>
        )}
      </div>

      <div className="space-y-3">
        {tracks.map((track, index) => (
          <AudioTrackItem
            key={track.id || index}
            track={{ ...track, index: index + 1 }}
          />
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No audio tracks available</p>
          <p className="text-sm">Generate some content to see tracks here</p>
        </div>
      )}
    </div>
  );
};

export default PersistentPlayer;