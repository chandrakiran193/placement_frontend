import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/endpoints';
import { User, Role } from '../../types';
import {
  Users,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  GraduationCap,
  Building2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    setError(null);
    try {
      const res = await adminApi.toggleUserStatus(userId);
      if (res.success && res.data) {
        setUsers(users.map((u) => (u.id === userId ? res.data : u)));
        setFeedback(`User ${res.data.name} status updated successfully.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      return;
    }
    setError(null);
    try {
      const res = await adminApi.deleteUser(userId);
      if (res.success) {
        setUsers(users.filter((u) => u.id !== userId));
        setFeedback(`User "${name}" deleted.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'ROLE_RECRUITER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            <Building2 className="w-3 h-3" /> Recruiter
          </span>
        );
      case 'ROLE_STUDENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <GraduationCap className="w-3 h-3" /> Student
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Account Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit registered student candidates, corporate recruiters, and administration personnel
          </p>
        </div>

        <div className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs">
          Total Users: <span className="font-bold text-indigo-600">{users.length}</span>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user name or email address..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
          >
            <option value="ALL">All Account Roles</option>
            <option value="ROLE_STUDENT">Students Only</option>
            <option value="ROLE_RECRUITER">Recruiters Only</option>
            <option value="ROLE_ADMIN">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-200/60 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No users found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or role selection.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>

                    <td className="px-6 py-4 text-slate-600">{u.phone || '—'}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          u.enabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u.id)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                            u.enabled
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.enabled ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
