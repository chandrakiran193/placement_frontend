import React from 'react';
import { ApplicationStatus } from '../../types';

interface BadgeProps {
  status?: ApplicationStatus | string;
  type?: 'status' | 'jobType' | 'department';
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status = 'APPLIED', className = '' }) => {
  const getStyle = () => {
    switch (status) {
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'SHORTLISTED':
        return 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      case 'APPLIED':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'INTERVIEW_SCHEDULED':
        return 'Interview Scheduled';
      case 'SHORTLISTED':
        return 'Shortlisted';
      case 'SELECTED':
        return 'Selected / Placed';
      case 'REJECTED':
        return 'Not Selected';
      case 'APPLIED':
        return 'Applied';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs ${getStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {getLabel()}
    </span>
  );
};

export const JobTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const isFullTime = type?.toUpperCase() === 'FULL_TIME';
  const isIntern = type?.toUpperCase() === 'INTERNSHIP';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
        isFullTime
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
          : isIntern
          ? 'bg-teal-50 text-teal-700 border-teal-200'
          : 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {type?.replace('_', ' ')}
    </span>
  );
};
