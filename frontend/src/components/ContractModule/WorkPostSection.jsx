import React, { useState } from "react";
import { toast } from "react-toastify";
import LoaderButton from "../components/Global/LoaderButton"; // Add this import

const WorkPostSection = ({ contractHooks, currentAccount, loading, setLoading }) => {
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
  });
  const [proposalData, setProposalData] = useState({
    postId: "",
    message: "",
  });
  const [acceptData, setAcceptData] = useState({
    postId: "",
    proposalId: "",
    budget: "",
  });

  const handleChange = (e, setData, data) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleCreateWorkPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { title, description, budget, duration } = postData;
      if (!title || !description || !budget || !duration) {
        throw new Error("All fields are required");
      }
      await contractHooks.createWorkPost(title, description, budget, duration);
      toast.success("Work post created successfully!");
      setPostData({ title: "", description: "", budget: "", duration: "" });
    } catch (err) {
      toast.error(err.message || "Failed to create work post");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { postId, message } = proposalData;
      if (!postId || !message) throw new Error("Post ID and message are required");
      await contractHooks.submitProposal(postId, message);
      toast.success("Proposal submitted successfully!");
      setProposalData({ postId: "", message: "" });
    } catch (err) {
      toast.error(err.message || "Failed to submit proposal");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { postId, proposalId, budget } = acceptData;
      if (!postId || !proposalId || !budget) throw new Error("All fields are required");
      await contractHooks.acceptProposal(postId, proposalId, budget);
      toast.success("Proposal accepted successfully!");
      setAcceptData({ postId: "", proposalId: "", budget: "" });
    } catch (err) {
      toast.error(err.message || "Failed to accept proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-driver="work-post" className="bg-customDark p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">Work Posts & Proposals</h2>

      {/* Create Work Post */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create Work Post</h3>
        <form onSubmit={handleCreateWorkPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(postData).map(([key, value]) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium mb-2 capitalize">{key}</label>
              {key === "description" ? (
                <textarea
                  name={key}
                  value={value}
                  onChange={(e) => handleChange(e, setPostData, postData)}
                  className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  rows="3"
                  required
                />
              ) : (
                <input
                  type={["budget", "duration"].includes(key) ? "number" : "text"}
                  name={key}
                  value={value}
                  onChange={(e) => handleChange(e, setPostData, postData)}
                  className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
                  required
                />
              )}
            </div>
          ))}
          <LoaderButton
            onClick={handleCreateWorkPost}
            loading={loading}
            text="Create Work Post"
            color="green"
          />
        </form>
      </div>

      {/* Submit Proposal */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Submit Proposal</h3>
        <form onSubmit={handleSubmitProposal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Post ID</label>
            <input
              type="number"
              name="postId"
              value={proposalData.postId}
              onChange={(e) => handleChange(e, setProposalData, proposalData)}
              className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              value={proposalData.message}
              onChange={(e) => handleChange(e, setProposalData, proposalData)}
              className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
              rows="3"
              required
            />
          </div>
          <LoaderButton
            onClick={handleSubmitProposal}
            loading={loading}
            text="Submit Proposal"
            color="blue"
          />
        </form>
      </div>

      {/* Accept Proposal */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Accept Proposal</h3>
        <form onSubmit={handleAcceptProposal} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Post ID</label>
            <input
              type="number"
              name="postId"
              value={acceptData.postId}
              onChange={(e) => handleChange(e, setAcceptData, acceptData)}
              className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Proposal ID</label>
            <input
              type="number"
              name="proposalId"
              value={acceptData.proposalId}
              onChange={(e) => handleChange(e, setAcceptData, acceptData)}
              className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget (ETH)</label>
            <input
              type="number"
              name="budget"
              value={acceptData.budget}
              onChange={(e) => handleChange(e, setAcceptData, acceptData)}
              className="w-full bg-gray-100 p-3 rounded-md text-gray-800"
              required
            />
          </div>
          <LoaderButton
            onClick={handleAcceptProposal}
            loading={loading}
            text="Accept Proposal"
            color="purple"
          />
        </form>
      </div>
    </div>
  );
};

export default WorkPostSection;