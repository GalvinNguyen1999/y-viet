"use client";
import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";

const token =
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YWlraG9hbjEiLCJpYXQiOjE3NDQ0NTI5OTMsImV4cCI6MTc0NDQ3NDU5M30.Bs5sxcwvM8oXrHNVtN8X0sfB2APLBg1O4eAQma9MPIw";
const userId = "dff23607-307e-49aa-8f96-b5b4280eade9";
const convId = "f2f3d797-130d-4552-bafe-46db3bfa380d";
const brokerURL = "ws://157.66.101.32:9200/ws";
const role = "DOCTOR";

const client = new Client({
  brokerURL: brokerURL,
  connectHeaders: {
    Authorization: `Bearer ${token}`,
    role: role,
  },
});

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    client.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      client.subscribe(`/topic/${convId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });
    };

    client.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const handleSendMessage = () => {
    if (!!newMessage.trim()) {
      client.publish({
        destination: `/app/chat/sendMessage/${convId}`,
        body: JSON.stringify({
          messageType: "CHAT",
          content: newMessage,
          sendId: userId,
        }),
      });

      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen  ">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === role ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
}
