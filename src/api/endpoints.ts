import apiClient from './client';
import {
  ApiResponse,
  AuthResponse,
  DashboardStats,
  Interview,
  JobApplicantResponse,
  JobApplication,
  JobPosting,
  RecruiterProfile,
  StudentProfile,
  User,
} from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
    department?: string;
    rollNumber?: string;
    cgpa?: number;
    companyName?: string;
  }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};

export const studentApi = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<StudentProfile>>('/student/profile');
    return res.data;
  },

  updateProfile: async (profileData: Partial<StudentProfile> & { name?: string; phone?: string }) => {
    const res = await apiClient.put<ApiResponse<StudentProfile>>('/student/profile', profileData);
    return res.data;
  },

  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<ApiResponse<StudentProfile>>('/student/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getApplications: async () => {
    const res = await apiClient.get<ApiResponse<JobApplication[]>>('/student/applications');
    return res.data;
  },

  getInterviews: async () => {
    const res = await apiClient.get<ApiResponse<Interview[]>>('/student/interviews');
    return res.data;
  },
};

export const recruiterApi = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<RecruiterProfile>>('/recruiter/profile');
    return res.data;
  },

  updateProfile: async (profileData: Partial<RecruiterProfile> & { name?: string; phone?: string }) => {
    const res = await apiClient.put<ApiResponse<RecruiterProfile>>('/recruiter/profile', profileData);
    return res.data;
  },

  getMyJobs: async () => {
    const res = await apiClient.get<ApiResponse<JobPosting[]>>('/recruiter/jobs');
    return res.data;
  },

  getApplicantsForJob: async (jobId: number) => {
    const res = await apiClient.get<ApiResponse<JobApplicantResponse[]>>(`/recruiter/jobs/${jobId}/applicants`);
    return res.data;
  },

  getAllApplicants: async () => {
    const res = await apiClient.get<ApiResponse<JobApplicantResponse[]>>('/recruiter/applicants');
    return res.data;
  },

  updateApplicationStatus: async (applicationId: number, status: string, feedback?: string) => {
    const res = await apiClient.put<ApiResponse<JobApplication>>(`/recruiter/applications/${applicationId}/status`, {
      status,
      feedback,
    });
    return res.data;
  },

  scheduleInterview: async (data: {
    applicationId: number;
    interviewDate: string;
    durationMinutes?: number;
    interviewRound: string;
    mode: string;
    meetingLink?: string;
    location?: string;
    instructions?: string;
  }) => {
    const res = await apiClient.post<ApiResponse<Interview>>('/recruiter/interviews', data);
    return res.data;
  },

  getInterviews: async () => {
    const res = await apiClient.get<ApiResponse<Interview[]>>('/recruiter/interviews');
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<Record<string, any>>>('/recruiter/stats');
    return res.data;
  },
};

export const jobApi = {
  searchJobs: async (params?: { keyword?: string; jobType?: string; location?: string; minSalary?: number }) => {
    const res = await apiClient.get<ApiResponse<JobPosting[]>>('/jobs', { params });
    return res.data;
  },

  getJobById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<JobPosting>>(`/jobs/${id}`);
    return res.data;
  },

  createJob: async (jobData: Partial<JobPosting>) => {
    const res = await apiClient.post<ApiResponse<JobPosting>>('/jobs', jobData);
    return res.data;
  },

  updateJob: async (id: number, jobData: Partial<JobPosting>) => {
    const res = await apiClient.put<ApiResponse<JobPosting>>(`/jobs/${id}`, jobData);
    return res.data;
  },

  deleteJob: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/jobs/${id}`);
    return res.data;
  },

  applyForJob: async (id: number, applicationData?: { coverNote?: string; resumeUrl?: string }) => {
    const res = await apiClient.post<ApiResponse<JobApplication>>(`/jobs/${id}/apply`, applicationData || {});
    return res.data;
  },
};

export const adminApi = {
  getAllUsers: async () => {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return res.data;
  },

  toggleUserStatus: async (userId: number) => {
    const res = await apiClient.put<ApiResponse<User>>(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  deleteUser: async (userId: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/admin/users/${userId}`);
    return res.data;
  },

  getAllJobs: async () => {
    const res = await apiClient.get<ApiResponse<JobPosting[]>>('/admin/jobs');
    return res.data;
  },

  updateJobStatus: async (jobId: number, status: string) => {
    const res = await apiClient.put<ApiResponse<JobPosting>>(`/admin/jobs/${jobId}/status?status=${status}`);
    return res.data;
  },

  deleteJob: async (jobId: number) => {
    const res = await apiClient.delete<ApiResponse<void>>(`/admin/jobs/${jobId}`);
    return res.data;
  },

  getStats: async () => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/admin/stats');
    return res.data;
  },

  getReport: async () => {
    const res = await apiClient.get<ApiResponse<any>>('/admin/report');
    return res.data;
  },
};

export const getResumeDownloadUrl = (fileName: string) => {
  return `${apiClient.defaults.baseURL}/files/resumes/${fileName}`;
};
