import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/endpoints';
import { JobPosting } from '../../types';
import { JobTypeBadge } from '../../components/common/Badge';
import { Briefcase, Trash2, IndianRupee, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ManageAdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load all jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId: number, status: string) => {
    setError(null);
    try {
      const res = await adminApi.updateJobStatus(jobId, status);
      if (res.success && res.data) {
        setJobs(jobs.map((j) => (j.id === jobId ? res.data : j)));
        setFeedback('Job status updated.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!window.confirm('Are you sure you want to delete this job posting permanently?')) return;
    setError(null);
    try {
      const res = await adminApi.deleteJob(jobId);
      if (res.success) {
        setJobs(jobs.filter((j) => j.id !== jobId));
        setFeedback('Job posting removed.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Job Moderation & Control</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervise all active and closed corporate campus drives across university recruiters
          </p>
        </div>

        <div className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Total Drives: <span className="font-bold text-indigo-600">{jobs.length}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200/60 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase">{job.companyName}</span>
                  <JobTypeBadge type={job.jobType} />
                  <span className="text-[11px] text-slate-400">
                    Recruiter: {job.recruiter?.name || 'Recruiter'} ({job.recruiter?.email})
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
                  <span>Openings: {job.openingsCount}</span>
                </div>
              </div>

              {/* Status Selector & Delete */}
              <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 font-semibold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleDelete(job.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove Job"
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
