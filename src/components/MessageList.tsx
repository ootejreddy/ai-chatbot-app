import React from "react";
import { Message } from "@/types";
import { User, Bot } from "lucide-react";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`flex items-start ${
              message.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`rounded-full p-2 ${
                message.sender === "user" ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              {message.sender === "user" ? <User /> : <Bot />}
            </div>
            <div
              className={`max-w-xs mx-2 p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100"
              }`}
            >
              {message.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
