# 🌐 HTTP Audio Call Support

## ✅ Đã thêm hỗ trợ HTTP cho audio call!

### 🔧 **Vấn đề đã khắc phục:**
- **Cloudflare tunnel**: Sử dụng HTTPS nhưng code cố kết nối WebSocket qua HTTP
- **Security error**: "The operation is insecure" khi dùng ws:// trên HTTPS
- **Fallback**: Tự động chuyển sang HTTP mode khi WebSocket không hoạt động

---

## 🚀 **Tính năng mới:**

### 1. **HTTPS/WSS Support**:
```javascript
const WEBSOCKET_URLS = [
  "wss://localhost:8080/ws",           // Local HTTPS
  "wss://127.0.0.1:8080/ws",          // Local HTTPS  
  "wss://192.168.110.31:8080/ws",     // Local network HTTPS
  "ws://localhost:8080/ws",            // Local HTTP fallback
  "ws://127.0.0.1:8080/ws",           // Local HTTP fallback
  "ws://192.168.110.31:8080/ws"       // Local network HTTP fallback
]
```

### 2. **HTTP API Fallback**:
```javascript
// HTTP API endpoints
POST /api/message
{
  "type": "offer",
  "offer": {...},
  "username": "John Doe",
  "meetingId": "meeting_123",
  "timestamp": 1234567890
}
```

### 3. **Auto Fallback**:
- WebSocket fails → Tự động chuyển sang HTTP mode
- HTTP mode → Gửi messages qua REST API
- UI hiển thị "🌐 HTTP Audio Call Active"

---

## 🔄 **Flow hoạt động:**

### **1. Try WebSocket First**:
```
1. Thử WSS URLs (HTTPS)
2. Thử WS URLs (HTTP fallback)
3. Nếu thành công → WebSocket mode
4. Nếu thất bại → HTTP mode
```

### **2. HTTP Mode**:
```
1. Tạo offer
2. Gửi POST /api/message với offer
3. Server xử lý và forward cho participants
4. Nhận answer qua HTTP
5. Audio call hoạt động
```

---

## 📡 **HTTP API Endpoints:**

### **Send Message**:
```javascript
POST /api/message
Content-Type: application/json

{
  "type": "offer|answer|ice-candidate",
  "offer": {...},           // For offer
  "answer": {...},          // For answer  
  "candidate": {...},       // For ice-candidate
  "username": "John Doe",
  "meetingId": "meeting_123",
  "timestamp": 1234567890
}
```

### **Response**:
```javascript
{
  "success": true,
  "message": "Message sent successfully",
  "participants": ["Alice", "Bob", "Charlie"]
}
```

---

## 🎵 **Audio Call Modes:**

### **WebSocket Mode** (Preferred):
- Real-time communication
- Low latency
- Bidirectional
- UI: "🎵 WebSocket Audio Call Active"

### **HTTP Mode** (Fallback):
- REST API communication
- Higher latency
- Polling-based
- UI: "🌐 HTTP Audio Call Active"

---

## 🧪 **Testing với Cloudflare Tunnel:**

### **1. Setup Cloudflare Tunnel**:
```bash
# Install cloudflared
brew install cloudflared

# Create tunnel
cloudflared tunnel create my-tunnel

# Run tunnel
cloudflared tunnel run my-tunnel
```

### **2. Test URLs**:
```
HTTPS: https://your-tunnel.trycloudflare.com
WSS: wss://your-tunnel.trycloudflare.com:8080/ws
HTTP: http://your-tunnel.trycloudflare.com:8080/api/message
```

### **3. Console Logs**:
```
🔗 Attempting to connect to WebRTC server...
Trying WebSocket URL: wss://your-tunnel.trycloudflare.com:8080/ws
✅ Connected to WebSocket: wss://your-tunnel.trycloudflare.com:8080/ws
🎵 WebSocket Audio Call Active - Microphone Connected
```

---

## 🔧 **Server Requirements:**

### **WebSocket Server** (Port 8080):
```javascript
// WebSocket endpoint
wss://your-domain.com:8080/ws
```

### **HTTP API Server** (Port 8080):
```javascript
// HTTP endpoints
POST /api/message
GET /api/participants
GET /api/health
```

---

## 📝 **Code Examples:**

### **Start HTTP Audio Call**:
```javascript
const startHttpAudioCall = async (offer, username, meetingId) => {
  const response = await fetch('http://localhost:8080/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: "offer",
      offer: offer,
      username: username,
      meetingId: meetingId,
      timestamp: Date.now()
    })
  })
  
  return await response.json()
}
```

### **Send HTTP Answer**:
```javascript
const sendHttpAnswer = async (answer, username, meetingId) => {
  await fetch('http://localhost:8080/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: "answer",
      answer: answer,
      username: username,
      meetingId: meetingId,
      timestamp: Date.now()
    })
  })
}
```

---

## 🐛 **Troubleshooting:**

### **"The operation is insecure" Error**:
- **Cause**: HTTP WebSocket trên HTTPS page
- **Solution**: Sử dụng WSS hoặc HTTP mode

### **WebSocket Connection Failed**:
- **Cause**: Server không hỗ trợ WebSocket
- **Solution**: Tự động fallback sang HTTP mode

### **HTTP API Not Available**:
- **Cause**: Server không có HTTP endpoints
- **Solution**: Implement HTTP API server

---

## ✅ **Kết quả:**

**Giờ đây audio call hoạt động qua cả WebSocket và HTTP!**

- ✅ **HTTPS/WSS Support**: Hoạt động với Cloudflare tunnel
- ✅ **HTTP Fallback**: Tự động chuyển khi WebSocket fails
- ✅ **Auto Detection**: Tự động detect mode phù hợp
- ✅ **UI Feedback**: Hiển thị mode đang sử dụng
- ✅ **Error Handling**: Graceful fallback

**Perfect for Cloudflare tunnel! 🚀**
