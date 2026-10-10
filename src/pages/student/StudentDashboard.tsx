import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi, jobApi } from '../../api/endpoints';
import { JobApplication, Interview, JobPosting, StudentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  FileText,
  UserCheck,
  Video,
  Award,
  ArrowRight,
  ExternalLink,
  Calendar,
  Building2,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [profileRes, appRes, interviewRes, jobsRes] = await Promise.all([
          studentApi.getProfile(),
          studentApi.getApplications(),
          studentApi.getInterviews(),
          jobApi.searchJobs(),
        ]);

        if (profileRes.success) setProfile(profileRes.data);
        if (appRes.success) setApplications(appRes.data);
        if (interviewRes.success) setInterviews(interviewRes.data);
        if (jobsRes.success) setRecommendedJobs(jobsRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalApplied = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const interviewCount = applications.filter((a) => a.status === 'INTERVIEW_SCHEDULED').length;
  const selectedCount = applications.filter((a) => a.status === 'SELECTED').length;

  const upcomingInterviews = interviews.filter((i) => i.status === 'SCHEDULED');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl w-full"></div>
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
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Student Candidate Hub</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            {profile?.department ? `${profile.department} | ${profile.rollNumber || 'Class of 2025'}` : 'Keep your profile updated to increase recruitment visibility.'}
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" /> Browse Open Drives
            </Link>
            <Link
              to="/student/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" /> Manage Resume & Profile
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Applications Sent"
          value={totalApplied}
          subtitle="Across campus drives"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Shortlisted"
          value={shortlistedCount}
          subtitle="Qualified initial review"
          icon={Award}
          color="sky"
        />
        <StatCard
          title="Interviews"
          value={interviewCount}
          subtitle="Active interview rounds"
          icon={Video}
          color="purple"
        />
        <StatCard
          title="Offers / Selected"
          value={selectedCount}
          subtitle="Placement confirmed"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Scheduled Interview Callout Banner (If any) */}
      {upcomingInterviews.length > 0 && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-purple-600 text-white rounded-lg">
                <Video className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-purple-950">Upcoming Interview Scheduled</h3>
                <p className="text-xs text-purple-700">Prepare your workspace and join on time</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full">
              {upcomingInterviews.length} Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {upcomingInterviews.map((iv) => (
              <div key={iv.id} className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-xs text-slate-900">{iv.application?.job?.companyName}</p>
                    <p className="text-xs text-slate-600 font-medium">{iv.interviewRound}</p>
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {iv.mode}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span>{new Date(iv.interviewDate).toLocaleString()}</span>
                  <span className="text-slate-400">({iv.durationMinutes} mins)</span>
                </div>

                {iv.meetingLink && (
                  <div className="pt-2 border-t border-slate-50">
                    <a
                      href={iv.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Join Meeting Link
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid: Applications & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            <Link
              to="/student/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all ({applications.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800">No applications submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore campus job postings and submit your application to kickstart the placement process.
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Browse Drives
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase">{app.job?.companyName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{app.job?.title}</p>
                    <p className="text-xs text-slate-500">
                      Package: {app.job?.salaryPackage} LPA | {app.job?.location}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={app.status} />
                    {app.recruiterFeedback && (
                      <span className="text-[11px] text-slate-500 italic max-w-xs truncate">
                        "{app.recruiterFeedback}"
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Profile summary & Quick Openings */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Profile Snapshot</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Degree:</span>
                <span className="font-semibold text-slate-800">{profile?.degree || 'B.Tech'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">CGPA:</span>
                <span className="font-bold text-indigo-600">{profile?.cgpa || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Resume:</span>
                <span className="font-semibold text-slate-800">
                  {profile?.resumeUrl ? 'Uploaded ✓' : 'Pending upload'}
                </span>
              </div>
            </div>

            <Link
              to="/student/profile"
              className="block w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors mt-2"
            >
              Edit Profile Details
            </Link>
          </div>

          {/* Quick Recommended Jobs */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Hot Openings</h3>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((j) => (
                <div key={j.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-900">{j.companyName}</span>
                    <span className="font-bold text-indigo-600">{j.salaryPackage} LPA</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">{j.title}</p>
                  <Link
                    to={`/jobs/${j.id}`}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-0.5 pt-1"
                  >
                    View opening <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
