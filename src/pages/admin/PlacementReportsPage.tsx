import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/endpoints';
import { DashboardStats, JobPosting } from '../../types';
import {
  Printer,
  FileText,
  BarChart3,
  Award,
  TrendingUp,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const PlacementReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeJobs, setActiveJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const [statsRes, jobsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getAllJobs(),
        ]);
        if (statsRes.success) setStats(statsRes.data);
        if (jobsRes.success) setActiveJobs(jobsRes.data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !stats) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-10 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:p-0 print:m-0">
      {/* Header and Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:border-none">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Official Placement Cell Audit
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Campus Placement & Recruitment Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generated on {new Date().toLocaleDateString()} • Academic Session 2025/2026
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors print:hidden self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* KPI Overview Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 print:border print:shadow-none">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Executive Placement Summary
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-semibold">Placement Rate</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.placementRate}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.placedStudents} Placed</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-semibold">Average CTC</p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{stats.averageSalary} LPA</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across All Branches</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-semibold">Highest CTC</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.highestSalary} LPA</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top Tier Offer</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-semibold">Active Drives</p>
            <p className="text-3xl font-extrabold text-purple-600 mt-1">{stats.activeJobs}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Participating Firms</p>
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4 print:border print:shadow-none">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Department-Wise Student Candidate Roster
        </h2>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Department / Discipline</th>
              <th className="px-4 py-3 text-center">Registered Candidates</th>
              <th className="px-4 py-3 text-right">Cohort Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(stats.studentsByDepartment).map(([dept, count]) => {
              const share = stats.totalStudents > 0 ? Math.round((count / stats.totalStudents) * 100) : 0;
              return (
                <tr key={dept}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{dept}</td>
                  <td className="px-4 py-3 text-center text-slate-700">{count}</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600">{share}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recruiting Organizations List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4 print:border print:shadow-none">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Participating Recruiting Companies
        </h2>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3 text-center">Package (CTC)</th>
              <th className="px-4 py-3 text-right">Drive Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeJobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-bold text-slate-900">{job.companyName}</td>
                <td className="px-4 py-3 text-slate-700">{job.title}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-800">{job.salaryPackage} LPA</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    job.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sign-off Seal footer for printing */}
      <div className="hidden print:flex justify-between items-end pt-16 text-xs text-slate-600">
        <div>
          <p className="font-bold">Verified by:</p>
          <p>Training & Placement Officer (TPO)</p>
          <p>Placement & Recruitment Cell</p>
        </div>
        <div>
          <p className="font-bold">Approved by:</p>
          <p>Dean of Academic Affairs / Director</p>
        </div>
      </div>
    </div>
  );
};
