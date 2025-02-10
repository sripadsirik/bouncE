import { useState, useEffect } from "react";
import Section from "./Section";
import Heading from "./Heading";

const Services = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Using Finnhub's news API for general market news
        const res = await fetch(
          "https://finnhub.io/api/v1/news?category=general&token=cujpkahr01qgs48265ogcujpkahr01qgs48265p0"
        );
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        // Take only the first 6 most recent articles.
        setArticles(data.slice(0, 6));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Section id="news">
      <div className="container">
        <Heading
          title="Latest Market News"
          text="Stay updated with the latest market news"
        />

        {loading ? (
          <p className="body-2">Loading articles...</p>
        ) : error ? (
          <p className="body-2 text-red-500">Error: {error}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <div
                key={index}
                className="water-animation p-4 rounded-3xl overflow-hidden flex flex-col text-white shadow-lg border-4 border-black"
              >
                {article.image && (
                  <div className="relative h-48 w-full">
                    <img
                      src={article.image}
                      alt={article.headline}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="h4 mb-2">{article.headline}</h4>
                  <p className="body-2 mb-4 flex-1">{article.summary}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 mt-auto hover:underline"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inline CSS for water animation with an enhanced ripple effect */}
      <style jsx>{`
        @keyframes water {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
  
        .water-animation {
          /* Water-like gradient background animation */
          background: linear-gradient(45deg, #1e3a8a, #1e40af, #1e3a8a);
          background-size: 200% 200%;
          animation: water 5s ease infinite;
          position: relative;
          overflow: hidden;
        }
        .water-animation::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.4) 20%,
            transparent 70%
          );
          transform: translate(-50%, -50%) scale(0);
        }
      `}</style>
    </Section>
  );
};

export default Services;
