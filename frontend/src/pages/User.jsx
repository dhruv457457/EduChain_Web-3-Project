import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useWallet } from "../components/Global/WalletContext";
import useUsernameRegistry from "../hooks/useUsernameRegistry";
import Loader from "../components/Global/Loader";
import { LayoutDashboard, UserCircle, FileText, MonitorCheck, ReceiptJapaneseYen, PoundSterlingIcon } from "lucide-react";
import UserDashboard from "../components/UserModule/UserDashboard";
import ProfileSettings from "../components/UserModule/ProfileSettings";
import Contract from "./Contract";
import Transfer from "./Transfer";
import Jobs from "./Jobs";
import Proposals from "../components/JobsModule/Proposals";

const User = () => {
  const { walletData } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useUsernameRegistry(walletData?.provider);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isLoading, setIsLoading] = useState(true);

  const sidebarSections = [
    { title: "Dashboard", icon: <LayoutDashboard size={18} />, path: "dashboard" },
    { title: "Profile", icon: <UserCircle size={18} />, path: "profile" },
    { title: "Transfer", icon: <MonitorCheck size={18} />, path: "transfer" },
    { title: "Tasks", icon: <ReceiptJapaneseYen size={18} />, path: "tasks" },
    { title: "Proposals", icon: <PoundSterlingIcon size={18} />, path: "proposals" },
    { title: "Contracts", icon: <FileText size={18} />, path: "contracts" },
  ];

  useEffect(() => {
    if (!walletData?.provider) {
      toast.error("⚠️ Please connect your wallet to access the dashboard.");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setIsLoading(false);
    }
  }, [walletData, navigate]);

  useEffect(() => {
    const sectionFromUrl = location.hash.replace("#", "");
    const currentSection = sidebarSections.find(s => s.path === sectionFromUrl);
    if (currentSection) {
      setActiveSection(currentSection.title);
    } else {
      // Default to dashboard if hash is invalid or not present
      setActiveSection("Dashboard");
    }
  }, [location.hash]);

  const handleSectionClick = (section) => {
    setActiveSection(section.title);
    navigate(`/user#${section.path}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "Dashboard":
        return <UserDashboard />;
      case "Profile":
        return <ProfileSettings />;
      case "Transfer":
        return <Transfer />;
      case "Tasks":
        return <Jobs/>;
      case "Proposals":
        return <Proposals/>;
      case "Contracts":
        return <Contract />;
      default:
        return <UserDashboard />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0D0A2C] h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-[#0D0A2C] text-white h-screen flex flex-col">
      <ToastContainer position="top-right" autoClose={5000} />
       {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(43,48,136,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(43,48,136,0.15),transparent_50%)]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      <div className="h-20 flex-shrink-0"></div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 p-6">
          <div className="sticky top-6">
            <h2 className="text-lg font-bold mb-4 pl-3 text-gray-200">
              My Account
            </h2>
            <nav className="flex flex-col gap-1">
              {sidebarSections.map((section) => (
                <button
                  key={section.title}
                  onClick={() => handleSectionClick(section)}
                  className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.title
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              {activeSection}
            </h1>
            {activeSection === "Dashboard" && (
              <p className="text-gray-400 mt-2">
                Welcome back,{" "}
                <span className="text-primary">{username || "User"}</span>. Here
                is your overview.
              </p>
            )}
          </header>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default User;