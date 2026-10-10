import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobApi, studentApi } from '../api/endpoints';
import { JobPosting, StudentProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { JobTypeBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Building2,
  MapPin,
  IndianRupee,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  Send,
  Sparkles,
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await jobApi.getJobById(Number(id));
        if (res.success && res.data) {
          setJob(res.data);
        }

        if (isAuthenticated && isStudent) {
          const profileRes = await studentApi.getProfile();
          if (profileRes.success && profileRes.data) {
            setStudentProfile(profileRes.data);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Job opening not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthenticated, isStudent]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setApplyError(null);

    try {
      const res = await jobApi.applyForJob(job.id, {
        coverNote,
        resumeUrl: studentProfile?.resumeUrl,
      });

      if (res.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setIsApplyModalOpen(false);
          navigate('/student/applications');
        }, 1500);
      }
    } catch (err: any) {
      setApplyError(err?.response?.data?.message || err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This job opening does not exist or has been removed.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Job Listings
        </Link>
      </div>
    );
  }

  const isEligible = !job.minCgpa || !studentProfile?.cgpa || studentProfile.cgpa >= job.minCgpa;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all jobs
        </Link>
      </div>

      {/* Header Banner Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {job.companyName}
              </span>
              <JobTypeBadge type={job.jobType} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{job.title}</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Posted by verified talent acquisition partner
            </p>
          </div>

          {/* Action CTA */}
          <div className="sm:self-center shrink-0">
            {isStudent ? (
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                Apply for Position
              </button>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
              >
                Sign In to Apply
              </Link>
            ) : null}
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">CTC Compensation</span>
            <p className="text-base font-bold text-slate-900 flex items-center">
              <IndianRupee className="w-4 h-4 text-indigo-600 mr-0.5" />
              {job.salaryPackage} LPA
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Work Location</span>
            <p className="text-base font-bold text-slate-900 flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 mr-1" />
              {job.location}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Minimum Cutoff</span>
            <p className="text-base font-bold text-slate-900 flex items-center">
              <GraduationCap className="w-4 h-4 text-slate-400 mr-1" />
              {job.minCgpa ? `${job.minCgpa} CGPA` : 'No minimum'}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-medium">Last Date to Apply</span>
            <p className="text-base font-bold text-slate-900 flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 mr-1" />
              {job.applicationDeadline ?? 'Ongoing Drive'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Role Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Responsibilities</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Candidate Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{job.requirements}</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Skills Required */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Target Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.skillsRequired?.split(',').map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Eligible Branches */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              Eligible Departments
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.eligibleDepartments || 'Open to all academic engineering & technology departments.'}
            </p>
          </div>

          {/* Student Status Checker */}
          {isStudent && studentProfile && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Your Eligibility Check</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Your CGPA:</span>
                  <span className="font-bold text-slate-800">{studentProfile.cgpa ?? 'Not specified'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Eligibility Status:</span>
                  {isEligible ? (
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
                    </span>
                  ) : (
                    <span className="font-semibold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Below Cutoff
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Resume on file:</span>
                  <span className="font-semibold text-slate-800">
                    {studentProfile.resumeUrl ? 'Uploaded ✓' : 'Missing!'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-5">
          {applySuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
              <p className="text-xs text-slate-500">
                Your profile has been forwarded to the {job.companyName} recruitment team. Redirecting...
              </p>
            </div>
          ) : (
            <>
              {applyError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{applyError}</span>
                </div>
              )}

              {/* Resume notice */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-slate-700">
                    {studentProfile?.resumeOriginalName
                      ? `Attached: ${studentProfile.resumeOriginalName}`
                      : 'Using profile resume attachment'}
                  </span>
                </div>
                <Link to="/student/profile" className="text-indigo-600 font-semibold hover:underline">
                  Change Resume
                </Link>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Statement / Cover Note (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Introduce yourself, highlight relevant achievements, or explain your interest in this role..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
