import React, { useState, useRef } from "react";
import { Mic, Square, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<MediaRecorder | null>(null);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current = new MediaRecorder(stream);
      audioRef.current.start();
      setIsRecording(true);

      audioRef.current.ondataavailable = async (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        // TODO: Implement API call to OpenAI Whisper for transcription
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.wav");

        try {
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const { text } = await response.json();
          setMessage(text);
        } catch (error) {
          console.error("Transcription error:", error);
          // Display error message to user
        }
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Display error message to user
    }
  };

  const stopRecording = () => {
    if (audioRef.current) {
      audioRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center p-4 border-t">
      <div className="relative flex-grow">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="w-full p-2 pr-10 border rounded-lg"
          disabled={isLoading}
        />
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            absolute right-0 top-0 bottom-0
            px-3 rounded-r-lg text-white
            ${
              isRecording
                ? "bg-red-600 shadow-lg shadow-red-400/50 animate-pulse"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? (
            <Square className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      <button
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="p-2 ml-2 rounded-full bg-blue-500 text-white disabled:opacity-50"
        aria-label="Send message"
      >
        <Send className="w-7 h-7" />
      </button>
    </div>
  );
};

export default MessageInput;
