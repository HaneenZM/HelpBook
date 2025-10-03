import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getJobDetails, getWorkerProfile } from 'wasp/client/operations';
import { Link } from 'wasp/client/router';

const DashboardPage = () => {
  const { data: jobDetails, isLoading: isLoadingJobs, error: jobsError } = useQuery(getJobDetails);
  const { data: workerProfile, isLoading: isLoadingProfile, error: profileError } = useQuery(getWorkerProfile);

  if (isLoadingJobs || isLoadingProfile) return 'Loading...';
  if (jobsError) return 'Error loading jobs: ' + jobsError;
  if (profileError) return 'Error loading profile: ' + profileError;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">Job Details</h2>
        {jobDetails && jobDetails.map((job) => (
          <div key={job.id} className="p-2 border-b">
            <h3 className="font-bold">{job.title}</h3>
            <p>{job.description}</p>
            <Link to={`/jobs/${job.id}`} className="text-blue-500 hover:underline">View Details</Link>
          </div>
        ))}
          </div>
      <div className="bg-gray-100 p-4 rounded-lg mt-4">
        <h2 className="text-xl font-semibold">Worker Profile</h2>
        {workerProfile && (
          <div>
            <p>Name: {workerProfile.user.fullName}</p>
            <p>Skills: {workerProfile.skills.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
