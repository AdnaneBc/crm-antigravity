import { api } from "./api";

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export const platformDashboardApi = {
  get: () => api.get("/platform-admin/dashboard").then((r) => r.data),
};

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────

export const platformOrganizationsApi = {
  list: (params?: { search?: string; status?: string }) =>
    api.get("/platform-admin/organizations", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get(`/platform-admin/organizations/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post("/platform-admin/organizations", data).then((r) => r.data),
  update: (id: string, data: any) =>
    api.patch(`/platform-admin/organizations/${id}`, data).then((r) => r.data),
  activate: (id: string) =>
    api.patch(`/platform-admin/organizations/${id}/activate`).then((r) => r.data),
  suspend: (id: string) =>
    api.patch(`/platform-admin/organizations/${id}/suspend`).then((r) => r.data),
  assignSubscription: (id: string, data: { planId: string }) =>
    api.patch(`/platform-admin/organizations/${id}/subscription`, data).then((r) => r.data),
};

// ─── USERS ────────────────────────────────────────────────────────────────────

export const platformUsersApi = {
  list: (params?: { search?: string }) =>
    api.get("/platform-admin/users", { params }).then((r) => r.data),
  get: (id: string) =>
    api.get(`/platform-admin/users/${id}`).then((r) => r.data),
  create: (data: any) =>
    api.post("/platform-admin/users", data).then((r) => r.data),
  update: (id: string, data: any) =>
    api.patch(`/platform-admin/users/${id}`, data).then((r) => r.data),
  deactivate: (id: string) =>
    api.patch(`/platform-admin/users/${id}/deactivate`).then((r) => r.data),
  resetPassword: (id: string, data: { newPassword: string }) =>
    api.post(`/platform-admin/users/${id}/reset-password`, data).then((r) => r.data),
  assignOrganization: (id: string, data: any) =>
    api.post(`/platform-admin/users/${id}/assign-organization`, data).then((r) => r.data),
  revokeOrganization: (id: string, orgId: string) =>
    api.delete(`/platform-admin/users/${id}/revoke-organization/${orgId}`).then((r) => r.data),
};

// ─── BILLING ──────────────────────────────────────────────────────────────────

export const platformBillingApi = {
  // Plans
  listPlans: () =>
    api.get("/platform-admin/billing/plans").then((r) => r.data),
  createPlan: (data: any) =>
    api.post("/platform-admin/billing/plans", data).then((r) => r.data),
  updatePlan: (id: string, data: any) =>
    api.patch(`/platform-admin/billing/plans/${id}`, data).then((r) => r.data),
  // Subscriptions
  listSubscriptions: (params?: { status?: string }) =>
    api.get("/platform-admin/billing/subscriptions", { params }).then((r) => r.data),
  // Invoices
  listInvoices: (params?: { status?: string; organizationId?: string }) =>
    api.get("/platform-admin/billing/invoices", { params }).then((r) => r.data),
  updateInvoice: (id: string, data: any) =>
    api.patch(`/platform-admin/billing/invoices/${id}`, data).then((r) => r.data),
  // Revenue
  revenue: () =>
    api.get("/platform-admin/billing/revenue").then((r) => r.data),
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export const platformAnalyticsApi = {
  revenueTrend: () =>
    api.get("/platform-admin/analytics/revenue-trend").then((r) => r.data),
  orgGrowth: () =>
    api.get("/platform-admin/analytics/org-growth").then((r) => r.data),
  userGrowth: () =>
    api.get("/platform-admin/analytics/user-growth").then((r) => r.data),
  activeOrgs: () =>
    api.get("/platform-admin/analytics/active-orgs").then((r) => r.data),
};
