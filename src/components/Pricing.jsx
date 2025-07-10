import { useState, useEffect } from "react";
import Section from "./Section";
import { smallSphere, stars } from "../assets";
import Heading from "./Heading";
import { db, auth } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Pricing = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(10000);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("AAPL");
  const [quantity, setQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(null);
  const [error, setError] = useState("");
  const [availableStocks, setAvailableStocks] = useState([]);
  // New state to hold the latest price for each stock in the portfolio
  const [portfolioPrices, setPortfolioPrices] = useState({});
  const [predictions, setPredictions] = useState([]);

  // Listen for auth state changes so that the user document loads on page reload,
  // and clear state when the user signs out.
  useEffect(() => {
    let unsubscribeSnapshot = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        // Check if the document exists; if not, create it and include the userId.
        getDoc(userRef).then((docSnap) => {
          if (!docSnap.exists()) {
            setDoc(userRef, {
              userId: user.uid, // <-- Store the userId inside the document.
              balance: 10000,
              portfolio: [],
              trade_history: [],
            });
          }
        });
        // Subscribe to real-time updates from Firestore.
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPortfolio(data.portfolio || []);
            setBalance(data.balance || 10000);
            setTradeHistory(data.trade_history || []);
          }
        });
      } else {
        // Clear the state when the user signs out.
        setPortfolio([]);
        setBalance(10000);
        setTradeHistory([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // Fetch tradable stocks from Alpaca API.
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("https://paper-api.alpaca.markets/v2/assets", {
          headers: { Authorization: `Bearer ${ALPACA_API_KEY}` },
        });
        const data = await response.json();
        const tradableStocks = data
          .filter((stock) => stock.tradable)
          .map((stock) => stock.symbol.toUpperCase());
        setAvailableStocks(tradableStocks);
      } catch (error) {
        console.error("Error fetching stock list:", error);
      }
    };
    fetchStocks();
  }, []);

  // Fetch latest stock price using Finnhub API for the main symbol.
  const fetchStockPrice = async (sym) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${sym}&token=cujpkahr01qgs48265ogcujpkahr01qgs48265p0`
      );
      const data = await response.json();
      if (data && data.c) {
        const price = parseFloat(data.c);
        setStockPrice(price);
        return price;
      } else {
        setStockPrice(null);
        return null;
      }
    } catch (err) {
      console.error("Error fetching stock price:", err);
      setStockPrice(null);
      return null;
    }
  };

  const predictStockPrice = async () => {
    setLoading(true);
    setPredictions([]);
    setError("");
  
    try {
      // Use environment variable for API URL, fallback to localhost for development
      const apiUrl = import.meta.env.VITE_ML_API_URL || "http://127.0.0.1:10000";
      // const apiUrl = "http://127.0.0.1:10000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
  
      // Check if the response is OK (status in the 200–299 range)
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Prediction API error:", errorData);
        setError(errorData.detail || "Prediction error");
        setLoading(false);
        return;
      }
  
      const data = await response.json();
      if (data.predictions) {
        setPredictions(data.predictions);
      } else {
        setError("Failed to get predictions");
      }
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setError("Prediction error");
    }
    setLoading(false);
  };
  

  // New helper function to fetch the current price for a given symbol.
  const fetchCurrentPriceForSymbol = async (sym) => {
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_API_KEY}`
      );
      const data = await response.json();
      if (data && data.c) {
        return parseFloat(data.c);
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error fetching current price for symbol:", sym, err);
      return null;
    }
  };

  // Whenever the symbol changes, update the current price.
  useEffect(() => {
    if (symbol) {
      fetchStockPrice(symbol);
    }
  }, [symbol]);

  // Periodically fetch current prices for all stocks in the portfolio.
  useEffect(() => {
    const fetchPrices = async () => {
      const newPrices = {};
      for (const stock of portfolio) {
        const currentPrice = await fetchCurrentPriceForSymbol(stock.symbol);
        newPrices[stock.symbol] = currentPrice;
      }
      setPortfolioPrices(newPrices);
    };

    // Fetch immediately on mount or when the portfolio changes.
    fetchPrices();
    // Set up an interval to refresh every 10 seconds (adjust as needed).
    const intervalId = setInterval(() => {
      fetchPrices();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [portfolio]);

  // Buy stock function.
  const buyStock = async () => {
    if (!symbol || quantity <= 0) {
      setError("Enter a valid stock symbol and quantity.");
      return;
    }

    const latestPrice = await fetchStockPrice(symbol);
    if (!latestPrice) {
      setError("Unable to retrieve price for the selected stock.");
      return;
    }

    setError("");
    setLoading(true);
    const cost = latestPrice * quantity;
    if (cost > balance) {
      setError("Insufficient balance.");
      setLoading(false);
      return;
    }

    // Update portfolio: either add a new entry or update an existing one.
    const existingIndex = portfolio.findIndex((item) => item.symbol === symbol);
    let newPortfolio;
    if (existingIndex !== -1) {
      const existingStock = portfolio[existingIndex];
      const totalShares = existingStock.quantity + quantity;
      const newAvgPrice =
        (existingStock.price * existingStock.quantity + latestPrice * quantity) / totalShares;
      newPortfolio = [...portfolio];
      newPortfolio[existingIndex] = { symbol, quantity: totalShares, price: newAvgPrice };
    } else {
      newPortfolio = [...portfolio, { symbol, quantity, price: latestPrice }];
    }

    const newBalance = balance - cost;
    const tradeEntry = {
      symbol,
      action: "BUY",
      price: latestPrice,
      shares: quantity,
      timestamp: Date.now(),
    };

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        portfolio: newPortfolio,
        balance: newBalance,
        trade_history: arrayUnion(tradeEntry),
      });
    }

    setQuantity(1);
    setLoading(false);
  };

  // Sell stock function.
  const sellStock = async () => {
    if (!symbol || quantity <= 0) {
      setError("Enter a valid stock symbol and quantity.");
      return;
    }

    const latestPrice = await fetchStockPrice(symbol);
    if (!latestPrice) {
      setError("Unable to retrieve price for the selected stock.");
      return;
    }

    setError("");
    setLoading(true);

    // Check if the stock exists in the portfolio and if there are enough shares to sell.
    const portfolioEntry = portfolio.find((item) => item.symbol === symbol);
    if (!portfolioEntry) {
      setError("You do not own any shares of this stock.");
      setLoading(false);
      return;
    }
    if (portfolioEntry.quantity < quantity) {
      setError("You do not have enough shares to sell.");
      setLoading(false);
      return;
    }

    let newPortfolio;
    if (portfolioEntry.quantity === quantity) {
      newPortfolio = portfolio.filter((item) => item.symbol !== symbol);
    } else {
      newPortfolio = portfolio.map((item) => {
        if (item.symbol === symbol) {
          return { ...item, quantity: item.quantity - quantity };
        }
        return item;
      });
    }

    const saleProceeds = latestPrice * quantity;
    const newBalance = balance + saleProceeds;
    const tradeEntry = {
      symbol,
      action: "SELL",
      price: latestPrice,
      shares: quantity,
      timestamp: Date.now(),
    };

    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        portfolio: newPortfolio,
        balance: newBalance,
        trade_history: arrayUnion(tradeEntry),
      });
    }

    setQuantity(1);
    setLoading(false);
  };

  // Compute recent trades (only the last 5 transactions, sorted by timestamp descending).
  const recentTrades = [...tradeHistory]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <Section className="overflow-hidden relative" id="pricing">
      <div className="container relative z-10">
        {/* Background Sphere & Stars */}
        <div className="hidden relative justify-center mb-24 lg:flex">
          <img src={smallSphere} className="relative z-1" width={255} height={255} alt="Sphere" />
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img src={stars} className="w-full" width={950} height={400} alt="Stars" />
          </div>
        </div>

        {/* Heading */}
        <Heading tag="Trade with Virtual Money" title="Start Paper Trading Today" />

        {/* TradingView Chart */}
        <div className="mt-6 flex flex-col items-center">
          <iframe
            src={`https://s.tradingview.com/embed-widget/advanced-chart/?symbol=${symbol}&theme=dark`}
            title="TradingView Chart"
            frameBorder="0"
            allowTransparency="true"
            allowFullScreen
            className="w-full mt-4 h-96"
          ></iframe>
        </div>

        {/* Paper Trading Section */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl text-white shadow-lg mt-10">
          <h2 className="text-xl font-semibold text-center mb-4">📈 Paper Trading</h2>
          <p className="text-lg text-center mb-4 font-medium">
            💰 Balance: <span className="text-yellow-400">${balance.toFixed(2)}</span>
          </p>

          <div className="flex flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Stock Symbol (e.g., AAPL)"
              className="w-1/4 px-4 py-2 rounded-lg text-white bg-gray-800"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-1/4 px-4 py-2 rounded-lg text-white bg-gray-800"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md"
              onClick={buyStock}
              disabled={loading}
            >
              Buy
            </button>
            <button
              className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md"
              onClick={sellStock}
              disabled={loading}
            >
              Sell
            </button>
            <button
              className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow-md"
              onClick={predictStockPrice}
              disabled={loading}
            >
              Predict 3-Day Price
            </button>
            <ul>
              {predictions.map((pred, index) => (
                <li key={index} className="text-center text-yellow-400">
                  {pred.date}: ${pred.predicted_close}
                </li>
              ))}
            </ul>
          </div>

          {/* Display current stock price */}
          <p className="text-lg text-center mt-4">
            Current Price:{" "}
            <span className="text-yellow-400">
              ${stockPrice !== null ? stockPrice.toFixed(2) : "Loading..."}
            </span>
          </p>

          {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        </div>

        {/* Portfolio Section */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl text-white shadow-lg mt-10">
          <h2 className="text-xl font-semibold text-center mb-4">Your Portfolio</h2>
          {portfolio.length === 0 ? (
            <p className="text-center">No stocks in portfolio.</p>
          ) : (
            <table className="min-w-full text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Avg. Price</th>
                  <th className="px-4 py-2">Profit Margin (%)</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((stock, index) => {
                  // Calculate profit margin if current price is available.
                  const currentPrice = portfolioPrices[stock.symbol];
                  const profitMargin =
                    currentPrice !== undefined && currentPrice !== null
                      ? ((currentPrice - stock.price) / stock.price) * 100
                      : 0.00;
                  return (
                    <tr key={index}>
                      <td className="border px-4 py-2">{stock.symbol}</td>
                      <td className="border px-4 py-2">{stock.quantity}</td>
                      <td className="border px-4 py-2">${stock.price.toFixed(2)}</td>
                      <td className="border px-4 py-2">
                        {profitMargin !== null ? (
                          <span
                            className={
                              profitMargin > 0
                                ? "text-green-500"
                                : profitMargin < 0
                                ? "text-red-500"
                                : ""
                            }
                          >
                            {profitMargin.toFixed(2)}%
                          </span>
                        ) : (
                          "Loading..."
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Transaction History Section */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 rounded-xl text-white shadow-lg mt-10">
          <h2 className="text-xl font-semibold text-center mb-4">Transaction History</h2>
          {recentTrades.length === 0 ? (
            <p className="text-center">No transactions yet.</p>
          ) : (
            <table className="min-w-full text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Shares</th>
                  <th className="px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      {new Date(trade.timestamp).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{trade.symbol}</td>
                    <td className="border px-4 py-2">{trade.action}</td>
                    <td className="border px-4 py-2">{trade.shares}</td>
                    <td className="border px-4 py-2">${trade.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Pricing;
