import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const authData = await login({ email, password });
      // Redirect based on role or intended route
      if (from) {
        navigate(from, { replace: true });
      } else if (authData.role === 'ROLE_STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else if (authData.role === 'ROLE_RECRUITER') {
        navigate('/recruiter/dashboard', { replace: true });
      } else if (authData.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setDemoCredentials = (role: 'student' | 'recruiter' | 'admin') => {
    if (role === 'student') {
      setEmail('alex.johnson@student.edu');
      setPassword('Student@123');
    } else if (role === 'recruiter') {
      setEmail('recruiter@google.com');
      setPassword('Recruiter@123');
    } else if (role === 'admin') {
      setEmail('admin@placement.edu');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-600/30 mb-4">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-xs text-slate-600">
            Sign in to access your placement dashboard and job applications
          </p>
        </div>

        {/* Quick Demo Autofill Bar */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <span>Instant Demo Logins (Click to autofill):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('student')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-100/60 text-slate-700 text-xs font-medium rounded-lg border border-indigo-200 shadow-2xs transition-colors"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('recruiter')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-100/60 text-slate-700 text-xs font-medium rounded-lg border border-indigo-200 shadow-2xs transition-colors"
            >
              💼 Recruiter
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-100/60 text-slate-700 text-xs font-medium rounded-lg border border-indigo-200 shadow-2xs transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@placement.edu"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold text-sm rounded-xl shadow-xs shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
