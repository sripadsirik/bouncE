import React, { useRef, useState, useMemo, useEffect } from "react";
import { ScrollParallax } from "react-just-parallax";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { curve, heroBackground, robot } from "../assets";
import { heroIcons } from "../constants";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";

// Replace with your actual Gemini API key (development only!)
// For production, place it in environment variables or a secure vault.
const GEMINI_API_KEY = "AIzaSyCc23ewgKDb9Kjo0l-yOPSiCfh8x4-dp78";

const Hero = () => {
  // Hero layout references
  const parallaxRef = useRef(null);

  // Chatbot states
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Screen-sharing
  const [screenStream, setScreenStream] = useState(null);
  const videoRef = useRef(null);

  // Initialize the Gemini model
  const model = useMemo(() => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }, []);

  // Attach screen stream to video
  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  // Only handle finance/trading questions
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
      "forex",
    ];
    return keywords.some((keyword) =>
      query.toLowerCase().includes(keyword)
    );
  };

  // Open/close the chat
  const toggleChat = () => {
    if (!isOpen) {
      // Greet on opening
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Hello, I'm bounceAI. How can I help you with finance or stock trading today?"
        }
      ]);
    }
    setIsOpen(!isOpen);
  };

  // Handle message send
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Check if question is finance related
   

    try {
      const result = await model.generateContent(userMessage.text);
      const responseText = result.response.text();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: responseText }
      ]);
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: " + error.message }
      ]);
    }
  };

  // Screen sharing
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
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* ===== HERO LAYOUT ===== */}
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6">
            Trading with{" "}
            <span className="inline-block relative">
              bouncE{" "}
              <img
                src={curve}
                className="absolute top-full left-0 w-full xl:-mt-2"
                width={624}
                height={28}
                alt="Curve"
              />
            </span>
          </h1>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
            Learn how to trade with AI and predict stocks.
          </p>
          <Button href="/pricing" white>
            Get started
          </Button>
        </div>

        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className="relative bg-n-8 rounded-[1rem]">
              <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

              <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                <img
                  src={robot}
                  className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                  width={1024}
                  height={490}
                  alt="AI"
                />
                <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                <ScrollParallax isAbsolutelyPositioned>
                  <ul className="hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl xl:flex">
                    {heroIcons.map((icon, index) => (
                      <li className="p-5" key={index}>
                        <img src={icon} width={24} height={25} alt="icon" />
                      </li>
                    ))}
                  </ul>
                </ScrollParallax>

                <ScrollParallax isAbsolutelyPositioned>
                  <Notification
                    className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                    title="AI Help"
                  />
                </ScrollParallax>
              </div>
            </div>

            <Gradient />
          </div>
          <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
            <img
              src={heroBackground}
              className="w-full"
              width={1440}
              height={1800}
              alt="hero"
            />
          </div>

          {/* <BackgroundCircles /> */}
        </div>

        <CompanyLogos className="hidden relative z-10 mt-20 lg:block" />
      </div>

      <BottomLine />

      {/* ===== CHATBOT UI ===== */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "340px",
            height: "500px",
            backgroundColor: "#2D2D2D",
            color: "#F1F1F1",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            border: "1px solid #444",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#444",
              color: "#fff",
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              fontWeight: "bold",
            }}
          >
            bounceAI (Finance Chatbot)
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((msg, index) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: isBot ? "row" : "row-reverse",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isBot ? "#444" : "#007bff",
                      color: "#fff",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      maxWidth: "70%",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div
            style={{
              padding: "10px",
              borderTop: "1px solid #444",
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              type="text"
              placeholder="Ask about stocks..."
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #555",
                backgroundColor: "#1F1F1F",
                color: "#FFF",
                borderRadius: "4px",
                outline: "none",
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                color: "#fff",
                padding: "0 15px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
            <button
              onClick={handleShareScreen}
              style={{
                backgroundColor: "#555",
                border: "none",
                color: "#fff",
                padding: "0 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Share
            </button>
          </div>

          {/* Screen share video preview */}
          {screenStream && (
            <div
              style={{
                padding: "10px",
                borderTop: "1px solid #444",
              }}
            >
              <p style={{ marginBottom: "4px" }}>Screen sharing active:</p>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{
                  width: "100%",
                  border: "1px solid #333",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "1.2rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        }}
        onClick={toggleChat}
      >
        {isOpen ? "X" : "?"}
      </button>
    </Section>
  );
};

export default Hero;
