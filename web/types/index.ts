// Core role types
export type Role = "SUPER_ADMIN" | "ADMIN" | "NSM" | "DSM" | "DELEGATE" | "ASSISTANT";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  territory?: string;
  managerId?: string;
  organizationId: string;
  organizationName?: string;
  avatar?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "pro" | "enterprise";
  logo?: string;
  createdAt: string;
}

// Doctor
export type DoctorSector = "public" | "private" | "CHU";
export type DoctorSegmentation = "A" | "B" | "C";
export type Speciality =
  | "Cardiologie"
  | "Neurologie"
  | "Oncologie"
  | "Pédiatrie"
  | "Médecine générale"
  | "Psychiatrie"
  | "Rhumatologie"
  | "Endocrinologie"
  | "Gastro-entérologie"
  | "Pneumologie"
  | "Dermatologie"
  | "Ophtalmologie"
  | "Urologie";

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  speciality: Speciality | string;
  city: string;
  region: string;
  hospital?: string;
  sector: DoctorSector;
  segmentation: DoctorSegmentation;
  phone?: string;
  email?: string;
  notes?: string;
  organizationId: string;
  createdAt: string;
  visitCount?: number;
  lastVisit?: string;
}

// Visit
export type VisitType = "clinic" | "hospital" | "congress" | "pharmacy";
export type VisitStatus = "planned" | "completed" | "cancelled" | "postponed";

export interface Visit {
  id: string;
  doctorId: string;
  doctorName?: string;
  doctorSpeciality?: string;
  userId: string;
  delegateName?: string;
  visitDate: string;
  visitType: VisitType;
  status: VisitStatus;
  notes?: string;
  feedback?: string;
  productsDiscussed?: string[];
  nextVisitDate?: string;
  organizationId: string;
  createdAt: string;
}

// Product
export type ProductStatus = "active" | "inactive" | "pending";

export interface Product {
  id: string;
  name: string;
  molecule: string;
  therapeuticArea: string;
  description?: string;
  status: ProductStatus;
  organizationId: string;
  createdAt: string;
  visitCount?: number;
  sampleCount?: number;
}

// Sample
export interface Sample {
  id: string;
  productId: string;
  productName?: string;
  doctorId: string;
  doctorName?: string;
  userId: string;
  delegateName?: string;
  quantity: number;
  date: string;
  organizationId: string;
}

// Objective
export interface Objective {
  id: string;
  userId: string;
  delegateName?: string;
  productId?: string;
  productName?: string;
  targetVisits: number;
  achievedVisits?: number;
  targetCoverage: number;
  achievedCoverage?: number;
  targetSamples: number;
  achievedSamples?: number;
  period: string; // e.g. "2025-Q1"
  organizationId: string;
}

// Analytics
export interface VisitsTrendPoint {
  month: string;
  visits: number;
  planned: number;
  completed: number;
}

export interface DelegatePerformance {
  name: string;
  visits: number;
  coverage: number;
  samples: number;
  objective: number;
}

export interface RegionCoverage {
  region: string;
  coverage: number;
  doctors: number;
  visited: number;
}

// Auth
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Dashboard KPI
export interface KpiCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
}
