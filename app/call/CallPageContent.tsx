"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Phone, Settings, Grid3X3, List, Maximize, Users, Grid, Volume2, Share, Square, Hand, Smile, ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { 
  checkMediaDevices, 
  getMicrophoneAccess, 
  isSecureContext,
  createPeerConnection,
  createWebSocketConnection,
  sendWebSocketMessage,
  getErrorMessage,
  toggleAudioTrack,
  toggleVideoTrack,
  stopAllTracks,
  getConnectionStatusText,
  getConnectionStatusColor,
  setupWebSocketConnection,
  setupPeerConnection,
  createAndSendOffer,
  handleWebSocketMessage,
  validateMediaSupport,
  validateSecureContext,
  validateAudioDevices,
  performMediaValidation,
  startHttpAudioCall,
  sendHttpAnswer,
  sendHttpIceCandidate
} from "@/lib/utils"

export default function CallPageContent() {
  const searchParams = useSearchParams()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [hasMediaError, setHasMediaError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [participants, setParticipants] = useState<string[]>([
    searchParams.get("username") || "You"
  ])
  
  // UI state for video conferencing interface
  const [currentView, setCurrentView] = useState<"grid" | "list" | "fullscreen">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isRecording, setIsRecording] = useState(true)
  const [volume, setVolume] = useState(70)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [showApps, setShowApps] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false)
  
  // Mock participant data for the grid view
  const mockParticipants = [
    { name: "Natura", isMuted: false, isSpeaking: false },
    { name: "Cécile", isMuted: false, isSpeaking: true },
    { name: "Nico", isMuted: false, isSpeaking: false },
    { name: "Bryan", isMuted: true, isSpeaking: false },
    { name: "Azzura", isMuted: false, isSpeaking: false },
    { name: "Ahmed", isMuted: false, isSpeaking: false },
    { name: "Marry", isMuted: false, isSpeaking: false },
    { name: "Diana", isMuted: false, isSpeaking: false },
    { name: "Lucas", isMuted: false, isSpeaking: false },
    { name: "Mike", isMuted: true, isSpeaking: false },
    { name: "Daniel", isMuted: true, isSpeaking: false },
    { name: "Shandy", isMuted: true, isSpeaking: false },
    { name: "Stephany", isMuted: true, isSpeaking: false },
    { name: "Robert", isMuted: true, isSpeaking: false },
    { name: "Lily", isMuted: true, isSpeaking: false },
    { name: "Michael", isMuted: true, isSpeaking: false },
  ]
  
  // WebRTC related refs and state
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const [serverStatus, setServerStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [audioOnlyMode, setAudioOnlyMode] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [useHttpMode, setUseHttpMode] = useState(false)
  console.log("participants", participants)
  useEffect(() => {
    // Initialize WebRTC connection
    initializeWebRTC()

    // Cleanup on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
      }
      stopAllTracks(localStreamRef.current)
    }
  }, [])


  const initializeWebRTC = async () => {
    try {
      setIsInitializing(true)
      console.log("🚀 Starting automatic call initialization...")
      
      // Perform all media validations
      const validation = await performMediaValidation()
      
      if (!validation.isValid) {
        setHasMediaError(true)
        setErrorMessage(validation.errorMessage || "Media validation failed")
        setIsInitializing(false)
        return
      }

      if (!validation.hasAudioDevices) {
        setHasMediaError(true)
        setErrorMessage("No audio input devices found on this system")
        setIsInitializing(false)
        return
      }

      // Get microphone access - simple approach
      console.log("🎤 Requesting microphone access...")
      const stream = await getMicrophoneAccess()

      localStreamRef.current = stream
      setHasMediaError(false)
      setErrorMessage("")
      
      // Connect to WebRTC server
      console.log("🔗 Connecting to WebRTC server...")
      await connectToWebRTCServer(stream)
      
      // Auto-start audio call after connection
      console.log("🎵 Auto-starting audio call...")
      await startAudioCall()
      
      console.log("✅ Call initialization completed successfully!")
      setIsInitializing(false)
      
    } catch (error) {
      console.error("Error accessing media devices:", error)
      setHasMediaError(true)
      setIsConnected(false)
      setIsInitializing(false)
      
      // Set specific error messages using utility function
      setErrorMessage(getErrorMessage(error))
      
      // Try to connect without media (audio-only mode)
      try {
        console.log("Attempting to connect without media...")
        await connectToWebRTCServer(null)
        setAudioOnlyMode(true)
        setHasMediaError(false)
        setErrorMessage("")
        setIsInitializing(false)
      } catch (serverError) {
        console.error("Failed to connect to server without media:", serverError)
        setIsInitializing(false)
      }
    }
  }

  const sendToAllParticipants = (message: any) => {
    if (!websocketRef.current) return
    
    const currentUsername = searchParams.get("username") || "Anonymous"
    
    // Send to each participant individually
    participants.forEach(participant => {
      if (participant !== currentUsername) { // Don't send to self
        sendWebSocketMessage(websocketRef.current!, {
          ...message,
          target: participant,
          clientId: currentUsername
        })
        console.log(`📤 Sent ${message.type} to ${participant}`)
      }
    })
  }

  const startAudioCall = async () => {
    try {
      console.log("🎵 Starting audio call...")
      
      if (!peerConnectionRef.current) {
        console.log("⚠️ No peer connection available for audio call")
        return
      }

      const username = searchParams.get("username") || "Anonymous"
      const meetingId = searchParams.get("zoomId") || "default"

      // Create and send offer for audio call
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)

      if (useHttpMode) {
        // Use HTTP API for audio call
        console.log("🌐 Using HTTP mode for audio call")
        await startHttpAudioCall(offer, username, meetingId)
      } else {
        // Use WebSocket for audio call
        if (!websocketRef.current) {
          console.log("⚠️ No WebSocket connection, falling back to HTTP mode")
          setUseHttpMode(true)
          await startHttpAudioCall(offer, username, meetingId)
          return
        }

        // Send offer to all participants in room
        sendToAllParticipants({
          type: "offer",
          offer: offer
        })
      }

      console.log("📤 Sent audio call offer")
      setIsConnected(true)
      
    } catch (error) {
      console.error("Error starting audio call:", error)
      
      // Fallback to HTTP mode if WebSocket fails
      if (!useHttpMode) {
        console.log("🔄 Falling back to HTTP mode...")
        setUseHttpMode(true)
        try {
          const username = searchParams.get("username") || "Anonymous"
          const meetingId = searchParams.get("zoomId") || "default"
          const offer = await peerConnectionRef.current?.createOffer()
          if (offer) {
            await peerConnectionRef.current?.setLocalDescription(offer)
            await startHttpAudioCall(offer, username, meetingId)
            setIsConnected(true)
          }
        } catch (httpError) {
          console.error("HTTP fallback also failed:", httpError)
        }
      }
    }
  }

  const connectToWebRTCServer = async (stream: MediaStream | null) => {
    try {
      // WebSocket URLs for LAN server only
      const WEBSOCKET_URLS = [
        "wss://ws.cinterface.art/ws"       // HTTP WebSocket fallback
      ]
      
      const username = searchParams.get("username") || "Anonymous"
      const meetingId = searchParams.get("zoomId") || "default"
      
      console.log(`🔗 Attempting to connect to WebRTC server for user: ${username}, meeting: ${meetingId}`)
      
      // Try to connect to the first available WebSocket URL
      let websocket = null
      let lastError = null
      
      for (const url of WEBSOCKET_URLS) {
        try {
          console.log(`Trying WebSocket URL: ${url}`)
          websocket = createWebSocketConnection(url)
          websocketRef.current = websocket
          console.log(`✅ Connected to WebSocket: ${url}`)
          break
        } catch (error) {
          console.log(`❌ Failed to connect to ${url}:`, error)
          lastError = error
          continue
        }
      }
      
      
      if (!websocket) {
        throw new Error(`Failed to connect to any WebSocket server. Last error: ${lastError}`)
      }

      // Setup WebSocket event handlers
      setupWebSocketConnection(
        websocket,
        username,
        meetingId,
        async (event) => {
          const message = JSON.parse(event.data)
          await handleWebSocketMessage(
            message,
            handleOffer,
            handleAnswer,
            handleIceCandidate,
            (username) => {
              console.log(`👋 Participant joined: ${username}`)
              setParticipants(prev => {
                if (!prev.includes(username)) {
                  return [...prev, username]
                }
                return prev
              })
            },
            (username) => {
              console.log(`👋 Participant left: ${username}`)
              setParticipants(prev => prev.filter(p => p !== username))
            }
          )
        },
        (error) => {
          console.error("WebSocket error:", error)
          setServerStatus("disconnected")
        },
        () => {
          console.log("WebSocket connection closed")
          setServerStatus("disconnected")
        },
        () => {
          setServerStatus("connected")
        }
      )

      // Create RTCPeerConnection
      const peerConnection = createPeerConnection()
      peerConnectionRef.current = peerConnection

      // Setup PeerConnection event handlers
      setupPeerConnection(
        peerConnection,
        stream,
        (candidate) => {
          sendToAllParticipants({
            type: "ice-candidate",
            candidate: candidate
          })
        },
        (state) => {
          if (state === "connected") {
            setIsConnected(true)
          } else if (state === "disconnected" || state === "failed") {
            setIsConnected(false)
          }
        }
      )

      // Create and send offer
      await createAndSendOffer(peerConnection, websocket, searchParams.get("username") || "Anonymous", participants)

    } catch (error) {
      console.error("Error connecting to WebRTC server:", error)
      setServerStatus("disconnected")
      
      // Fallback: Show demo mode if WebSocket server is not available
      console.log("🔄 WebSocket server not available, entering demo mode...")
      setErrorMessage("WebSocket server not available. Running in demo mode.")
      setIsInitializing(false)
      setIsConnected(true) // Set as connected for demo purposes
      setServerStatus("connected")
    }
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    await peerConnectionRef.current.setRemoteDescription(offer)
    const answer = await peerConnectionRef.current.createAnswer()
    await peerConnectionRef.current.setLocalDescription(answer)

    if (websocketRef.current) {
      sendToAllParticipants({
        type: "answer",
        answer: answer
      })
    }
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.setRemoteDescription(answer)
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return
    await peerConnectionRef.current.addIceCandidate(candidate)
  }

  const retryMediaAccess = () => {
    setHasMediaError(false)
    initializeWebRTC()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toggleAudioTrack(localStreamRef.current, !isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    toggleVideoTrack(videoRef.current, !isVideoOff)
  }

  const endCall = () => {
    // Close WebSocket connection
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }

    // Close RTCPeerConnection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Stop all tracks
    stopAllTracks(localStreamRef.current)
    localStreamRef.current = null
    
    // Reset states
    setIsConnected(false)
    setServerStatus("disconnected")
    
    // Navigate back or close the call
    window.close()
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Top Control Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={currentView === "grid" ? "default" : "ghost"}
              onClick={() => setCurrentView("grid")}
              className={`${currentView === "grid" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={currentView === "list" ? "default" : "ghost"}
              onClick={() => setCurrentView("list")}
              className={`${currentView === "list" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentView("fullscreen")}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-gray-700 text-sm font-mono">
            {new Date().toLocaleTimeString()}
          </div>
          <Button
            size="sm"
            variant={showParticipants ? "default" : "ghost"}
            onClick={() => setShowParticipants(!showParticipants)}
            className={`${showParticipants ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Participants
          </Button>
          <Button
            size="sm"
            variant={showApps ? "default" : "ghost"}
            onClick={() => setShowApps(!showApps)}
            className={`${showApps ? "bg-purple-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <Grid className="w-4 h-4 mr-2" />
            Apps
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Video Grid */}
        <div className="flex-1 p-6 bg-gray-50">
          <div className="grid grid-cols-4 gap-4 h-full">
            {mockParticipants.map((participant, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${
                  participant.isSpeaking ? "ring-2 ring-yellow-400 shadow-lg" : ""
                }`}
              >
                {/* Video placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                {/* Participant name */}
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                    {participant.name}
                  </span>
                </div>
                
                {/* Microphone status */}
                <div className="absolute bottom-2 right-2">
                  {participant.isMuted ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
            <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        {showApps && (
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-gray-900 font-medium">Registration Form</h2>
            </div>
            
            <Card className="p-6 bg-white shadow-sm border border-gray-200">
              <div className="space-y-4">
                <h3 className="text-gray-900 text-lg font-semibold">
                  Building your immersive portfolio using virtual worlds
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  In this interactive event, we will talk about how virtual worlds can be the next medium to deliver immersive portfolio for designers, photographer, & story tellers.
                </p>
                
                <Card className="bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 text-sm font-medium">
                      Congratulation, you have succeed registration
                    </span>
                  </div>
                </Card>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50">
                    Change data
                  </Button>
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="lg"
            variant={isMuted ? "destructive" : "outline"}
            onClick={toggleMute}
            className="w-12 h-12 rounded-full border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={toggleVideo}
            className="w-12 h-12 rounded-full border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-12 h-12 rounded-full border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <Share className="w-5 h-5" />
          </Button>
          
          <Button
            size="lg"
            variant={isRecording ? "default" : "outline"}
            onClick={() => setIsRecording(!isRecording)}
            className={`w-12 h-12 rounded-full shadow-sm hover:shadow-md transition-shadow ${isRecording ? "bg-purple-600" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <Square className="w-5 h-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-12 h-12 rounded-full border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <Grid3X3 className="w-5 h-5" />
          </Button>
          
          <Button
            size="lg"
            variant={isHandRaised ? "default" : "outline"}
            onClick={() => setIsHandRaised(!isHandRaised)}
            className={`w-12 h-12 rounded-full shadow-sm hover:shadow-md transition-shadow ${isHandRaised ? "bg-purple-600" : "border-gray-300 hover:bg-gray-50"}`}
          >
            <Hand className="w-5 h-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="w-12 h-12 rounded-full border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
          >
            <Smile className="w-5 h-5" />
          </Button>
        </div>
        
        <Button
          size="lg"
          variant="destructive"
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 px-6 shadow-sm hover:shadow-md transition-shadow"
        >
          Leave Meeting
        </Button>
      </div>
    </div>
  )
}
