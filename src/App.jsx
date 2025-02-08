import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Services from "./components/Services";
import Fish from "./components/Fish";

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header /> 
        <Hero />
        <Benefits />
        {/* <Collaboration /> */}
        <Services /> {/* This is the news page */}
        <Pricing /> {/* This is the paper trading page */}
        <Footer />
      </div>

      {/* Coral Reef Strings Container */}
      <div className="coral-reef-container">
        <div className="coral-reef"></div>
        <div className="coral-reef"></div>
        <div className="coral-reef"></div>
        <div className="coral-reef"></div>
        <div className="coral-reef"></div>
      </div>
    </>
  );
};

export default App;
