import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
}) => {
  const colorStyles = {
    indigo: { bg: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
    sky: { bg: 'bg-sky-50 text-sky-600', border: 'border-sky-100' },
    rose: { bg: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
    purple: { bg: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  }[color];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs card-hover flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorStyles.bg}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
