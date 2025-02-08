const Fish = () => {
  const fishImages = [
    "https://upload.wikimedia.org/wikipedia/commons/3/3a/Clown_fish_transparent.png", // 🐠 Clownfish
    "https://upload.wikimedia.org/wikipedia/commons/a/a2/Paracanthurus_hepatus_%28transparent%29.png", // 🐟 Blue Tang (Dory)
    "https://upload.wikimedia.org/wikipedia/commons/f/f3/Zebrasoma_flavescens_%28transparent%29.png", // 🟡 Yellow Tang
    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Pterophyllum_scalare.png", // 🎨 Angelfish
    "https://upload.wikimedia.org/wikipedia/commons/e/e1/Betta_fish_transparent.png", // 🔵 Betta Fish
  ];
  
    return (
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[-1]">
        {[...Array(5)].map((_, i) => {
          const randomSize = Math.random() * 50 + 50; // Random fish size (50px - 100px)
          const randomSpeed = Math.random() * 15 + 5; // Random speed (5s - 20s)
          const randomTop = Math.random() * 80 + 10; // Random position (10% - 90%)
  
          return (
            <img
              key={i}
              src={fishImages[Math.floor(Math.random() * fishImages.length)]}
              alt="Swimming Fish"
              className="absolute fish-animation"
              style={{
                top: `${randomTop}%`,
                width: `${randomSize}px`,
                animationDuration: `${randomSpeed}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          );
        })}
      </div>
    );
  };
  
  export default Fish;
  