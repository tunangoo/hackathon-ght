import { Suspense } from "react"
import CallPageContent from "./CallPageContent"

export default function CallPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <CallPageContent />
    </Suspense>
  )
}
