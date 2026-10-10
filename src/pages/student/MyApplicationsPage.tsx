import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentApi, getResumeDownloadUrl } from '../../api/endpoints';
import { JobApplication, Interview } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import {
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  Download,
  Video,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  IndianRupee,
  MapPin,
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appRes, ivRes] = await Promise.all([
          studentApi.getApplications(),
          studentApi.getInterviews(),
        ]);
        if (appRes.success) setApplications(appRes.data);
        if (ivRes.success) setInterviews(ivRes.data);
      } catch (err) {
        console.error('Failed to load applications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  const getInterviewForApp = (appId: number) => {
    return interviews.find((i) => i.application?.id === appId);
  };

  // Status step progression helper
  const renderProgressSteps = (status: string) => {
    const steps = [
      { key: 'APPLIED', label: 'Applied' },
      { key: 'SHORTLISTED', label: 'Shortlisted' },
      { key: 'INTERVIEW_SCHEDULED', label: 'Interview' },
      { key: 'SELECTED', label: 'Selected' },
    ];

    const getStepState = (stepKey: string) => {
      if (status === 'REJECTED') {
        return stepKey === 'APPLIED' ? 'completed' : 'rejected';
      }
      const order = ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED'];
      const currentIdx = order.indexOf(status);
      const stepIdx = order.indexOf(stepKey);

      if (stepIdx <= currentIdx) return 'completed';
      return 'upcoming';
    };

    return (
      <div className="flex items-center w-full max-w-md py-2">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    state === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : state === 'rejected'
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {state === 'completed' ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-medium text-slate-500 mt-1">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 -mt-3.5 ${
                    state === 'completed' && getStepState(steps[idx + 1].key) === 'completed'
                      ? 'bg-emerald-600'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status tracking and interview timeline for submitted applications
          </p>
        </div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          Explore More Drives <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        {[
          { key: 'ALL', label: 'All Applications' },
          { key: 'APPLIED', label: 'Under Review' },
          { key: 'SHORTLISTED', label: 'Shortlisted' },
          { key: 'INTERVIEW_SCHEDULED', label: 'Interviews' },
          { key: 'SELECTED', label: 'Selected' },
          { key: 'REJECTED', label: 'Not Selected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              filter === tab.key
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200/60 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No applications in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filter === 'ALL'
              ? 'You have not submitted any applications yet.'
              : `No applications with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map((app) => {
            const iv = getInterviewForApp(app.id);

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs card-hover space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {app.job?.companyName}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{app.job?.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> {app.job?.salaryPackage} LPA
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.job?.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <StatusBadge status={app.status} />
                  </div>
                </div>

                {/* Status pipeline */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Recruitment Progression
                    </span>
                    {renderProgressSteps(app.status)}
                  </div>

                  {app.resumeUrl && (
                    <a
                      href={getResumeDownloadUrl(app.resumeUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 self-start md:self-center"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" /> Submitted Resume
                    </a>
                  )}
                </div>

                {/* Recruiter feedback if present */}
                {app.recruiterFeedback && (
                  <div className="p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-indigo-900">Recruiter Feedback / Notes:</span>
                    <p className="text-slate-700">{app.recruiterFeedback}</p>
                  </div>
                )}

                {/* Interview details if scheduled */}
                {iv && (
                  <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-600" />
                        <span className="font-bold text-purple-950">
                          {iv.interviewRound} ({iv.mode})
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-purple-100 text-purple-700">
                        {iv.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-purple-500" />
                        <span>Date & Time: {new Date(iv.interviewDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>Duration: {iv.durationMinutes} minutes</span>
                      </div>
                    </div>

                    {iv.instructions && (
                      <p className="text-slate-600 italic pt-1">Instructions: "{iv.instructions}"</p>
                    )}

                    {iv.meetingLink && (
                      <div className="pt-2">
                        <a
                          href={iv.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Launch Video Interview Room
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
