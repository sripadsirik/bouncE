import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Podcasts",
    url: "#features",
  },
  {
    id: "1",
    title: "Financial News",
    url: "#collaboration",
  },
  {
    id: "2",
    title: "Paper Trading",
    url: "#pricing",
  },
  
  {
    id: "3",
    title: "Sign in",
    url: "#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [];

export const brainwaveServices = [
  "Photo generating",
  "Photo enhance",
  "Seamless Integration",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "Voice recognition",
    text: "Enable the chatbot to understand and respond to voice commands, making it easier for users to interact with the app hands-free.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Gamification",
    text: "Add game-like elements, such as badges or leaderboards, to incentivize users to engage with the chatbot more frequently.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Chatbot customization",
    text: "Allow users to customize the chatbot's appearance and behavior, making it more engaging and fun to interact with.",
    date: "May 2023",
    status: "done",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "Integration with APIs",
    text: "Allow the chatbot to access external data sources, such as weather APIs or news APIs, to provide more relevant recommendations.",
    date: "May 2023",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With smart automation and top-notch security, it's the perfect solution for teams looking to work smarter.";

export const collabContent = [
  {
    id: "0",
    title: "Seamless Integration",
    text: collabText,
  },
  {
    id: "1",
    title: "Smart Automation",
  },
  {
    id: "2",
    title: "Top-notch Security",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const pricing = [
  {
    id: "0",
    title: "Basic",
    description: "AI chatbot, personalized recommendations",
    price: "0",
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
  {
    id: "1",
    title: "Premium",
    description: "Advanced AI chatbot, priority support, analytics dashboard",
    price: "9.99",
    features: [
      "An advanced AI chatbot that can understand complex queries",
      "An analytics dashboard to track your conversations",
      "Priority support to solve issues quickly",
    ],
  },
  {
    id: "2",
    title: "Enterprise",
    description: "Custom AI chatbot, advanced analytics, dedicated account",
    price: null,
    features: [
      "An AI chatbot that can understand your queries",
      "Personalized recommendations based on your preferences",
      "Ability to explore the app and its features without any cost",
    ],
  },
];

// src/constants/index.js

export const benefits = [
  {
    id: 1,
    title: "Basic Investing",
    text: "This text from 'Basic Investing.pdf' provides a foundational understanding of investing, differentiating it from saving and emphasizing the potential for higher returns but also acknowledging the risk of loss...",
    audioUrl: "/public/audio/Basic Investing.mp3" // <-- or wherever your file truly lives
  },
  {
    id: 2,
    title: "Stock Investing",
    text: "The first source, excerpted from 'Stock-Investing-101-eBook.pdf,' is an introductory guide to stock market investing. It emphasizes identifying high-quality companies with strong 'economic moats' and long-term growth potential...",
    audioUrl: "/public/audio/Stock Investing 101.mp3"
  },
  {
    id: 3,
    title: "Technical Analysis",
    text: "This ninth edition of Technical Analysis of Stock Trends by Edwards and Magee expands upon previous editions, updating chapters on portfolio and risk management and adding a new chapter on long-term investing...",
    audioUrl: "/public/audio/technical analysis.mp3"
  }
];


// export const  Benefits = [
//   {
//     id: 1,
//     title: "Basic Investing",
//     text: "This text from 'Basic Investing.pdf' provides a foundational understanding of investing, differentiating it from saving and emphasizing the potential for higher returns but also acknowledging the risk of loss. It explains various investment types, including stocks, bonds, and cash equivalents, and introduces mutual funds and ETFs. Furthermore, the text details strategies for successful investing, such as dollar-cost averaging, long-term investing, emotional detachment, diversification, and regular portfolio evaluation. Finally, it lists resources for further learning.",
//     audioUrl: "../assets/audio/chill-vibes.mp3", // Update this path as needed
//   },
//   {
//     id: 2,
//     title: "Stock Investing",
//     text: "The first source, excerpted from 'Stock-Investing-101-eBook.pdf,' is an introductory guide to stock market investing. It emphasizes identifying high-quality companies with strong 'economic moats' and long-term growth potential, using fundamental analysis to assess a company's value and profitability. The guide presents several investing rules and examples to illustrate key concepts. The second source, from 'edwards-magee-technical-analysis-of-stock-trends-9th-edition.pdf,' focuses on technical analysis for stock trading. It explains various chart patterns, such as head-and-shoulders and triangles, to predict market trends and identify potential buying and selling opportunities. The text also covers risk management strategies and the use of different chart types and technical indicators.",
//     audioUrl: "../assets/audio/upbeat-energy.mp3", // Update this path as needed
//   },
//   {
//     id: 3,
//     title: "Technical Analysis",
//     text: "This ninth edition of Technical Analysis of Stock Trends by Edwards and Magee expands upon previous editions, updating chapters on portfolio and risk management and adding a new chapter on long-term investing. The book thoroughly explains classical technical analysis, focusing on chart patterns like head-and-shoulders formations, triangles, and trendlines to identify market trends and predict price movements. It also explores concepts such as support and resistance levels, volume analysis, and the use of moving averages. The text further discusses trading strategies and tactics, including risk management techniques and the use of modern investment instruments like index shares and futures. Finally, an appendix provides additional technical indicators.",
//     audioUrl: "../assets/audio/ambient-sounds.mp3", // Update this path as needed
//   },
// ];

export const socials = [
  // {
  //   id: "0",
  //   title: "Discord",
  //   iconUrl: discordBlack,
  //   url: "#",
  // },
  // {
  //   id: "1",
  //   title: "Twitter",
  //   iconUrl: twitter,
  //   url: "#",
  // },
  // {
  //   id: "2",
  //   title: "Instagram",
  //   iconUrl: instagram,
  //   url: "#",
  // },
  // {
  //   id: "3",
  //   title: "Telegram",
  //   iconUrl: telegram,
  //   url: "#",
  // },
  // {
  //   id: "4",
  //   title: "Facebook",
  //   iconUrl: facebook,
  //   url: "#",
  // },
];
