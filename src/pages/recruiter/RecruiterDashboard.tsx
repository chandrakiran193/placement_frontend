import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recruiterApi } from '../../api/endpoints';
import { JobPosting, Interview } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { JobTypeBadge } from '../../components/common/Badge';
import {
  Briefcase,
  Users,
  Award,
  Video,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building2,
  Clock,
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Record<string, any>>({});
  const [myJobs, setMyJobs] = useState<JobPosting[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, jobsRes, ivRes] = await Promise.all([
          recruiterApi.getStats(),
          recruiterApi.getMyJobs(),
          recruiterApi.getInterviews(),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (jobsRes.success) setMyJobs(jobsRes.data);
        if (ivRes.success) setInterviews(ivRes.data);
      } catch (err) {
        console.error('Failed to load recruiter dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> Talent Acquisition Partner
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Recruiter'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Manage your campus hiring drives, review candidate profiles, and schedule live interviews.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Post New Job
          </Link>
          <Link
            to="/recruiter/applicants"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <Users className="w-4 h-4" /> Review Applicants
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Openings"
          value={stats.activeJobs ?? myJobs.filter((j) => j.status === 'ACTIVE').length}
          subtitle={`Total posted: ${myJobs.length}`}
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Total Candidates"
          value={stats.totalApplicants ?? 0}
          subtitle="Profiles submitted"
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted ?? 0}
          subtitle="Passed primary review"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Interviews"
          value={stats.interviewsScheduled ?? interviews.length}
          subtitle="Scheduled evaluations"
          icon={Video}
          color="purple"
        />
      </div>

      {/* Grid: My Jobs & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Posted Openings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Campus Openings</h2>
            <Link
              to="/recruiter/manage-jobs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Manage all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {myJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">No active job listings</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create a new job posting to begin receiving student applications.
              </p>
              <Link
                to="/recruiter/post-job"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                <PlusCircle className="w-4 h-4" /> Create First Opening
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {myJobs.slice(0, 5).map((job) => (
                <div key={job.id} className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase">{job.companyName}</span>
                      <JobTypeBadge type={job.jobType} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{job.title}</h3>
                    <p className="text-xs text-slate-500">
                      Package: {job.salaryPackage} LPA | Min CGPA: {job.minCgpa ?? 'None'} | {job.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/recruiter/jobs/${job.id}/applicants`}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" /> Applicants
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Scheduled Interviews List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Scheduled Interviews</h2>

          {interviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
              <Video className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No scheduled interviews currently on calendar.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {interviews.slice(0, 4).map((iv) => (
                <div key={iv.id} className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{iv.application?.student?.name}</p>
                      <p className="text-[11px] text-slate-500">{iv.interviewRound}</p>
                    </div>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-100">
                      {iv.mode}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>{new Date(iv.interviewDate).toLocaleString()}</span>
                  </div>

                  {iv.meetingLink && (
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Open Meeting Room
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
