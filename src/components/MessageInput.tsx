import React, { useState, useRef, useCallback } from "react";
import { Mic, Square, Send, Headphones } from "lucide-react";
import LoadingModal from "./LoadingModal"; // Import the new LoadingModal component

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isTTSEnabled: boolean;
  toggleTTS: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  toggleTTS,
}) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false); // New state for loading modal
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);

      mediaRecorderRef.current.ondataavailable = async (event) => {
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
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleToggleTTS = useCallback(() => {
    setShowLoadingModal(true);
    setTimeout(() => {
      setShowLoadingModal(false);
      toggleTTS();
    }, 2000);
  }, [toggleTTS]);

  return (
    <>
      <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-800">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          disabled={isLoading || isRecording}
        />
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <Square size={24} />
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={isLoading || isRecording || !message}
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50"
        >
          <Send size={24} />
        </button>
        <button
          onClick={handleToggleTTS}
          disabled={isLoading || isRecording}
          className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 disabled:opacity-50"
        >
          <Headphones size={24} />
        </button>
      </div>
      <LoadingModal isOpen={showLoadingModal} />
    </>
  );
};

export default MessageInput;
