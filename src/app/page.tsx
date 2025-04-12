"use client";
import { brokerURL, convId, role, token, userId } from "@/variables/chat";
import { Client } from "@stomp/stompjs";
import { useEffect, useMemo, useState } from "react";
import { Message } from "@/types/chat";

const client = new Client({
  brokerURL: brokerURL,
  connectHeaders: {
    Authorization: `Bearer ${token}`,
    role: role,
  },
});

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const usersMock = useMemo(() => {
    return [
      {
        name: "Fikri Ruslandi",
        status: "online",
        message: "Hello there...",
      },
      {
        name: "Moch Ramdhani",
        status: "online",
        message: "How are you?",
      },
      {
        name: "Abu Abdullah Nagraha",
        status: "online",
        message: "Is typing a message...",
      },
      {
        name: "Muhammad Fauzi",
        status: "offline",
        message: "See you tomorrow!",
      },
      {
        name: "Nurman Tri Gumelar",
        status: "online",
        message: "Thanks!",
      },
    ];
  }, []);

  useEffect(() => {
    client.onConnect = () => {
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
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat</h2>
        </div>

        <div className="overflow-y-auto">
          {usersMock?.map((chat, index) => (
            <div
              key={index}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 ${
                    chat.status === "online" ? "bg-green-500" : "bg-gray-400"
                  } rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="font-semibold">{chat.name}</div>
                <div className="text-sm text-gray-500">{chat.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center">
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="ml-3">
              <div className="font-semibold">Abu Abdullah Nagraha</div>
              <div className="text-sm text-green-500">Online</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              {message.senderId !== userId && (
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
              </div>
              {message.senderId === userId && (
                <div className="w-8 h-8 bg-gray-300 rounded-full ml-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isComposing) {
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />

            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Calendar & Agenda */}
      <div className="w-80 border-l">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">My Agenda</h2>
        </div>
        <div className="p-4">
          {/* Calendar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">March 2016</h3>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-gray-100 rounded">&lt;</button>
                <button className="p-1 hover:bg-gray-100 rounded">&gt;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div className="text-gray-500">Su</div>
              <div className="text-gray-500">Mo</div>
              <div className="text-gray-500">Tu</div>
              <div className="text-gray-500">We</div>
              <div className="text-gray-500">Th</div>
              <div className="text-gray-500">Fr</div>
              <div className="text-gray-500">Sa</div>
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  className={`p-2 ${
                    i + 1 === 8 ? "bg-blue-500 text-white rounded-full" : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Agenda Items */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">8 March</h4>
              <p className="text-sm text-gray-600">
                Meeting with Muhammad Fauzi
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">9 March</h4>
              <p className="text-sm text-gray-600">Project discussion</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">10 March</h4>
              <p className="text-sm text-gray-600">Website review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
