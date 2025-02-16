import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useContract from "../hooks/useContract";
import { FaUserTie, FaEthereum } from "react-icons/fa";

const Freelancer = () => {
  const { getCryptifyContract } = useContract();
  const [freelancers, setFreelancers] = useState([]);
  const [formData, setFormData] = useState({ name: "", skills: "", profileLink: "", hourlyRate: "" });
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [contractData, setContractData] = useState({ amount: "", duration: "" });
  const [showForm, setShowForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const contract = await getCryptifyContract();
      const freelancersList = await contract.getAllFreelancers();
      setFreelancers(freelancersList);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    }
    setLoading(false);
  };

  const registerFreelancer = async () => {
    setLoading(true);
    try {
      const contract = await getCryptifyContract();
      await contract.registerFreelancer(formData.name, formData.skills, formData.profileLink, formData.hourlyRate);
      alert("Freelancer registered successfully!");
      setShowForm(false);
      fetchFreelancers();
    } catch (error) {
      console.error("Error registering freelancer:", error);
    }
    setLoading(false);
  };

  const hireFreelancer = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowProfileModal(true);
  };

  const createContract = async () => {
    setLoading(true);
    try {
      const contract = await getCryptifyContract();
      await contract.createContract(selectedFreelancer.wallet, contractData.amount, contractData.duration, { value: contractData.amount });
      alert("Contract created successfully!");
      setShowProfileModal(false);
    } catch (error) {
      console.error("Error creating contract:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-customSemiPurple min-h-screen px-6 py-24 text-white">
        <h1 className="text-customPurple text-5xl font-bold text-center mb-12">Freelancing Marketplace</h1>

        {/* Be a Freelancer Button */}
        <div className="flex justify-center">
          <button className="bg-customBlue px-6 py-3 rounded-lg text-white font-bold hover:bg-opacity-80 transition" onClick={() => setShowForm(true)}>
            Be a Freelancer
          </button>
        </div>

        {/* Freelancer Registration Form Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-[#1D0A2D] p-6 rounded-lg w-96 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">Register as a Freelancer</h3>
              <input type="text" placeholder="Name" className="w-full p-2 mb-3 rounded bg-gray-800 text-white" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input type="text" placeholder="Skills" className="w-full p-2 mb-3 rounded bg-gray-800 text-white" onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
              <input type="text" placeholder="Portfolio (YouTube/Website)" className="w-full p-2 mb-3 rounded bg-gray-800 text-white" onChange={(e) => setFormData({ ...formData, profileLink: e.target.value })} />
              <input type="number" placeholder="Hourly Rate (ETH)" className="w-full p-2 mb-3 rounded bg-gray-800 text-white" onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })} />
              <div className="flex justify-between">
                <button className="bg-customBlue px-4 py-2 rounded text-white font-semibold hover:bg-opacity-80" onClick={registerFreelancer} disabled={loading}>
                  {loading ? "Registering..." : "Submit"}
                </button>
                <button className="bg-red-500 px-4 py-2 rounded text-white font-semibold hover:bg-opacity-80" onClick={() => setShowForm(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Freelancer List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          {loading ? (
            <p className="text-center text-xl">Loading freelancers...</p>
          ) : (
            freelancers.map((freelancer, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-lg text-center transition transform hover:scale-105">
                <FaUserTie className="text-customBlue text-4xl mb-2 mx-auto" />
                <h4 className="text-xl font-bold">{freelancer.name}</h4>
                <p className="text-sm">Skills: {freelancer.skills}</p>
                <p className="text-sm flex items-center justify-center gap-2 mt-2">
                  <FaEthereum /> {freelancer.hourlyRate} ETH/hr
                </p>
                <button className="mt-4 bg-customBlue px-4 py-2 rounded text-white font-semibold hover:bg-opacity-80 transition" onClick={() => hireFreelancer(freelancer)}>
                  View Profile
                </button>
              </div>
            ))
          )}
        </div>

        {/* Freelancer Profile & Hiring Modal */}
        {showProfileModal && selectedFreelancer && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-[#1D0A2D] p-6 rounded-lg w-96 shadow-lg text-center">
              <h3 className="text-xl font-bold text-white mb-2">{selectedFreelancer.name}</h3>
              <p className="text-white">Skills: {selectedFreelancer.skills}</p>
              <p className="text-white">Hourly Rate: {selectedFreelancer.hourlyRate} ETH</p>
              <a href={selectedFreelancer.profileLink} target="_blank" rel="noopener noreferrer" className="text-customBlue underline">View Portfolio</a>

              <div className="mt-4">
                <h4 className="text-lg text-white font-bold mb-2">Hire {selectedFreelancer.name}</h4>
                <input type="number" placeholder="Amount (ETH)" className="w-full p-2 mb-2 rounded bg-gray-800 text-white" onChange={(e) => setContractData({ ...contractData, amount: e.target.value })} />
                <input type="number" placeholder="Duration (Days)" className="w-full p-2 mb-3 rounded bg-gray-800 text-white" onChange={(e) => setContractData({ ...contractData, duration: e.target.value })} />
                <button className="bg-customBlue px-4 py-2 rounded text-white font-semibold hover:bg-opacity-80 transition" onClick={createContract} disabled={loading}>
                  {loading ? "Processing..." : "Create Contract"}
                </button>
              </div>

              <button className="mt-4 bg-red-500 px-4 py-2 rounded text-white font-semibold hover:bg-opacity-80 transition" onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Freelancer;
