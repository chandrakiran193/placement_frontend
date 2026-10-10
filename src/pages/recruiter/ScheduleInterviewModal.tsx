import React, { useState } from 'react';
import { recruiterApi } from '../../api/endpoints';
import { Modal } from '../../components/common/Modal';
import { Calendar, Video, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
  candidateName: string;
  jobTitle: string;
  onScheduled: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
  onScheduled,
}) => {
  const [interviewDate, setInterviewDate] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [interviewRound, setInterviewRound] = useState('Technical Round 1');
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE'>('ONLINE');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [instructions, setInstructions] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId || !interviewDate) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await recruiterApi.scheduleInterview({
        applicationId,
        interviewDate,
        durationMinutes,
        interviewRound,
        mode,
        meetingLink: mode === 'ONLINE' ? meetingLink : undefined,
        location: mode === 'OFFLINE' ? location : undefined,
        instructions,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onScheduled();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Schedule Interview: ${candidateName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
          Candidate: <span className="font-bold text-slate-900">{candidateName}</span> for{' '}
          <span className="font-semibold text-indigo-600">{jobTitle}</span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Interview successfully scheduled! Status updated to Interview Scheduled.</span>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Interview Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Duration (Minutes)
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (1 Hour)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>
        </div>

        {/* Round & Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Interview Round
            </label>
            <input
              type="text"
              required
              value={interviewRound}
              onChange={(e) => setInterviewRound(e.target.value)}
              placeholder="e.g. Technical Round 1, HR Discussion"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Interview Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            >
              <option value="ONLINE">Online (Virtual Meeting)</option>
              <option value="OFFLINE">Offline (In-Person Campus)</option>
            </select>
          </div>
        </div>

        {/* Link / Location */}
        {mode === 'ONLINE' ? (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Meeting URL (Google Meet / Zoom / Teams)
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Campus Location / Room
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Academic Block 4, Placement Interview Room 2"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
            />
          </div>
        )}

        {/* Instructions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Candidate Instructions & Notes
          </label>
          <textarea
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Please have a stable internet connection, keep your IDE ready for coding challenges..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-600 text-slate-800"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            {submitting ? 'Scheduling...' : 'Confirm Schedule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
