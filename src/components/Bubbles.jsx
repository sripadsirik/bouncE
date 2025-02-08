const Bubbles = () => {
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
        {[...Array(15)].map((_, i) => {
          const randomSize = Math.random() * 40 + 10; // Random size (10px - 50px)
          const randomLeft = Math.random() * 100; // Random left position
          const randomSpeed = Math.random() * 10 + 5; // Random speed (5s - 15s)
  
          return (
            <div
              key={i}
              className="absolute bg-white bg-opacity-30 rounded-full"
              style={{
                width: `${randomSize}px`,
                height: `${randomSize}px`,
                left: `${randomLeft}%`,
                bottom: "-50px",
                animation: `bubbleRise ${randomSpeed}s infinite ease-in-out`,
              }}
            />
          );
        })}
      </div>
    );
  };
  
  export default Bubbles;
  