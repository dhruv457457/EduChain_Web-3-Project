import React, { useState } from "react";
import {
  Wallet,
  ExternalLink,
  Download,
  CheckCircle,
  ArrowRight,
  UserPlus,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("Installing MetaMask");

  const addChainToMetaMask = async () => {
    // Logic for adding chain remains unchanged
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xa045c",
              chainName: "OpenCampus Codex Sepolia",
              nativeCurrency: { name: "EDU", symbol: "EDU", decimals: 18 },
              rpcUrls: ["https://open-campus-codex-sepolia.drpc.org"],
              blockExplorerUrls: ["https://opencampus-codex.blockscout.com"],
            },
          ],
        });
      } catch (error) {
        console.error(error);
        alert("Failed to add network to MetaMask. Please add it manually.");
      }
    } else {
      alert("MetaMask is not installed. Please install it first.");
    }
  };

  const docsSections = [
    {
      title: "Installing MetaMask",
      icon: <Download size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            MetaMask is a crypto wallet and gateway to blockchain apps. Follow
            these steps to install it.
          </p>
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-2 text-primary">
                1. Install Browser Extension
              </h3>
              <p className="text-gray-300 mb-3">
                Visit the official MetaMask website and download the extension
                for your browser (Chrome, Firefox, etc.).
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1 text-sm font-semibold"
              >
                Download MetaMask <ExternalLink size={16} />
              </a>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-2 text-primary">
                2. Create a Wallet
              </h3>
              <p className="text-gray-300 mb-3">
                Once installed, follow the on-screen instructions to create your
                new wallet. Remember to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                <li>Securely save your Secret Recovery Phrase.</li>
                <li>Create a strong, unique password.</li>
                <li>Never share your recovery phrase with anyone.</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Getting Test Tokens",
      icon: <Wallet size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            You'll need test tokens (faucet) to interact with the test network.
          </p>
          <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Use a Faucet
            </h3>
            <p className="text-gray-300 mb-3">
              Visit a public faucet for the Sepolia test network. You will need
              to enter your wallet address to receive free test ETH.
            </p>
            <a
              href="https://www.alchemy.com/faucets/ethereum-sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 text-sm font-semibold"
            >
              Go to Sepolia Faucet <ExternalLink size={16} />
            </a>
          </div>
        </>
      ),
    },
    {
      title: "Making Transactions",
      icon: <ArrowRight size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            Dkarma makes sending crypto easy and secure.
          </p>
          <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Username or Address
            </h3>
            <p className="text-gray-300 mb-3">
              You can send funds using either a traditional wallet address or a
              registered Dkarma username.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>Navigate to the "Transfer" page.</li>
              <li>
                Select whether you're sending to a username or an address.
              </li>
              <li>Enter the recipient, amount, and an optional message.</li>
              <li>Confirm the transaction in your MetaMask wallet.</li>
            </ul>
          </div>
        </>
      ),
    },
    {
      title: "Register as User",
      icon: <UserPlus size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            Register a unique username to make transactions simpler for others.
          </p>
          <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              How to Register
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>Go to your "Profile" page from the navigation bar.</li>
              <li>You will see a "User Profile" section.</li>
              <li>Enter your desired username and click "Register".</li>
              <li>Confirm the transaction in MetaMask.</li>
              <li>
                Once confirmed, your username is linked to your wallet address.
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      title: "Understanding Contracts",
      icon: <BookOpen size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            Our Smart Work Commitment (SWC) system ensures trust and security
            for agreements on the blockchain.
          </p>
          <div className="space-y-6">
            <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-2 text-primary">
                Key Features
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
                <li>
                  Funds are held in escrow and released upon milestone approval.
                </li>
                <li>Both parties must approve actions, ensuring fairness.</li>
                <li>Completed contracts positively impact your reputation.</li>
              </ul>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
              <h3 className="font-semibold text-lg mb-2 text-primary">
                Reputation Score
              </h3>
              <p className="text-gray-300 text-sm">
                Your score reflects your reliability. Successfully completing
                contracts boosts your score, making you a more trusted partner
                in the ecosystem.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      title: "How Dkarma Works",
      icon: <HelpCircle size={18} />,
      content: (
        <>
          <p className="text-gray-400 mb-6">
            Dkarma is a decentralized application that leverages blockchain
            for secure, transparent, and user-friendly financial interactions.
          </p>
          <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50">
            <h3 className="font-semibold text-lg mb-2 text-primary">
              Core Concepts
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>
                <strong>Wallet Connection:</strong> Securely connect with
                MetaMask.
              </li>
              <li>
                <strong>Usernames:</strong> Simplify transactions with
                easy-to-remember names.
              </li>
              <li>
                <strong>Smart Contracts:</strong> Automate agreements and
                payments with our SWC system.
              </li>
              <li>
                <strong>Reputation:</strong> Build on-chain credibility with
                every successful interaction.
              </li>
            </ul>
          </div>
        </>
      ),
    },
  ];

  const currentContent =
    docsSections.find((s) => s.title === activeSection)?.content || null;

  return (
    <div className="bg-[#0D0A2C] min-h-screen text-white pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(43,48,136,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(43,48,136,0.15),transparent_50%)]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
      
      <div className=" mx-auto flex flex-col lg:flex-row gap-8 px-4 sm:px-6 lg:px-8 py-10">
        {/* Sidebar */}
        <aside className="lg:w-52 lg:sticky top-24 self-start">
          <h2 className="text-lg font-bold mb-4 pl-3">Documentation</h2>
          <nav className="flex flex-col gap-1">
            {docsSections.map((section) => (
              <button
                key={section.title}
                onClick={() => setActiveSection(section.title)}
                className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.title
                    ? "bg-primary/80 text-white"
                    : "text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6 sm:p-8 rounded-lg">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              {activeSection}
            </h1>
            {currentContent}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Docs;
