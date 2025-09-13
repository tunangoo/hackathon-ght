"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Download,
  Share
} from "lucide-react";
// import VideoPlayer from "@/components/VideoPlayer";

export default function VideoPanel() {
  const [selectedVideo, setSelectedVideo] = useState<{
    videoUrl: string;
    title: string;
  } | null>(null);
  
  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleMeetingSelected = (event: CustomEvent) => {
      console.log('Meeting selected:', event.detail);
      setSelectedVideo({
        videoUrl: event.detail.videoUrl,
        title: event.detail.title
      });
      // Reset video state when new video is selected
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };

    // Listen for meeting selection events
    window.addEventListener('meetingSelected', handleMeetingSelected as EventListener);

    return () => {
      window.removeEventListener('meetingSelected', handleMeetingSelected as EventListener);
    };
  }, []);

  // Reset video state when video changes
  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      const video = videoRef.current;
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [selectedVideo]);

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Error playing video:', error);
        // Handle autoplay policy error
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay blocked, user interaction required');
        }
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseInt(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(parseInt(e.target.value));
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const goBack = () => {
    setSelectedVideo(null);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      {/* Video Recording Player */}
      <div className="flex-1 relative min-h-0 bg-gray-900">
        <div className="w-full h-full flex items-center justify-center relative">
          {selectedVideo ? (
            <>
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                src={selectedVideo.videoUrl}
                className="w-full h-full object-cover"
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  setDuration(video.duration);
                  video.volume = volume / 100;
                }}
                onTimeUpdate={(e) => {
                  const video = e.target as HTMLVideoElement;
                  setCurrentTime(video.currentTime);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Video load error:', e);
                }}
                onLoadStart={() => {
                  console.log('Video loading started');
                }}
                onCanPlay={() => {
                  console.log('Video can play');
                }}
                preload="metadata"
              />
              
              {/* Video Title and Back Button - Hidden */}
              {/* <div className="absolute top-4 left-4 flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={goBack}
                >
                  ← Back
                </Button>
                <div className="bg-black/50 text-white px-3 py-1 rounded text-sm font-medium">
                  {selectedVideo.title}
                </div>
              </div> */}
            </>
          ) : (
            /* Placeholder for recorded video */
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-12 h-12 ml-1" />
                </div>
                <p className="text-xl font-medium">Meeting Recording</p>
                <p className="text-sm opacity-70 mt-2">Select a meeting to start watching</p>
              </div>
            </div>
          )}
          
          {/* Video Player Controls Overlay - Hidden */}
          {/* <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div> */}

          {/* Recording Info
          <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Recording • {formatTime(duration)}
          </div> */}
        </div>
      </div>

      {/* Video Player Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          {/* Volume Controls - Left Side */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-gray-300 hover:text-white">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${isMuted ? 0 : volume}%, #4b5563 ${isMuted ? 0 : volume}%, #4b5563 100%)`
              }}
            />
          </div>

          {/* Playback Controls - Center */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-gray-300 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-full"
              onClick={skipBackward}
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 w-14 h-14 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-gray-300 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-full"
              onClick={skipForward}
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          {/* Settings - Right Side */}
          <Button variant="ghost" className="text-gray-300 hover:text-white px-6 py-2">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
