import React from 'react';
import { useParams } from 'wasp/client/router';
import { useQuery, useAction, getJobDetails, applyToJob } from 'wasp/client/operations';

const JobDetailPage = () => {
  const { id } = useParams();
  const { data: job, isLoading, error } = useQuery(getJobDetails, { jobId: id });
  const applyToJobFn = useAction(applyToJob);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error.message;

  const handleApply = () => {
    applyToJobFn({ jobId: id, note: 'Looking forward to this opportunity!' });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <p className="mb-4">{job.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Sector:</span> {job.sector}
      </div>
      <div className="mb-4">
        <span className="font-semibold">City:</span> {job.city}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Hourly Rate:</span> {job.hourlyJOD} JOD
      </div>
      <button
        onClick={handleApply}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Apply to Job
      </button>
    </div>
     );
};
export default JobDetailPage;
