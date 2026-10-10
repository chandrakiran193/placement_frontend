import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../api/endpoints';
import { JobPosting } from '../types';
import { JobTypeBadge } from '../components/common/Badge';
import {
  Search,
  MapPin,
  IndianRupee,
  Calendar,
  Briefcase,
  SlidersHorizontal,
  X,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export const JobListingsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [jobType, setJobType] = useState('ALL');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.searchJobs({
        keyword: keyword || undefined,
        jobType: jobType !== 'ALL' ? jobType : undefined,
        location: location || undefined,
        minSalary: minSalary || undefined,
      });
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, minSalary]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setJobType('ALL');
    setLocation('');
    setMinSalary(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Placement Openings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified company drives, check minimum eligibility, and apply directly
          </p>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Showing <span className="font-bold text-indigo-600">{jobs.length}</span> active job postings
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Title, company, or skills..."
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          {/* Job Type Selector */}
          <div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            >
              <option value="ALL">All Employment Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>

          {/* Location Search */}
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State, or Remote..."
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            {(keyword || jobType !== 'ALL' || location || minSalary) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
                title="Reset filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Min CTC Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Minimum Package:
          </span>
          {[undefined, 6, 10, 15, 20].map((val) => (
            <button
              key={val ?? 'any'}
              type="button"
              onClick={() => setMinSalary(val)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                minSalary === val
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {val === undefined ? 'Any CTC' : `${val}+ LPA`}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-slate-200/60 animate-pulse"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No jobs match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, employment type filter, or minimum CTC package filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs card-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    {job.companyName}
                  </span>
                  <JobTypeBadge type={job.jobType} />
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{job.title}</h3>

                <div className="space-y-1.5 my-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> Package:
                    </span>
                    <span className="font-bold text-slate-900">{job.salaryPackage} LPA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
                    </span>
                    <span className="font-medium text-slate-800 truncate max-w-[130px]">{job.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Min CGPA:
                    </span>
                    <span className="font-medium text-slate-800">{job.minCgpa ?? 'No cutoff'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {job.description}
                </p>

                {job.skillsRequired && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.skillsRequired
                      .split(',')
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {job.applicationDeadline ? `Deadline: ${job.applicationDeadline}` : 'Drive Active'}
                </span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  View & Apply <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
