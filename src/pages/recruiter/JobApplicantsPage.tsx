import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { recruiterApi, getResumeDownloadUrl } from '../../api/endpoints';
import { JobApplicantResponse } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { ScheduleInterviewModal } from './ScheduleInterviewModal';
import {
  Users,
  Search,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Video,
  Award,
  ArrowLeft,
  FileText,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const JobApplicantsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const [applicants, setApplicants] = useState<JobApplicantResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState<number | undefined>(undefined);

  // Schedule Interview modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplicantResponse | null>(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = jobId
        ? await recruiterApi.getApplicantsForJob(Number(jobId))
        : await recruiterApi.getAllApplicants();

      if (res.success && res.data) {
        setApplicants(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch applicants', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    try {
      const res = await recruiterApi.updateApplicationStatus(appId, newStatus);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((a) => (a.applicationId === appId ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const openScheduleModal = (app: JobApplicantResponse) => {
    setSelectedApp(app);
    setScheduleModalOpen(true);
  };

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    if (minCgpaFilter && (!app.cgpa || app.cgpa < minCgpaFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = app.studentName?.toLowerCase().includes(q);
      const matchDept = app.department?.toLowerCase().includes(q);
      const matchRoll = app.rollNumber?.toLowerCase().includes(q);
      const matchSkills = app.skills?.toLowerCase().includes(q);
      return matchName || matchDept || matchRoll || matchSkills;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          {jobId && (
            <Link
              to="/recruiter/manage-jobs"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Jobs
            </Link>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {jobId ? 'Job Candidate Pool' : 'All Registered Applicants'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Filter, review academic profiles, download resumes, and trigger interview schedules
          </p>
        </div>

        <div className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Showing <span className="font-bold text-indigo-600">{filteredApplicants.length}</span> of {applicants.length} candidates
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search query */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll number, department, or skills..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            >
              <option value="ALL">All Application Statuses</option>
              <option value="APPLIED">Applied (Under Review)</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* CGPA Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Minimum CGPA:
          </span>
          {[undefined, 7.0, 7.5, 8.0, 8.5].map((cutoff) => (
            <button
              key={cutoff ?? 'any'}
              type="button"
              onClick={() => setMinCgpaFilter(cutoff)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                minCgpaFilter === cutoff
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cutoff === undefined ? 'Any CGPA' : `${cutoff}+ CGPA`}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No applicants match your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, status selection, or minimum CGPA requirement.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <div
              key={app.applicationId}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs card-hover flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Student info */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-base font-bold text-slate-900">{app.studentName}</span>
                  <StatusBadge status={app.status} />
                  <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                    {app.jobTitle}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Roll No:</span>
                    <span className="font-semibold text-slate-800">{app.rollNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Department:</span>
                    <span className="font-semibold text-slate-800 truncate block">{app.department || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">CGPA:</span>
                    <span className="font-bold text-indigo-600">{app.cgpa ?? 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Degree / Grad:</span>
                    <span className="font-semibold text-slate-800">{app.degree || 'B.Tech'} ({app.graduationYear || '2025'})</span>
                  </div>
                </div>

                {app.skills && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {app.skills.split(',').map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {app.coverNote && (
                  <p className="text-xs text-slate-500 italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    "{app.coverNote}"
                  </p>
                )}
              </div>

              {/* Actions & Resume */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                {/* Download resume button */}
                {app.resumeUrl ? (
                  <a
                    href={getResumeDownloadUrl(app.resumeUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Download Resume
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 text-center lg:text-right">No resume uploaded</span>
                )}

                {/* Schedule Interview */}
                <button
                  type="button"
                  onClick={() => openScheduleModal(app)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  Schedule Interview
                </button>

                {/* Status change actions */}
                <div className="flex items-center gap-1.5 justify-end">
                  {app.status !== 'SHORTLISTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.applicationId, 'SHORTLISTED')}
                      className="px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                      title="Shortlist Candidate"
                    >
                      Shortlist
                    </button>
                  )}

                  {app.status !== 'SELECTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.applicationId, 'SELECTED')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                      title="Select / Offer"
                    >
                      Select
                    </button>
                  )}

                  {app.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.applicationId, 'REJECTED')}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                      title="Reject"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedApp && (
        <ScheduleInterviewModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          applicationId={selectedApp.applicationId}
          candidateName={selectedApp.studentName}
          jobTitle={selectedApp.jobTitle}
          onScheduled={fetchApplicants}
        />
      )}
    </div>
  );
};
