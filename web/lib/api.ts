import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken: refresh });
        localStorage.setItem("access_token", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("crm_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Typed helpers ────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const doctorsApi = {
  list: (params?: { search?: string; type?: string; sectorId?: string }) =>
    api.get("/doctors", { params }).then((r) => r.data),
  get: (id: string) => api.get(`/doctors/${id}`).then((r) => r.data),
  create: (data: any) => api.post("/doctors", data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/doctors/${id}`, data).then((r) => r.data),
  remove: (id: string) => api.delete(`/doctors/${id}`).then((r) => r.data),
  sectors: () => api.get("/doctors/sectors").then((r) => r.data),
};

export const visitsApi = {
  list: (params?: { doctorId?: string; delegateId?: string; status?: string; startDate?: string; endDate?: string; teamId?: string }) =>
    api.get("/visits", { params }).then((r) => r.data),
  get: (id: string) => api.get(`/visits/${id}`).then((r) => r.data),
  teamDelegates: () => api.get("/visits/team-delegates").then((r) => r.data),
  pendingCount: () => api.get("/visits/pending-count").then((r) => r.data),
  create: (data: any) => api.post("/visits", data).then((r) => r.data),
  createBatch: (data: { doctorIds: string[]; visitedAt: string; notes?: string }) =>
    api.post("/visits/batch", data).then((r) => r.data),
  validate: (id: string, data: { action: "approve" | "reject"; rejectionReason?: string }) =>
    api.patch(`/visits/${id}/validate`, data).then((r) => r.data),
  submitReport: (id: string, data: any) =>
    api.post(`/visits/${id}/report`, data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/visits/${id}`, data).then((r) => r.data),
  cancel: (id: string) => api.patch(`/visits/${id}/cancel`, {}).then((r) => r.data),
  remove: (id: string) => api.delete(`/visits/${id}`).then((r) => r.data),
};

export const promoItemsApi = {
  list: (params?: { search?: string; type?: string }) =>
    api.get("/promotional-items", { params }).then((r) => r.data),
  get: (id: string) => api.get(`/promotional-items/${id}`).then((r) => r.data),
  myStock: () => api.get("/promotional-items/my-stock").then((r) => r.data),
  create: (data: any) => api.post("/promotional-items", data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/promotional-items/${id}`, data).then((r) => r.data),
  allocate: (id: string, data: any) =>
    api.post(`/promotional-items/${id}/allocate`, data).then((r) => r.data),
  stockAlerts: () => api.get("/promotional-items/stock-alerts").then((r) => r.data),
};

export const usersApi = {
  list: () => api.get("/users").then((r) => r.data),
  get: (id: string) => api.get(`/users/${id}`).then((r) => r.data),
  teams: () => api.get("/users/teams").then((r) => r.data),
  create: (data: any) => api.post("/users", data).then((r) => r.data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data).then((r) => r.data),
  deactivate: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};

export const analyticsApi = {
  overview: () => api.get("/analytics/overview").then((r) => r.data),
  delegates: () => api.get("/analytics/delegates").then((r) => r.data),
  visitsTrend: () => api.get("/analytics/visits-trend").then((r) => r.data),
  coverage: () => api.get("/analytics/coverage").then((r) => r.data),
  promoItems: () => api.get("/analytics/promo-items").then((r) => r.data),
};
