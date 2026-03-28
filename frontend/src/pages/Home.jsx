import Header from "../components/HomeModule/Header";
import AnimatedBeamDemo from "../components/HomeModule/AnimatedBeamDemo";
import PricingTable from "../components/HomeModule/PricingTable";
import { Footer } from "../components/HomeModule/Footer";
import Chatbot from "../components/Global/Chatbot";

const Home = () => {
  return (
    <div className="bg-[#0B0E1F] w-full relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      {/* All content below will now be covered by the background */}
      <Header />
      <AnimatedBeamDemo />
      <PricingTable />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Home;
