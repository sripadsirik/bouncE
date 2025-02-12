// src/components/Chatbot.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import "./Chatbot.css";
// Import the Gemini SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your Gemini API key (for development only)
const GEMINI_API_KEY = "AIzaSyCc23ewgKDb9Kjo0l-yOPSiCfh8x4-dp78";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // State to hold the screen stream (for screen sharing)
  const [screenStream, setScreenStream] = useState(null);
  const videoRef = useRef(null);

  // Initialize the Gemini model only once.
  const model = useMemo(() => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }, []);

  // When a screen stream is available, set it as the video source.
  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Simple check to allow only finance and stock trading related questions.
  const isFinancialQuestion = (query) => {
    const keywords = [
      "finance",
      "trading",
      "stock",
      "stock trading",
      "investment",
      "market",
      "cryptocurrency",
      "crypto",
      "forex"
    ];
    return keywords.some((keyword) => query.toLowerCase().includes(keyword));
  };

  const toggleChat = () => {
    if (!isOpen) {
      // When opening the chat, introduce bounceAI.
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Hello, I'm bounceAI. How can I help you with finance or stock trading today?"
        }
      ]);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Append user's message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const query = input;
    setInput(""); // Clear the input

    // Check if the query is finance or stock trading related.
    if (!isFinancialQuestion(query)) {
      const nonFinancialMessage = {
        sender: "bot",
        text:
          "I only answer finance or stock trading related questions. Please ask something related."
      };
      setMessages((prev) => [...prev, nonFinancialMessage]);
      return;
    }

    try {
      // Call Gemini API using the SDK's generateContent method.
      const result = await model.generateContent(query);
      // According to the documentation, the generated text is available via result.response.text()
      const responseText = result.response.text();
      const botMessage = { sender: "bot", text: responseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      const errorMessage = { sender: "bot", text: "Error: " + error.message };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Function to initiate screen sharing using the browser's API.
  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      setScreenStream(stream);
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">Finance Chatbot</div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask a finance or stock trading question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button onClick={handleSend}>Send</button>
          </div>
          {/* Button to trigger screen sharing */}
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleShareScreen}>Share Screen</button>
          </div>
          {/* Display the shared screen (if any) */}
          {screenStream && (
            <div style={{ marginTop: "10px" }}>
              <p>Screen sharing active:</p>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: "100%", border: "1px solid #ccc" }}
              />
            </div>
          )}
        </div>
      )}
      <button className="chatbot-toggle-button" onClick={toggleChat}>
        {isOpen ? "X" : "?"}
      </button>
    </>
  );
};

export default Chatbot;
