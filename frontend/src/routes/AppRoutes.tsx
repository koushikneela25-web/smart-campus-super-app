import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Shared Authenticated Pages
import { ProfilePage } from '../pages/ProfilePage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { AnnouncementsPage } from '../pages/AnnouncementsPage';

// Student Pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage';
import { StudentTimetablePage } from '../pages/student/StudentTimetablePage';
import { StudentEventsPage } from '../pages/student/StudentEventsPage';
import { StudentEventDetailsPage } from '../pages/student/StudentEventDetailsPage';
import { StudentLostFoundPage } from '../pages/student/StudentLostFoundPage';

// Faculty Pages
import { FacultyDashboardPage } from '../pages/faculty/FacultyDashboardPage';
import { FacultyAttendancePage } from '../pages/faculty/FacultyAttendancePage';
import { FacultyTimetablePage } from '../pages/faculty/FacultyTimetablePage';
import { FacultyEventsPage } from '../pages/faculty/FacultyEventsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminAcademicsPage } from '../pages/admin/AdminAcademicsPage';
import { AdminTimetablePage } from '../pages/admin/AdminTimetablePage';
import { AdminAttendancePage } from '../pages/admin/AdminAttendancePage';
import { AdminLostFoundPage } from '../pages/admin/AdminLostFoundPage';
import { AdminAnnouncementsPage } from '../pages/admin/AdminAnnouncementsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes inside Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Shared Authenticated Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentTimetablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events/:id"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEventDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lost-found"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'FACULTY']}>
              <StudentLostFoundPage />
            </ProtectedRoute>
          }
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/attendance"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/timetable"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyTimetablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/events"
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyEventsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/academics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAcademicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/timetable"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminTimetablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lost-found"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLostFoundPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAnnouncementsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAuditLogsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
