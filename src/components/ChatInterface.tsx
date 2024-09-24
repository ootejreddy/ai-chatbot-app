import React, { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { Message } from "@/types";

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatInterface;
