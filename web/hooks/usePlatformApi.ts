import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  platformDashboardApi,
  platformOrganizationsApi,
  platformUsersApi,
  platformBillingApi,
  platformAnalyticsApi,
} from "@/lib/platformApi";

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export function usePlatformDashboard() {
  return useQuery({
    queryKey: ["platform", "dashboard"],
    queryFn: platformDashboardApi.get,
  });
}

// ─── ORGANIZATIONS ────────────────────────────────────────────────────────────

export function usePlatformOrganizations(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ["platform", "organizations", params],
    queryFn: () => platformOrganizationsApi.list(params),
  });
}

export function usePlatformOrganization(id: string) {
  return useQuery({
    queryKey: ["platform", "organizations", id],
    queryFn: () => platformOrganizationsApi.get(id),
    enabled: !!id,
  });
}

export function useCreatePlatformOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: platformOrganizationsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform", "organizations"] });
      qc.invalidateQueries({ queryKey: ["platform", "dashboard"] });
    },
  });
}

export function useUpdatePlatformOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      platformOrganizationsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "organizations"] }),
  });
}

export function useActivateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => platformOrganizationsApi.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform", "organizations"] });
      qc.invalidateQueries({ queryKey: ["platform", "dashboard"] });
    },
  });
}

export function useSuspendOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => platformOrganizationsApi.suspend(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform", "organizations"] });
      qc.invalidateQueries({ queryKey: ["platform", "dashboard"] });
    },
  });
}

export function useAssignSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, planId }: { id: string; planId: string }) =>
      platformOrganizationsApi.assignSubscription(id, { planId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform"] }),
  });
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export function usePlatformUsers(params?: { search?: string }) {
  return useQuery({
    queryKey: ["platform", "users", params],
    queryFn: () => platformUsersApi.list(params),
  });
}

export function usePlatformUser(id: string) {
  return useQuery({
    queryKey: ["platform", "users", id],
    queryFn: () => platformUsersApi.get(id),
    enabled: !!id,
  });
}

export function useCreatePlatformUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: platformUsersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform", "users"] });
      qc.invalidateQueries({ queryKey: ["platform", "dashboard"] });
    },
  });
}

export function useUpdatePlatformUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      platformUsersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "users"] }),
  });
}

export function useDeactivatePlatformUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => platformUsersApi.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "users"] }),
  });
}

export function useResetPlatformUserPassword() {
  return useMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      platformUsersApi.resetPassword(id, { newPassword }),
  });
}

export function useAssignUserOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      platformUsersApi.assignOrganization(userId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "users"] }),
  });
}

export function useRevokeUserOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, orgId }: { userId: string; orgId: string }) =>
      platformUsersApi.revokeOrganization(userId, orgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "users"] }),
  });
}

// ─── BILLING ──────────────────────────────────────────────────────────────────

export function usePlatformPlans() {
  return useQuery({
    queryKey: ["platform", "billing", "plans"],
    queryFn: platformBillingApi.listPlans,
  });
}

export function useCreatePlatformPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: platformBillingApi.createPlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "billing", "plans"] }),
  });
}

export function useUpdatePlatformPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      platformBillingApi.updatePlan(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "billing", "plans"] }),
  });
}

export function usePlatformSubscriptions(params?: { status?: string }) {
  return useQuery({
    queryKey: ["platform", "billing", "subscriptions", params],
    queryFn: () => platformBillingApi.listSubscriptions(params),
  });
}

export function usePlatformInvoices(params?: { status?: string; organizationId?: string }) {
  return useQuery({
    queryKey: ["platform", "billing", "invoices", params],
    queryFn: () => platformBillingApi.listInvoices(params),
  });
}

export function useUpdatePlatformInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      platformBillingApi.updateInvoice(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform", "billing", "invoices"] }),
  });
}

export function usePlatformRevenue() {
  return useQuery({
    queryKey: ["platform", "billing", "revenue"],
    queryFn: platformBillingApi.revenue,
  });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export function usePlatformRevenueTrend() {
  return useQuery({
    queryKey: ["platform", "analytics", "revenue-trend"],
    queryFn: platformAnalyticsApi.revenueTrend,
  });
}

export function usePlatformOrgGrowth() {
  return useQuery({
    queryKey: ["platform", "analytics", "org-growth"],
    queryFn: platformAnalyticsApi.orgGrowth,
  });
}

export function usePlatformUserGrowth() {
  return useQuery({
    queryKey: ["platform", "analytics", "user-growth"],
    queryFn: platformAnalyticsApi.userGrowth,
  });
}

export function usePlatformActiveOrgs() {
  return useQuery({
    queryKey: ["platform", "analytics", "active-orgs"],
    queryFn: platformAnalyticsApi.activeOrgs,
  });
}
