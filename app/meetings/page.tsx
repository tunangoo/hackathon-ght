import LeftSidebar from "@/app/meetings/components/LeftSidebar";
import VideoPanel from "@/app/meetings/components/VideoPanel";
import MeetingInfo from "@/app/meetings/components/MeetingInfo";

export default function MeetingsPage() {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <LeftSidebar />
      <VideoPanel />
      <MeetingInfo />
    </div>
  );
}