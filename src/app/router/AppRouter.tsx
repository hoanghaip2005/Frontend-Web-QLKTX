import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { RoleLayout } from '@/app/layouts/RoleLayout';
import { LoginPage } from '@/features/auth/login/LoginPage';
import { ProfilePage } from '@/features/auth/profile/ProfilePage';
import { AdminAllocationRulesPage } from '@/features/admin/allocation_rules/AdminAllocationRulesPage';
import { AdminBuildingsRoomsPage } from '@/features/admin/buildings_rooms/AdminBuildingsRoomsPage';
import { AdminDashboardPage } from '@/features/admin/dashboard/AdminDashboardPage';
import { AdminReportsAuditPage } from '@/features/admin/reports_audit/AdminReportsAuditPage';
import { AdminSettingsPage } from '@/features/admin/settings/AdminSettingsPage';
import { AdminUsersPage } from '@/features/admin/users/AdminUsersPage';
import { StaffAllocationPage } from '@/features/staff/allocation/StaffAllocationPage';
import { StaffApplicationsPage } from '@/features/staff/applications/StaffApplicationsPage';
import { StaffBillingPage } from '@/features/staff/billing/StaffBillingPage';
import { StaffCheckinCheckoutPage } from '@/features/staff/checkin_checkout/StaffCheckinCheckoutPage';
import { StaffDashboardPage } from '@/features/staff/dashboard/StaffDashboardPage';
import { StaffMaintenancePage } from '@/features/staff/maintenance/StaffMaintenancePage';
import { StaffResidentsPage } from '@/features/staff/residents/StaffResidentsPage';
import { StaffTasksPage } from '@/features/staff/tasks/StaffTasksPage';
import { StudentApplicationPage } from '@/features/student/application/StudentApplicationPage';
import { StudentDashboardPage } from '@/features/student/dashboard/StudentDashboardPage';
import { StudentInvoicesPage } from '@/features/student/invoices/StudentInvoicesPage';
import { StudentNotificationsPage } from '@/features/student/notifications/StudentNotificationsPage';
import { StudentRequestsPage } from '@/features/student/requests/StudentRequestsPage';
import { StudentRoomPage } from '@/features/student/room/StudentRoomPage';
import { StudentTicketsPage } from '@/features/student/tickets/StudentTicketsPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/student" element={<RoleLayout role="student" />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="application" element={<StudentApplicationPage />} />
          <Route path="room" element={<StudentRoomPage />} />
          <Route path="tickets" element={<StudentTicketsPage />} />
          <Route path="invoices" element={<StudentInvoicesPage />} />
          <Route path="requests" element={<StudentRequestsPage />} />
          <Route path="notifications" element={<StudentNotificationsPage />} />
        </Route>

        <Route path="/staff" element={<RoleLayout role="staff" />}>
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboardPage />} />
          <Route path="applications" element={<StaffApplicationsPage />} />
          <Route path="allocation" element={<StaffAllocationPage />} />
          <Route path="checkin-checkout" element={<StaffCheckinCheckoutPage />} />
          <Route path="residents" element={<StaffResidentsPage />} />
          <Route path="maintenance" element={<StaffMaintenancePage />} />
          <Route path="billing" element={<StaffBillingPage />} />
          <Route path="tasks" element={<StaffTasksPage />} />
        </Route>

        <Route path="/admin" element={<RoleLayout role="admin" />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="buildings-rooms" element={<AdminBuildingsRoomsPage />} />
          <Route path="allocation-rules" element={<AdminAllocationRulesPage />} />
          <Route path="reports-audit" element={<AdminReportsAuditPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
