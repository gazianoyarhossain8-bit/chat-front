import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

const socket = io("https://chat-backend-az6p.onrender.com");

// Unique user id
const userId = Math.random().toString(36).substring(7);

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: userId,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-100 shadow-lg">

      {/* Header */}
      <div className="bg-green-500 text-white px-4 py-3 flex items-center gap-3 shadow">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white"
        />

        <div>
          <h1 className="font-semibold text-lg">Chat App</h1>
          <p className="text-xs text-green-100">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chat.map((msg, i) => {
          const isMyMessage = msg.sender === userId;

          return (
            <div
              key={i}
              className={`flex ${
                isMyMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm
                ${
                  isMyMessage
                    ? "bg-green-500 text-white rounded-br-md"
                    : "bg-white text-black rounded-bl-md"
                }`}
              >
                <p>{msg.message}</p>

                <p
                  className={`text-[10px] mt-1 text-right ${
                    isMyMessage
                      ? "text-green-100"
                      : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-3">
        <div className="relative flex items-center">

          {/* File Upload */}
          <label className="absolute left-4 cursor-pointer">
            <FiPaperclip
              size={20}
              className="text-gray-500 hover:text-green-500"
            />

            <input
              type="file"
              className="hidden"
            />
          </label>

          {/* Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Type a message..."
            className="w-full border rounded-full py-3 pl-12 pr-14 outline-none focus:border-green-500"
          />

          {/* Send Button */}
          <button
            onClick={sendMessage}
            className="absolute right-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"
          >
            <IoSend size={18} />
          </button>

        </div>
      </div>

    </div>
  );
}

export default Chat;