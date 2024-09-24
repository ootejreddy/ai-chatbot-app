import React, { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TypingAnimation from "./TypingAnimation"; // Add this import
import { Message } from "@/types";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Add this state
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting message
    const greetingMessage: Message = {
      id: Date.now(),
      content: "Hello! I'm MR GYB AI Chatbot. How can I assist you today?",
      sender: "bot",
    };
    setMessages([greetingMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      content,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    setIsTyping(true); // Start typing animation

    try {
      // TODO: Implement API call to OpenAI GPT
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now(),
        content: data.message,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Display error message to user
    } finally {
      setIsLoading(false);
      setIsTyping(false); // Stop typing animation
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex flex-col w-11/12 mx-auto my-8 border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center py-4 bg-blue-600 text-white">
          MR GYB AI Chatbot
        </h1>
        <div className="flex-grow overflow-auto bg-gray-50">
          <MessageList messages={messages} />
          {isTyping && <TypingAnimation />} {/* Add this line */}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
