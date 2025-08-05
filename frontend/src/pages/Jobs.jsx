import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import PostJobs from "../components/JobsModule/PostJobs";
import JobDetails from "../components/JobsModule/JobDetails";
import { toast } from "react-toastify";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobPosted = () => {
    fetchJobs(); // Refresh the jobs list
  };

  const handleApplyNow = (job) => {
    setSelectedJob(job);
  };

  const handleCloseJobDetails = () => {
    setSelectedJob(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-500";
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Post Jobs Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Jobs</h1>
            <p className="text-gray-400">Find the perfect blockchain project to work on</p>
          </div>
          <PostJobs onJobPosted={handleJobPosted} />
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-4">No jobs available</div>
            <p className="text-gray-500">Be the first to post a job!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {job.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Budget:</span>
                    <span className="text-white font-semibold">
                      {job.budget} ETH
                    </span>
                  </div>

                  {job.skills && (
                    <div>
                      <span className="text-gray-400 text-sm">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {job.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.deadline && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Deadline:</span>
                      <span className="text-white text-sm">
                        {formatDate(job.deadline)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Posted:</span>
                    <span className="text-white">
                      {formatDate(job.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Applicants:</span>
                    <span className="text-white">
                      {job.applicants?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button 
                    onClick={() => handleApplyNow(job)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetails
          job={selectedJob}
          onClose={handleCloseJobDetails}
          onProposalSubmitted={fetchJobs}
        />
      )}
    </div>
  );
};

export default Jobs; 