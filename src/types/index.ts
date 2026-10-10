export type Role = 'ROLE_STUDENT' | 'ROLE_RECRUITER' | 'ROLE_ADMIN';

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfile {
  id?: number;
  user?: User;
  rollNumber?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
  resumeUploadedAt?: string;
}

export interface RecruiterProfile {
  id?: number;
  user?: User;
  companyName?: string;
  companyWebsite?: string;
  companyLocation?: string;
  designation?: string;
  companyDescription?: string;
  industryType?: string;
}

export interface JobPosting {
  id: number;
  recruiter?: User;
  title: string;
  companyName: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP' | 'PART_TIME' | string;
  location: string;
  salaryPackage: number;
  minCgpa?: number;
  eligibleDepartments?: string;
  skillsRequired?: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  openingsCount?: number;
  applicationDeadline?: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplication {
  id: number;
  job: JobPosting;
  student: User;
  status: ApplicationStatus;
  coverNote?: string;
  resumeUrl?: string;
  recruiterFeedback?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface Interview {
  id: number;
  application: JobApplication;
  interviewDate: string;
  durationMinutes: number;
  interviewRound: string;
  mode: 'ONLINE' | 'OFFLINE';
  meetingLink?: string;
  location?: string;
  instructions?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface JobApplicantResponse {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  rollNumber?: string;
  department?: string;
  degree?: string;
  graduationYear?: number;
  cgpa?: number;
  skills?: string;
  resumeUrl?: string;
  resumeOriginalName?: string;
  coverNote?: string;
  status: ApplicationStatus;
  recruiterFeedback?: string;
  appliedAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalRecruiters: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  placedStudents: number;
  placementRate: number;
  averageSalary: number;
  highestSalary: number;
  applicationsByStatus: Record<string, number>;
  studentsByDepartment: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}
