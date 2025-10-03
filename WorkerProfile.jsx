import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getWorkerProfile } from 'wasp/client/operations';

const WorkerProfilePage = () => {
  const { data: workerProfile, isLoading, error } = useQuery(getWorkerProfile);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Worker Profile</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <ul className="list-disc pl-5">
          {workerProfile.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <ul className="list-disc pl-5">
          {workerProfile.certifications.map(cert => (
            <li key={cert.id}>{cert.title} - {cert.issuer} ({new Date(cert.issueDate).toLocaleDateString()})</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Availability</h2>
        <ul className="list-disc pl-5">
          {workerProfile.availability.map(slot => (
            <li key={slot.id}>Weekday: {slot.weekday}, {slot.startHour}:00 - {slot.endHour}:00</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default WorkerProfilePage;
