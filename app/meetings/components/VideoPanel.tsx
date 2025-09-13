"use client";

import { Button } from "@/components/ui/button";
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Settings,
  Download,
  Share,
  RotateCcw
} from "lucide-react";

export default function VideoPanel() {
  return (
    <div className="flex-1 flex flex-col h-full bg-black">
      {/* Video Recording Player */}
      <div className="flex-1 relative min-h-0 bg-gray-900">
        {/* Video Player */}
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Placeholder for recorded video */}
          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-12 h-12 ml-1" />
              </div>
              <p className="text-xl font-medium">Meeting Recording</p>
              <p className="text-sm opacity-70 mt-2">Click play to start watching</p>
            </div>
          </div>
          
          {/* Video Player Controls Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="bg-black/50 text-white hover:bg-black/70">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Recording Info */}
          <div className="absolute bottom-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Recording • 01:23:45
          </div>
        </div>
      </div>

      {/* Video Player Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-600 rounded-full">
            <div className="w-1/3 h-2 bg-purple-600 rounded-full"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>00:15:30</span>
            <span>01:23:45</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-gray-300 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-full"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button 
              variant="default" 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 w-14 h-14 rounded-full"
            >
              <Play className="w-6 h-6 ml-0.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-gray-300 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-full"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-gray-300 hover:text-white hover:bg-gray-700 w-12 h-12 rounded-full"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-300" />
              <div className="w-20 h-2 bg-gray-600 rounded-full">
                <div className="w-12 h-2 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <Button variant="ghost" className="text-gray-300 hover:text-white px-6 py-2">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
