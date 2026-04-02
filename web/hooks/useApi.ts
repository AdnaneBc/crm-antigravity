import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doctorsApi,
  visitsApi,
  promoItemsApi,
  usersApi,
  analyticsApi,
} from "@/lib/api";

// ─── DOCTORS ──────────────────────────────────────────────────────────────────

export function useDoctors(params?: { search?: string; type?: string; sectorId?: string }) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => doctorsApi.list(params),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: () => doctorsApi.get(id),
    enabled: !!id,
  });
}

export function useSectors() {
  return useQuery({ queryKey: ["sectors"], queryFn: doctorsApi.sectors });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useUpdateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => doctorsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

export function useDeleteDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doctorsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
}

// ─── VISITS ───────────────────────────────────────────────────────────────────

export function useVisits(params?: { doctorId?: string; delegateId?: string; status?: string; startDate?: string; endDate?: string; teamId?: string }) {
  return useQuery({
    queryKey: ["visits", params],
    queryFn: () => visitsApi.list(params),
  });
}

export function useVisit(id: string) {
  return useQuery({
    queryKey: ["visits", id],
    queryFn: () => visitsApi.get(id),
    enabled: !!id,
  });
}

/** Returns delegates that the logged-in DSM manages (for the delegate picker) */
export function useTeamDelegates() {
  return useQuery({ queryKey: ["team-delegates"], queryFn: visitsApi.teamDelegates });
}

export function useCreateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visits"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useCreateVisitBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitsApi.createBatch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visits"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => visitsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visits"] }),
  });
}

export function useDeleteVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visits"] }),
  });
}

export function useSubmitVisitReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      visitsApi.submitReport(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visits"] });
      qc.invalidateQueries({ queryKey: ["my-stock"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
}

export function useValidateVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { action: "approve" | "reject"; rejectionReason?: string } }) =>
      visitsApi.validate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["visits"] });
      qc.invalidateQueries({ queryKey: ["pending-count"] });
    },
  });
}

export function useCancelVisit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => visitsApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visits"] }),
  });
}

export function usePendingValidationCount() {
  return useQuery({
    queryKey: ["pending-count"],
    queryFn: visitsApi.pendingCount,
    refetchInterval: 60_000, // re-check every minute
  });
}

// ─── PROMOTIONAL ITEMS ────────────────────────────────────────────────────────

export function usePromoItems(params?: { search?: string; type?: string }) {
  return useQuery({
    queryKey: ["promo-items", params],
    queryFn: () => promoItemsApi.list(params),
  });
}

export function usePromoItem(id: string) {
  return useQuery({
    queryKey: ["promo-items", id],
    queryFn: () => promoItemsApi.get(id),
    enabled: !!id,
  });
}

export function useMyStock() {
  return useQuery({ queryKey: ["my-stock"], queryFn: promoItemsApi.myStock });
}

export function useAllocateStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => promoItemsApi.allocate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["promo-items"] });
      qc.invalidateQueries({ queryKey: ["stock-alerts"] });
    },
  });
}

export function useStockAlerts() {
  return useQuery({ queryKey: ["stock-alerts"], queryFn: promoItemsApi.stockAlerts });
}

// ─── USERS / TEAM ─────────────────────────────────────────────────────────────

export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: usersApi.list });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => usersApi.get(id),
    enabled: !!id,
  });
}

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: usersApi.teams });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────

export function useAnalyticsOverview() {
  return useQuery({ queryKey: ["analytics", "overview"], queryFn: analyticsApi.overview });
}

export function useAnalyticsDelegates() {
  return useQuery({ queryKey: ["analytics", "delegates"], queryFn: analyticsApi.delegates });
}

export function useVisitsTrend() {
  return useQuery({ queryKey: ["analytics", "visits-trend"], queryFn: analyticsApi.visitsTrend });
}

export function useCoverage() {
  return useQuery({ queryKey: ["analytics", "coverage"], queryFn: analyticsApi.coverage });
}

export function usePromoAnalytics() {
  return useQuery({ queryKey: ["analytics", "promo-items"], queryFn: analyticsApi.promoItems });
}
