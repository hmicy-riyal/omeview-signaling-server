# OmeView Signaling Server

This is the real-time signaling server for OmeView. It uses Socket.IO to manage random peer-to-peer matching and signaling for WebRTC.

## 🚀 Usage

1. Clone the repo
2. Run `npm install`
3. Start with `node server.js`
4. Deploy to Render (recommended)

## 🌐 Deployed URL

Use this URL in your frontend code for signaling:
```js
const socket = io("https://your-server.onrender.com");
