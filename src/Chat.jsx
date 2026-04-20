import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-backend-az6p.onrender.com");

// unique user id
const userId = Math.random().toString(36).substring(7);

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      message,
      time: new Date().toLocaleTimeString(),
      sender: userId,
    };

    socket.emit("send_message", msgData);
    setMessage("");
  };

  return (
    <div className="max-w-md  h-screen flex flex-col bg-gray-100">
      
       {/* header */}
      <div className="bg-green-500 text-white text-center py-3 text-lg font-semibold shadow">
        Chat App
      </div>

      {/* chat messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
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
                className={`px-3 py-2 rounded-xl max-w-[70%] text-sm shadow
                  ${
                    isMyMessage
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                  }`}
              >
                <p>{msg.message}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input box */}
      <div className="flex p-0 bg-white border-t m-b-6">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-l-lg outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;