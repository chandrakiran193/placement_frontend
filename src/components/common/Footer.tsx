import React from 'react';
import { GraduationCap, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">PlacementPro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern end-to-end placement and campus recruitment portal connecting students, corporate talent acquisition, and placement cells.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">For Students</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Job Openings</Link></li>
              <li><Link to="/student/profile" className="hover:text-white transition-colors">Build Digital Profile</Link></li>
              <li><Link to="/student/applications" className="hover:text-white transition-colors">Track Application Status</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Interview Preparation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">For Recruiters</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/recruiter/post-job" className="hover:text-white transition-colors">Post Job Openings</Link></li>
              <li><Link to="/recruiter/applicants" className="hover:text-white transition-colors">Candidate Shortlisting</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-white transition-colors">Schedule Interviews</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Corporate Registration</Link></li>
            </ul>
          </div>

          {/* Contact & Security */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Placement Cell</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>placement-cell@university.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>+91 (0) 80-2345-6789</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-400 mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Role-Based Secure JWT Auth</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Smart Placement & Recruitment Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with React, TypeScript, Spring Boot & MySQL
          </p>
        </div>
      </div>
    </footer>
  );
};
