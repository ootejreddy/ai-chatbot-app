import React from "react";

const TypingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4">
      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
      <div
        className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
};

export default TypingAnimation;
