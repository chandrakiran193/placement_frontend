import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building2, IndianRupee, MapPin, GraduationCap, Calendar, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const PostJobPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState(user?.name || '');
  const [jobType, setJobType] = useState('FULL_TIME');
  const [location, setLocation] = useState('');
  const [salaryPackage, setSalaryPackage] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [eligibleDepartments, setEligibleDepartments] = useState('Computer Science & Engineering, Information Technology');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [openingsCount, setOpeningsCount] = useState(2);
  const [applicationDeadline, setApplicationDeadline] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await jobApi.createJob({
        title,
        companyName,
        jobType,
        location,
        salaryPackage: parseFloat(salaryPackage),
        minCgpa: minCgpa ? parseFloat(minCgpa) : undefined,
        eligibleDepartments,
        skillsRequired,
        description,
        responsibilities,
        requirements,
        openingsCount: Number(openingsCount),
        applicationDeadline: applicationDeadline || undefined,
        status: 'ACTIVE',
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/recruiter/manage-jobs');
        }, 1500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to publish job posting');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post New Campus Drive</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish employment openings and set academic eligibility standards for university candidates
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Job opening published successfully! Redirecting to jobs management...</span>
            </div>
          )}

          {/* Job Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Job Title / Position
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Software Development Engineer 1"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Hiring Organization / Company
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google India"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Type, Location, CTC */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Annual Package / CTC (in LPA)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={salaryPackage}
                onChange={(e) => setSalaryPackage(e.target.value)}
                placeholder="e.g. 14.5"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, India / Remote"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Cutoffs & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Minimum CGPA Cutoff
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="e.g. 7.5 (leave empty for none)"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Estimated Openings
              </label>
              <input
                type="number"
                min="1"
                value={openingsCount}
                onChange={(e) => setOpeningsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Eligible Branches & Skills */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Eligible Departments / Branches
              </label>
              <input
                type="text"
                value={eligibleDepartments}
                onChange={(e) => setEligibleDepartments(e.target.value)}
                placeholder="Computer Science & Engineering, Information Technology, Electronics"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Required Technical Skills (Comma-separated)
              </label>
              <input
                type="text"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                placeholder="Java, Spring Boot, React, SQL, Microservices"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              />
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Role Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a comprehensive summary of the team and position..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Core Responsibilities
              </label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="List day-to-day duties, deliverables, and engineering expectations..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Candidate Requirements & Qualifications
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Degree qualifications, technical prerequisites, project portfolio..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/30 transition-colors"
            >
              {submitting ? 'Publishing Opening...' : 'Publish Campus Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
