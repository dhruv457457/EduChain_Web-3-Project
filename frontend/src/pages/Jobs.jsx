import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import PostJobs from "../components/JobsModule/PostJobs";
import JobDetails from "../components/JobsModule/JobDetails";
import { toast } from "react-toastify";
import {
  Briefcase,
  Clock,
  Tag,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import Loader from "../components/Global/Loader";

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

  const getStatusPill = (status) => {
    switch (status) {
      case "open":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-500/20 rounded-full">
            Open
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-yellow-500/20 rounded-full">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-semibold text-blue-300 bg-blue-500/20 rounded-full">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-500/20 rounded-full">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="mt-40">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <p className="text-gray-400 mt-1">
              Find your next opportunity or post a job for the community.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <PostJobs onJobPosted={handleJobPosted} />
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-black/20 rounded-lg border border-gray-700/50">
            <AlertCircle className="mx-auto text-gray-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">
              No jobs available
            </h2>
            <p className="text-gray-500 mt-2">
              Be the first to post a job and attract talent!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-black/20 rounded-lg p-6 border border-gray-700/50 hover:scale-105 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      {job.title}
                    </h3>
                    {getStatusPill(job.status)}
                  </div>

                  <p className="text-gray-400 mb-6 line-clamp-3 text-sm">
                    {job.description}
                  </p>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Tag size={16} className="text-primary" />
                      <span>
                        Budget:{" "}
                        <span className="font-semibold text-white">
                          {job.budget} ETH
                        </span>
                      </span>
                    </div>
                    {job.deadline && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar size={16} className="text-primary" />
                        <span>
                          Deadline:{" "}
                          <span className="font-semibold text-white">
                            {formatDate(job.deadline)}
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-300">
                      <Users size={16} className="text-primary" />
                      <span>
                        Applicants:{" "}
                        <span className="font-semibold text-white">
                          {job.applicants?.length || 0}
                        </span>
                      </span>
                    </div>
                  </div>

                  {job.skills && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.split(",").map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-700/80 text-gray-300 text-xs rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleApplyNow(job)}
                    className="w-full bg-primary hover:bg-primary_hover1 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300"
                  >
                    View & Apply
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
