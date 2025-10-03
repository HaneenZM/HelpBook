import { HttpError } from 'wasp/server';

export const createJob = async (args, context) => {
  if (!context.user) { throw new HttpError(401); }
  if (context.user.role !== 'EMPLOYER') { throw new HttpError(403, 'Only employers can create jobs.'); }
  const { title, sector, description, city, address, startAt, endAt, hourlyJOD, headcount } = args;
  const job = await context.entities.Job.create({
    data: {
      title,
      sector,
      description,
      city,
      address,
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      hourlyJOD,
      headcount,
      createdById: context.user.id
    }
  });
  await context.entities.AuditLog.create({
    data: {
      userId: context.user.id,
      action: 'JOB_CREATE',
      entity: 'Job',
      entityId: job.id
    }
  });
  return job;
};

export const applyToJob = async ({ jobId, note }, context) => {
  if (!context.user) { throw new HttpError(401); }
  if (context.user.role !== 'WORKER') { throw new HttpError(403, 'Only workers can apply to jobs.'); }

  const workerProfile = await context.entities.WorkerProfile.findUnique({
    where: { userId: context.user.id }
  });
  if (!workerProfile) { throw new HttpError(404, 'Worker profile not found.'); }

  const existingApplication = await context.entities.Application.findFirst({
    where: { jobId, workerId: workerProfile.id }
  });
  if (existingApplication) { throw new HttpError(400, 'You have already applied to this job.'); }

  const application = await context.entities.Application.create({
    data: {
      jobId,
      workerId: workerProfile.id,
      note
    }
  });

  await context.entities.AuditLog.create({
    data: {
      userId: context.user.id,
      action: 'APPLICATION_CREATE',
      entity: 'Application',
      entityId: application.id,
      metadata: { jobId }
    }
  });

  return application;
};
xport const acceptApplication = async ({ applicationId }, context) => {
  if (!context.user) { throw new HttpError(401); }

  // Fetch the application
  const application = await context.entities.Application.findUnique({
    where: { id: applicationId },
    include: { job: true }
  });

  if (!application) {
    throw new HttpError(404, 'Application not found');
  }

  // Check if the user is the employer who created the job
  if (application.job.createdById !== context.user.id) {
    throw new HttpError(403, 'You are not authorized to accept this application');
  }

  // Update application status
  await context.entities.Application.update({
    where: { id: applicationId },
    data: { status: 'ACCEPTED' }
  });

  // Write an audit log
  await context.entities.AuditLog.create({
    data: {
      userId: context.user.id,
      action: 'APPLICATION_ACCEPT',
      entity: 'Application',
      entityId: applicationId,
      metadata: { jobId: application.jobId, workerId: application.workerId }
    }
  });
  return { success: true };
};
