// src/components/Benefits.jsx
import React, { useRef } from "react";
import Section from "./Section";
import Heading from "./Heading";
// import your local arrow icon or other styling if desired
// import Arrow from "../assets/svg/Arrow";

import { benefits } from "../constants";

const Benefits = () => {
  return (
    <Section id="features">
      <div className="container relative z-2">
        {/* Heading Title */}
        <Heading className="md:max-w-md lg:max-w-2xl" title="Podcasts" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {benefits.map((item) => (
            <PodcastCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
};

// A custom component to handle each audio item
const PodcastCard = ({ item }) => {
  const audioRef = useRef(null);

  // Handle Play
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Handle Pause
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Rewind 10 seconds
  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };

  // Forward 10 seconds
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };

  return (
    <div className="p-6 bg-n-8 rounded-xl shadow-md flex flex-col h-full">
      <h5 className="text-xl font-bold mb-3">{item.title}</h5>
      <p className="text-sm text-n-3 flex-1 mb-4">{item.text}</p>

      {/* The hidden (or not hidden) audio element */}
      <audio ref={audioRef} src={item.audioUrl} />

      {/* Custom controls */}
      <div className="flex justify-around items-center mt-4">
        <button
          onClick={handleRewind}
          className="px-4 py-2 rounded-md bg-n-7 text-n-1"
        >
          Rewind 10s
        </button>
        <button
          onClick={handlePlay}
          className="px-4 py-2 rounded-md bg-n-7 text-n-1"
        >
          Play
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 rounded-md bg-n-7 text-n-1"
        >
          Pause
        </button>
        <button
          onClick={handleForward}
          className="px-4 py-2 rounded-md bg-n-7 text-n-1"
        >
          Forward 10s
        </button>
      </div>
    </div>
  );
};

export default Benefits;
