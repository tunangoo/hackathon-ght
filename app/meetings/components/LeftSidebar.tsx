"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  MessageCircle, 
  BarChart3, 
  Search, 
  Calendar,
  Plus,
  Video,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import JoinMeetingModal from "@/components/JoinMeetingModal";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const meetings = [
  {
    id: 1,
    name: "Elmer Laverty",
    lastMessage: "Haha oh man 🔥",
    time: "12m ago",
    tags: ["Question", "Help wanted"],
    avatar: "EL"
  },
  {
    id: 2,
    name: "Florencio Dorrance",
    lastMessage: "woohoooo",
    time: "24m ago",
    tags: ["Some content"],
    avatar: "FD"
  },
  {
    id: 3,
    name: "Lavern Laboy",
    lastMessage: "Haha that's terrifying 👻",
    time: "1h ago",
    tags: ["Bug", "Hacktoberfest"],
    avatar: "LL"
  },
  {
    id: 4,
    name: "Titus Kitamura",
    lastMessage: "omg, this is amazing",
    time: "5h ago",
    tags: ["Question", "Some content"],
    avatar: "TK"
  },
  {
    id: 5,
    name: "Geoffrey Mott",
    lastMessage: "aww",
    time: "2d ago",
    tags: ["Request"],
    avatar: "GM"
  },
  {
    id: 6,
    name: "Alfonzo Schuessler",
    lastMessage: "perfect!",
    time: "1m ago",
    tags: ["Follow up"],
    avatar: "AS"
  }
];

export default function LeftSidebar() {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <h1 className="text-xl font-semibold">Meetings</h1>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {user.avatar || user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Meetings Section */}
      <div className="px-6 py-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Meetings</span>
            <span className="text-xs text-gray-500">12</span>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsJoinModalOpen(true)}
              className="text-xs px-3 py-1 h-7"
            >
              <Video className="w-3 h-3 mr-1" />
              Join
            </Button>
            <Button size="sm" className="w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search meetings" 
            className="pl-10"
          />
        </div>

        {/* Meetings */}
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {meeting.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{meeting.name}</h3>
                      <span className="text-xs text-gray-500">{meeting.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{meeting.lastMessage}</p>
                    <div className="flex gap-1 mt-1">
                      {meeting.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Join Meeting Modal */}
      <JoinMeetingModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
