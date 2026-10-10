import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  MapPin,
  IndianRupee,
  Calendar,
} from 'lucide-react';
import { jobApi } from '../api/endpoints';
import { JobPosting } from '../types';
import { JobTypeBadge } from '../components/common/Badge';

export const Home: React.FC = () => {
  const [featuredJobs, setFeaturedJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobApi.searchJobs();
        if (res.success && res.data) {
          setFeaturedJobs(res.data.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Next-Gen Campus Recruitment Ecosystem
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bridge the Gap Between <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">Ambition & Placement</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              An intelligent, end-to-end recruitment platform empowering students to launch their careers, recruiters to hire top collegiate talent, and placement cells to drive verifiable institutional success.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
              >
                <Search className="w-4 h-4" />
                Explore Active Drives
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold backdrop-blur-md border border-white/10 transition-all"
              >
                Join Placement Cell
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase">
              <Award className="w-4 h-4" /> Placement Rate
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-white">92.4%</p>
            <p className="text-xs text-slate-400">Class of 2025/2026</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase">
              <TrendingUp className="w-4 h-4" /> Highest Package
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-white">44.5 LPA</p>
            <p className="text-xs text-slate-400">International & Tier-1 CTC</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase">
              <Building2 className="w-4 h-4" /> Partner Recruiters
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-white">180+</p>
            <p className="text-xs text-slate-400">Fortune 500 & Unicorns</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase">
              <Briefcase className="w-4 h-4" /> Average CTC
            </div>
            <p className="text-2xl lg:text-3xl font-extrabold text-white">12.8 LPA</p>
            <p className="text-xs text-slate-400">Across STEM disciplines</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Current Opportunities</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Campus Drives</h2>
          </div>
          <Link
            to="/jobs"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            View all openings <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 rounded-xl bg-slate-200/70 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
                        {job.companyName}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{job.title}</h3>
                    </div>
                    <JobTypeBadge type={job.jobType} />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{job.salaryPackage} LPA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Min CGPA: {job.minCgpa ?? 'N/A'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Skills: <span className="text-slate-600 font-medium">{job.skillsRequired?.split(',').slice(0, 3).join(', ')}</span>
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-semibold transition-colors"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Role Ecosystem Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Unified Platform</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Built for Students, Recruiters & Administrators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Student Portal</h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Build your verifiable digital profile, upload PDF resumes, filter eligible jobs based on CGPA and department, and track interview progress in real-time.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">✓ Dynamic resume upload & preview</li>
                <li className="flex items-center gap-2">✓ Eligibility auto-checking</li>
                <li className="flex items-center gap-2">✓ Application status timeline</li>
              </ul>
            </div>
            <Link
              to="/student/dashboard"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
            >
              Access Student Hub
            </Link>
          </div>

          {/* Recruiter Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiter Portal</h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Publish tailored job descriptions, set minimum academic cutoffs, review student profiles, download resumes, and schedule video interviews directly.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">✓ Post and edit openings</li>
                <li className="flex items-center gap-2">✓ 1-click candidate shortlisting</li>
                <li className="flex items-center gap-2">✓ Interview scheduling with Meet links</li>
              </ul>
            </div>
            <Link
              to="/recruiter/dashboard"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold text-xs transition-colors"
            >
              Access Recruiter Hub
            </Link>
          </div>

          {/* Admin Portal Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs card-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Placement Cell Admin</h3>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Oversee university-wide placement analytics, manage user accounts, moderate corporate drives, and export comprehensive placement audit reports.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">✓ Real-time placement percentages</li>
                <li className="flex items-center gap-2">✓ Department-level analytics</li>
                <li className="flex items-center gap-2">✓ User activation and moderation</li>
              </ul>
            </div>
            <Link
              to="/admin/dashboard"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs transition-colors"
            >
              Access Admin Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
