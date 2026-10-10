import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi, jobApi } from '../../api/endpoints';
import { JobPosting } from '../../types';
import { JobTypeBadge } from '../../components/common/Badge';
import {
  Briefcase,
  Users,
  PlusCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  IndianRupee,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await recruiterApi.getMyJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job: JobPosting) => {
    const nextStatus = job.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';
    try {
      const res = await jobApi.updateJob(job.id, { ...job, status: nextStatus });
      if (res.success) {
        setJobs(jobs.map((j) => (j.id === job.id ? { ...j, status: nextStatus as any } : j)));
      }
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to update job status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      return;
    }
    try {
      const res = await jobApi.deleteJob(id);
      if (res.success) {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to delete job posting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Job Openings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review status, edit job requirements, and assess applicant pools
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No job postings created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Get started by posting your first opening to attract university students.
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4" /> Post Opening
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                    job.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {job.status}
                  </span>
                  <JobTypeBadge type={job.jobType} />
                  <span className="text-xs text-slate-400">
                    Created: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{job.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> {job.salaryPackage} LPA
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                  </span>
                  <span>•</span>
                  <span>Min CGPA: {job.minCgpa ?? 'None'}</span>
                  <span>•</span>
                  <span>Deadline: {job.applicationDeadline ?? 'Ongoing'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <Link
                  to={`/recruiter/jobs/${job.id}/applicants`}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> View Applicants
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(job)}
                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    job.status === 'ACTIVE'
                      ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title="Toggle open / closed"
                >
                  {job.status === 'ACTIVE' ? 'Close Drive' : 'Reactivate'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(job.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
