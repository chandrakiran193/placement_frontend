import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/endpoints';
import { DashboardStats } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Building2,
  FileText,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  PieChart,
  Percent,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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

  const s = stats || {
    totalStudents: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    placedStudents: 0,
    placementRate: 0,
    averageSalary: 0,
    highestSalary: 0,
    applicationsByStatus: {},
    studentsByDepartment: {},
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> University Placement Cell Director
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Institutional Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time campus recruitment metrics, student placement percentages, and corporate partner auditing.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Users className="w-4 h-4" /> User Management
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md transition-colors"
          >
            <BarChart3 className="w-4 h-4" /> Generate Report
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Placement Success Rate"
          value={`${s.placementRate}%`}
          subtitle={`${s.placedStudents} of ${s.totalStudents} students placed`}
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Average Compensation"
          value={`${s.averageSalary} LPA`}
          subtitle={`Highest CTC: ${s.highestSalary} LPA`}
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Active Campus Drives"
          value={s.activeJobs}
          subtitle={`Total listings: ${s.totalJobs}`}
          icon={Briefcase}
          color="sky"
        />
        <StatCard
          title="Recruiting Partners"
          value={s.totalRecruiters}
          subtitle={`${s.totalApplications} applications submitted`}
          icon={Building2}
          color="purple"
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department-wise Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-600" /> Department Student Representation
            </h3>
            <span className="text-xs text-slate-400 font-medium">Batch 2025/2026</span>
          </div>

          <div className="space-y-4">
            {Object.entries(s.studentsByDepartment).map(([dept, count]) => {
              const percentage = s.totalStudents > 0 ? Math.round((count / s.totalStudents) * 100) : 0;
              return (
                <div key={dept} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept}</span>
                    <span className="text-slate-500 font-medium">{count} students ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recruitment Pipeline Status Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Pipeline Status Distribution
            </h3>
            <span className="text-xs text-slate-400 font-medium">{s.totalApplications} total applications</span>
          </div>

          <div className="space-y-3.5">
            {[
              { key: 'APPLIED', label: 'Under Application Review', color: 'bg-amber-500' },
              { key: 'SHORTLISTED', label: 'Candidate Shortlisted', color: 'bg-sky-500' },
              { key: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', color: 'bg-purple-500' },
              { key: 'SELECTED', label: 'Offer Extended / Selected', color: 'bg-emerald-500' },
              { key: 'REJECTED', label: 'Not Selected', color: 'bg-rose-500' },
            ].map((item) => {
              const count = s.applicationsByStatus[item.key] || 0;
              const percent = s.totalApplications > 0 ? Math.round((count / s.totalApplications) * 100) : 0;

              return (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-medium">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all`}
                      style={{ width: `${Math.max(percent, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Manage Users & Roles</h4>
            <p className="text-xs text-slate-500 mt-1">Activate, disable, or audit accounts</p>
          </div>
          <Users className="w-5 h-5 text-indigo-600" />
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Manage Job Drives</h4>
            <p className="text-xs text-slate-500 mt-1">Moderate listings and CTC packages</p>
          </div>
          <Briefcase className="w-5 h-5 text-indigo-600" />
        </Link>

        <Link
          to="/admin/reports"
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs card-hover flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Full Audit Reports</h4>
            <p className="text-xs text-slate-500 mt-1">Print and export statistical digests</p>
          </div>
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </Link>
      </div>
    </div>
  );
};
