import { HttpError } from 'wasp/server'

export const getJobDetails = async ({ jobId }, context) => {
  if (!context.user) { throw new HttpError(401); }

  const job = await context.entities.Job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        include: {
          worker: {
            select: {
              user: {
                select: {
                  fullName: true,
                  email: true
                }
              },
              skills: true,
              certifications: true
            }
          }
        }
      },
      shifts: true
    }
  });
  if (!job) throw new HttpError(404, 'Job not found');

  // Check if user is authorized to view job details
  if (context.user.role !== 'ADMIN' && context.user.id !== job.createdById) {
    throw new HttpError(403, 'Not authorized to view this job');
  }

  return job;
}

export const getWorkerProfile = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const workerProfile = await context.entities.WorkerProfile.findUnique({
    where: { userId: context.user.id },
    include: {
      certifications: true,
      availability: true
    }
  });
if (!workerProfile) throw new HttpError(404, 'Worker profile not found');

  return workerProfile;
}
