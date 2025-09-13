import LeftSidebar from "@/app/meetings/components/LeftSidebar";
import VideoPanel from "@/app/meetings/components/VideoPanel";
import MeetingInfo from "@/app/meetings/components/MeetingInfo";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MeetingsPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white overflow-hidden">
        <LeftSidebar />
        <VideoPanel />
        <MeetingInfo />
      </div>
    </ProtectedRoute>
  );
}