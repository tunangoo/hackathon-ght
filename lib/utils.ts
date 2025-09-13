import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Media Device Utilities
export const checkMediaDevices = async (): Promise<boolean> => {
  try {
    console.log('Checking available media devices...');
    
    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia is not supported');
      return false;
    }

    // Check available devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log('Available devices:', devices);
    
    const audioInputs = devices.filter(device => device.kind === 'audioinput');
    console.log('Audio input devices:', audioInputs);
    
    if (audioInputs.length === 0) {
      console.log('No audio input devices found');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking media devices:', error);
    return false;
  }
}

export const getMicrophoneAccess = async (): Promise<MediaStream> => {
  try {
    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia is not supported in this browser');
    }

    console.log('Attempting to get microphone access...');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Microphone access granted, 'stream' now contains the audio
    console.log('Microphone access granted:', stream);
    console.log('Audio tracks:', stream.getAudioTracks());
    
    return stream;
  } catch (err) {
    // Handle errors (e.g., user denied permission, no microphone found)
    console.error('Error getting microphone access:', err);
    
    // Re-throw as DOMException if it's not already
    if (err instanceof DOMException) {
      throw err;
    }
    
    // Wrap other errors as DOMException-like
    const error = new DOMException(
      'Failed to get microphone access: ' + (err as Error).message,
      'NotReadableError'
    );
    throw error;
  }
}

export const isSecureContext = (): boolean => {
  return window.location.protocol === 'https:' || 
        window.location.protocol === 'http:' ||
         window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1'
}

// WebRTC Utilities
export const createPeerConnection = (): RTCPeerConnection => {
  return new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" }
    ]
  })
}

export const createWebSocketConnection = (url: string): WebSocket => {
  return new WebSocket(url)
}

export const sendWebSocketMessage = (websocket: WebSocket, message: any) => {
  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message))
  }
}

// HTTP API Functions for audio call fallback
export const sendHttpMessage = async (message: any, baseUrl: string = "wss://ws.cinterface.art/ws") => {
  try {
    const response = await fetch(`${baseUrl}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('HTTP message error:', error)
    throw error
  }
}

export const startHttpAudioCall = async (offer: RTCSessionDescriptionInit, username: string, meetingId: string) => {
  try {
    const response = await sendHttpMessage({
      type: "start_call",
      offer: offer,
      username: username,
      meetingId: meetingId,
      timestamp: Date.now()
    })
    
    console.log("📤 Sent HTTP audio call offer")
    return response
  } catch (error) {
    console.error("Error starting HTTP audio call:", error)
    throw error
  }
}

export const sendHttpAnswer = async (answer: RTCSessionDescriptionInit, username: string, meetingId: string) => {
  try {
    const response = await sendHttpMessage({
      type: "answer",
      answer: answer,
      username: username,
      meetingId: meetingId,
      timestamp: Date.now()
    })
    
    console.log("📤 Sent HTTP answer")
    return response
  } catch (error) {
    console.error("Error sending HTTP answer:", error)
    throw error
  }
}

export const sendHttpIceCandidate = async (candidate: RTCIceCandidateInit, username: string, meetingId: string) => {
  try {
    const response = await sendHttpMessage({
      type: "ice-candidate",
      candidate: candidate,
      username: username,
      meetingId: meetingId,
      timestamp: Date.now()
    })
    
    console.log("📤 Sent HTTP ICE candidate")
    return response
  } catch (error) {
    console.error("Error sending HTTP ICE candidate:", error)
    throw error
  }
}

// Error Handling Utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof DOMException) {
    // Check for specific "object can not be found here" error
    if (error.message.includes("The object can not be found here")) {
      return "Microphone device not found or not accessible. Please check your microphone connection and browser permissions."
    }
    
    switch (error.name) {
      case 'NotAllowedError':
        return "Microphone access was denied. Please allow microphone access and try again."
      case 'NotFoundError':
        return "No microphone found. Please check your microphone device."
      case 'NotReadableError':
        return "Microphone is being used by another application."
      default:
        return `Unable to access microphone: ${error.name} - ${error.message}`
    }
  } else {
    const errorMsg = error instanceof Error ? error.message : "Unknown error occurred"
    
    // Check for "object can not be found here" in non-DOM errors too
    if (errorMsg.includes("The object can not be found here")) {
      return "Microphone device not found or not accessible. Please check your microphone connection and browser permissions."
    }
    
    return `Failed to get microphone access: ${errorMsg}`
  }
}

// Media Control Utilities
export const toggleAudioTrack = (stream: MediaStream | null, enabled: boolean) => {
  if (stream) {
    const audioTrack = stream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = enabled
    }
  }
}

export const toggleVideoTrack = (videoElement: HTMLVideoElement | null, enabled: boolean) => {
  if (videoElement?.srcObject) {
    const stream = videoElement.srcObject as MediaStream
    const videoTrack = stream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = enabled
    }
  }
}

export const stopAllTracks = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}

// Connection Status Utilities
export const getConnectionStatusText = (
  serverStatus: "connecting" | "connected" | "disconnected",
  isConnected: boolean,
  hasMediaError: boolean
): string => {
  if (hasMediaError) return 'Media Error'
  if (serverStatus === 'connecting') return 'Connecting...'
  if (serverStatus === 'connected' && isConnected) return 'Connected'
  if (serverStatus === 'connected') return 'Establishing call...'
  return 'Disconnected'
}

export const getConnectionStatusColor = (
  serverStatus: "connecting" | "connected" | "disconnected",
  isConnected: boolean,
  hasMediaError: boolean
): string => {
  if (hasMediaError) return 'bg-red-500'
  if (serverStatus === 'connected' && isConnected) return 'bg-green-500'
  if (serverStatus === 'connected') return 'bg-yellow-500'
  return 'bg-gray-500'
}

// WebRTC Connection Setup Utilities
export const setupWebSocketConnection = (
  websocket: WebSocket,
  username: string,
  meetingId: string,
  onMessage: (event: MessageEvent) => void,
  onError: (error: Event) => void,
  onClose: () => void,
  onOpen: () => void
) => {
  websocket.onopen = () => {
    console.log("WebSocket connected to server")
    onOpen()
    
    // Send join message
    sendWebSocketMessage(websocket, {
      type: "join",
      userName: username,
      room: meetingId
    })
  }

  websocket.onmessage = onMessage
  websocket.onerror = onError
  websocket.onclose = onClose
}

export const setupPeerConnection = (
  peerConnection: RTCPeerConnection,
  stream: MediaStream | null,
  onIceCandidate: (candidate: RTCIceCandidate) => void,
  onConnectionStateChange: (state: string) => void
) => {
  // Add local stream to peer connection (if available)
  if (stream) {
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream)
    })
  }

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate)
    }
  }

  // Handle connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log("Connection state:", peerConnection.connectionState)
    onConnectionStateChange(peerConnection.connectionState)
  }
}

export const createAndSendOffer = async (
  peerConnection: RTCPeerConnection,
  websocket: WebSocket,
  clientId: string = "Anonymous",
  participants: string[] = []
) => {
  const offer = await peerConnection.createOffer()
  await peerConnection.setLocalDescription(offer)
  
  // Send to each participant individually
  participants.forEach(participant => {
    if (participant !== clientId) { // Don't send to self
      sendWebSocketMessage(websocket, {
        type: "offer",
        offer: offer,
        target: participant,
        clientId: clientId
      })
    }
  })
}

export const handleWebSocketMessage = async (
  message: any,
  handleOffer: (offer: RTCSessionDescriptionInit) => Promise<void>,
  handleAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>,
  handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>,
  onParticipantJoined: (username: string) => void,
  onParticipantLeft: (username: string) => void
) => {
  console.log("Received message:", message)

  switch (message.type) {
    case "offer":
      await handleOffer(message.offer)
      break
    case "answer":
      await handleAnswer(message.answer)
      break
    case "ice-candidate":
      await handleIceCandidate(message.candidate)
      break
    case "participant-joined":
      onParticipantJoined(message.username)
      break
    case "participant-left":
      onParticipantLeft(message.username)
      break
  }
}

// Media Validation Utilities
export const validateMediaSupport = (): void => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Media devices not supported in this browser")
  }
}

export const validateSecureContext = (): void => {
  const isSecure = isSecureContext()
  
  console.log("Current location:", window.location.href)
  console.log("Protocol:", window.location.protocol)
  console.log("Hostname:", window.location.hostname)
  console.log("Is secure:", isSecure)
  
  if (!isSecure) {
    throw new Error("Microphone access requires HTTPS or localhost")
  }
}

export const validateAudioDevices = async (): Promise<boolean> => {
  const hasAudioDevices = await checkMediaDevices()
  if (!hasAudioDevices) {
    console.log("No audio input devices found on this system")
    return false
  }
  return true
}

export const performMediaValidation = async (): Promise<{
  isValid: boolean
  errorMessage?: string
  hasAudioDevices: boolean
}> => {
  try {
    // Check media support
    validateMediaSupport()
    
    // Check secure context
    validateSecureContext()
    
    // Check audio devices
    const hasAudioDevices = await validateAudioDevices()
    
    return {
      isValid: true,
      hasAudioDevices
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return {
      isValid: false,
      errorMessage,
      hasAudioDevices: false
    }
  }
}
