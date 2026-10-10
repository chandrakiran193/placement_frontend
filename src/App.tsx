import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { PostJobPage } from './pages/recruiter/PostJobPage';
import { ManageJobsPage } from './pages/recruiter/ManageJobsPage';
import { JobApplicantsPage } from './pages/recruiter/JobApplicantsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { ManageAdminJobsPage } from './pages/admin/ManageAdminJobsPage';
import { PlacementReportsPage } from './pages/admin/PlacementReportsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListingsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/applications"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
                    <MyApplicationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER', 'ROLE_ADMIN']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/post-job"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER', 'ROLE_ADMIN']}>
                    <PostJobPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/manage-jobs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER', 'ROLE_ADMIN']}>
                    <ManageJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/applicants"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER', 'ROLE_ADMIN']}>
                    <JobApplicantsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER', 'ROLE_ADMIN']}>
                    <JobApplicantsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <ManageUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <ManageAdminJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <PlacementReportsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
