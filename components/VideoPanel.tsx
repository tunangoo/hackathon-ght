"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic,
  Video,
  Monitor,
  Grid3X3,
  Hand,
  Smile,
  Volume2,
  Circle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const participants = [
  { id: 1, name: "Natura", avatar: "N", bgColor: "bg-blue-200", isSpeaking: false, isMuted: false },
  { id: 2, name: "Cecile", avatar: "C", bgColor: "bg-green-200", isSpeaking: true, isMuted: false },
  { id: 3, name: "Nico", avatar: "N", bgColor: "bg-purple-200", isSpeaking: false, isMuted: false },
  { id: 4, name: "Bryan", avatar: "B", bgColor: "bg-yellow-200", isSpeaking: false, isMuted: false },
  { id: 5, name: "Azzura", avatar: "A", bgColor: "bg-pink-200", isSpeaking: false, isMuted: false },
  { id: 6, name: "Ahmed", avatar: "A", bgColor: "bg-orange-200", isSpeaking: false, isMuted: false },
  { id: 7, name: "Marry", avatar: "M", bgColor: "bg-red-200", isSpeaking: false, isMuted: false },
  { id: 8, name: "Diana", avatar: "D", bgColor: "bg-indigo-200", isSpeaking: false, isMuted: false },
  { id: 9, name: "Lucas", avatar: "L", bgColor: "bg-cyan-200", isSpeaking: false, isMuted: false },
  { id: 10, name: "Mike", avatar: "M", bgColor: "bg-emerald-200", isSpeaking: false, isMuted: false },
  { id: 11, name: "Daniel", avatar: "D", bgColor: "bg-teal-200", isSpeaking: false, isMuted: false },
  { id: 12, name: "Shandy", avatar: "S", bgColor: "bg-rose-200", isSpeaking: false, isMuted: false }
];

export default function VideoPanel() {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Video Grid */}
      <div className="flex-1 p-6 min-h-0 bg-gray-50">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
          {participants.map((participant) => (
            <div 
              key={participant.id} 
              className={`relative ${participant.bgColor} rounded-lg overflow-hidden border border-gray-200 shadow-sm ${
                participant.isSpeaking ? 'ring-4 ring-purple-400 shadow-lg' : ''
              }`}
            >
              {/* Participant Video Area */}
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                    {participant.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Participant Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                  <div className="flex items-center gap-1">
                    {participant.isMuted ? (
                      <Mic className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        {/* Volume Control */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <div className="w-24 h-2 bg-gray-200 rounded-full">
              <div className="w-16 h-2 bg-purple-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Meeting Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Mic className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Monitor className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 w-12 h-12 rounded-full"
            >
              <Video className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Hand className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            Leave Meeting
          </Button>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
