import {
  Doctor,
  Visit,
  Product,
  Sample,
  Objective,
  DelegatePerformance,
  VisitsTrendPoint,
  RegionCoverage,
  User,
} from "@/types";

// ── Users ──────────────────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "delegate@pharma.com",
    firstName: "Sophie",
    lastName: "Martin",
    role: "DELEGATE",
    territory: "Paris Nord",
    managerId: "u3",
    organizationId: "org1",
    organizationName: "PharmaGroup",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "u2",
    email: "dsm@pharma.com",
    firstName: "Karim",
    lastName: "Belkadi",
    role: "DSM",
    territory: "Île-de-France",
    managerId: "u4",
    organizationId: "org1",
    organizationName: "PharmaGroup",
    createdAt: "2023-06-01T00:00:00Z",
  },
  {
    id: "u3",
    email: "nsm@pharma.com",
    firstName: "Claire",
    lastName: "Dupont",
    role: "NSM",
    organizationId: "org1",
    organizationName: "PharmaGroup",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "u4",
    email: "admin@pharma.com",
    firstName: "François",
    lastName: "Lambert",
    role: "ADMIN",
    organizationId: "org1",
    organizationName: "PharmaGroup",
    createdAt: "2022-12-01T00:00:00Z",
  },
];

// ── Doctors ─────────────────────────────────────────────────────────
export const MOCK_DOCTORS: Doctor[] = [
  { id: "d1", firstName: "Jean-Paul", lastName: "Moreau", speciality: "Cardiologie", city: "Paris", region: "Île-de-France", hospital: "Hôpital Lariboisière", sector: "public", segmentation: "A", phone: "+33 6 12 34 56 78", email: "jp.moreau@hospital.fr", organizationId: "org1", createdAt: "2024-01-15T00:00:00Z", visitCount: 12, lastVisit: "2025-03-10T00:00:00Z" },
  { id: "d2", firstName: "Marie", lastName: "Leclerc", speciality: "Neurologie", city: "Lyon", region: "Auvergne-Rhône-Alpes", hospital: "Clinique du Parc", sector: "private", segmentation: "A", phone: "+33 6 87 65 43 21", email: "m.leclerc@clinique.fr", organizationId: "org1", createdAt: "2024-01-20T00:00:00Z", visitCount: 8, lastVisit: "2025-03-05T00:00:00Z" },
  { id: "d3", firstName: "Ahmed", lastName: "Benali", speciality: "Médecine générale", city: "Marseille", region: "Provence-Alpes-Côte d'Azur", sector: "private", segmentation: "B", phone: "+33 6 44 55 66 77", organizationId: "org1", createdAt: "2024-02-01T00:00:00Z", visitCount: 5, lastVisit: "2025-02-28T00:00:00Z" },
  { id: "d4", firstName: "Isabelle", lastName: "Fontaine", speciality: "Oncologie", city: "Bordeaux", region: "Nouvelle-Aquitaine", hospital: "CHU de Bordeaux", sector: "CHU", segmentation: "A", email: "i.fontaine@chu-bordeaux.fr", organizationId: "org1", createdAt: "2024-02-10T00:00:00Z", visitCount: 10, lastVisit: "2025-03-08T00:00:00Z" },
  { id: "d5", firstName: "Pierre", lastName: "Rousseau", speciality: "Rhumatologie", city: "Lille", region: "Hauts-de-France", sector: "public", segmentation: "B", phone: "+33 6 22 33 44 55", organizationId: "org1", createdAt: "2024-02-15T00:00:00Z", visitCount: 6, lastVisit: "2025-03-01T00:00:00Z" },
  { id: "d6", firstName: "Fatima", lastName: "Khalid", speciality: "Endocrinologie", city: "Toulouse", region: "Occitanie", hospital: "CHU Purpan", sector: "CHU", segmentation: "A", email: "f.khalid@chu-toulouse.fr", organizationId: "org1", createdAt: "2024-03-01T00:00:00Z", visitCount: 9, lastVisit: "2025-03-12T00:00:00Z" },
  { id: "d7", firstName: "Luc", lastName: "Bernard", speciality: "Gastro-entérologie", city: "Nantes", region: "Pays de la Loire", sector: "private", segmentation: "C", organizationId: "org1", createdAt: "2024-03-10T00:00:00Z", visitCount: 3, lastVisit: "2025-02-15T00:00:00Z" },
  { id: "d8", firstName: "Sylvie", lastName: "Petit", speciality: "Pneumologie", city: "Strasbourg", region: "Grand Est", hospital: "NHC Strasbourg", sector: "CHU", segmentation: "B", phone: "+33 6 55 44 33 22", organizationId: "org1", createdAt: "2024-03-15T00:00:00Z", visitCount: 7, lastVisit: "2025-03-07T00:00:00Z" },
  { id: "d9", firstName: "Thomas", lastName: "Girard", speciality: "Pédiatrie", city: "Paris", region: "Île-de-France", hospital: "Hôpital Necker", sector: "public", segmentation: "A", email: "t.girard@necker.fr", organizationId: "org1", createdAt: "2024-04-01T00:00:00Z", visitCount: 11, lastVisit: "2025-03-11T00:00:00Z" },
  { id: "d10", firstName: "Celine", lastName: "Meyer", speciality: "Dermatologie", city: "Nice", region: "Provence-Alpes-Côte d'Azur", sector: "private", segmentation: "B", phone: "+33 6 11 22 33 44", organizationId: "org1", createdAt: "2024-04-10T00:00:00Z", visitCount: 4, lastVisit: "2025-02-20T00:00:00Z" },
  { id: "d11", firstName: "Nicolas", lastName: "Simon", speciality: "Cardiologie", city: "Lyon", region: "Auvergne-Rhône-Alpes", hospital: "Clinique du Tonkin", sector: "private", segmentation: "A", organizationId: "org1", createdAt: "2024-04-15T00:00:00Z", visitCount: 8, lastVisit: "2025-03-09T00:00:00Z" },
  { id: "d12", firstName: "Amandine", lastName: "Leroy", speciality: "Psychiatrie", city: "Paris", region: "Île-de-France", sector: "private", segmentation: "C", phone: "+33 6 77 88 99 00", organizationId: "org1", createdAt: "2024-05-01T00:00:00Z", visitCount: 2, lastVisit: "2025-02-10T00:00:00Z" },
];

// ── Products ─────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Cardiorel", molecule: "Atorvastatine", therapeuticArea: "Cardiologie", description: "Traitement de l'hypercholestérolémie et prévention cardiovasculaire primaire et secondaire.", status: "active", organizationId: "org1", createdAt: "2024-01-01T00:00:00Z", visitCount: 45, sampleCount: 230 },
  { id: "p2", name: "Neurax Pro", molecule: "Prégabaline", therapeuticArea: "Neurologie", description: "Traitement des douleurs neuropathiques périphériques et centrales.", status: "active", organizationId: "org1", createdAt: "2024-01-01T00:00:00Z", visitCount: 32, sampleCount: 165 },
  { id: "p3", name: "Oncotarget", molecule: "Bevacizumab", therapeuticArea: "Oncologie", description: "Thérapie ciblée anti-angiogénique pour cancers colorectaux et pulmonaires.", status: "active", organizationId: "org1", createdAt: "2024-01-01T00:00:00Z", visitCount: 18, sampleCount: 45 },
  { id: "p4", name: "DiabControl", molecule: "Metformine", therapeuticArea: "Endocrinologie", description: "Contrôle glycémique dans le diabète de type 2.", status: "active", organizationId: "org1", createdAt: "2024-01-01T00:00:00Z", visitCount: 55, sampleCount: 310 },
  { id: "p5", name: "RhumaFlex", molecule: "Méthotrexate", therapeuticArea: "Rhumatologie", description: "Traitement de la polyarthrite rhumatoïde et du psoriasis.", status: "active", organizationId: "org1", createdAt: "2024-01-01T00:00:00Z", visitCount: 28, sampleCount: 120 },
  { id: "p6", name: "GastroShield", molecule: "Oméprazole", therapeuticArea: "Gastro-entérologie", description: "Inhibiteur de la pompe à protons pour ulcères et RGO.", status: "inactive", organizationId: "org1", createdAt: "2023-01-01T00:00:00Z", visitCount: 12, sampleCount: 80 },
];

// ── Visits ──────────────────────────────────────────────────────────
export const MOCK_VISITS: Visit[] = [
  { id: "v1", doctorId: "d1", doctorName: "Dr. Jean-Paul Moreau", doctorSpeciality: "Cardiologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-14T09:00:00Z", visitedAt: "2025-03-14T09:00:00Z", visitType: "clinic", status: "PENDING_VALIDATION", productsDiscussed: ["Cardiorel"], nextVisitDate: "2025-04-14T00:00:00Z", organizationId: "org1", createdAt: "2025-03-10T00:00:00Z" },
  { id: "v2", doctorId: "d2", doctorName: "Dr. Marie Leclerc", doctorSpeciality: "Neurologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-13T10:30:00Z", visitedAt: "2025-03-13T10:30:00Z", visitType: "clinic", status: "COMPLETED", notes: "Très réceptive au Neurax Pro. Demande documentation.", feedback: "Positive", productsDiscussed: ["Neurax Pro"], nextVisitDate: "2025-04-15T00:00:00Z", organizationId: "org1", createdAt: "2025-03-10T00:00:00Z" },
  { id: "v3", doctorId: "d9", doctorName: "Dr. Thomas Girard", doctorSpeciality: "Pédiatrie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-14T14:00:00Z", visitedAt: "2025-03-14T14:00:00Z", visitType: "hospital", status: "APPROVED", productsDiscussed: ["DiabControl"], organizationId: "org1", createdAt: "2025-03-11T00:00:00Z" },
  { id: "v4", doctorId: "d4", doctorName: "Dr. Isabelle Fontaine", doctorSpeciality: "Oncologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-12T11:00:00Z", visitedAt: "2025-03-12T11:00:00Z", visitType: "hospital", status: "COMPLETED", notes: "Discussion sur Oncotarget. Intérêt pour essais cliniques.", feedback: "Très positive", productsDiscussed: ["Oncotarget"], organizationId: "org1", createdAt: "2025-03-09T00:00:00Z" },
  { id: "v5", doctorId: "d6", doctorName: "Dr. Fatima Khalid", doctorSpeciality: "Endocrinologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-15T09:30:00Z", visitedAt: "2025-03-15T09:30:00Z", visitType: "clinic", status: "PENDING_VALIDATION", productsDiscussed: ["DiabControl"], organizationId: "org1", createdAt: "2025-03-12T00:00:00Z" },
  { id: "v6", doctorId: "d3", doctorName: "Dr. Ahmed Benali", doctorSpeciality: "Médecine générale", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-10T08:00:00Z", visitedAt: "2025-03-10T08:00:00Z", visitType: "clinic", status: "COMPLETED", notes: "Prescripteur régulier. Satisfait des résultats.", feedback: "Positive", productsDiscussed: ["Cardiorel", "DiabControl"], nextVisitDate: "2025-04-10T00:00:00Z", organizationId: "org1", createdAt: "2025-03-07T00:00:00Z" },
  { id: "v7", doctorId: "d5", doctorName: "Dr. Pierre Rousseau", doctorSpeciality: "Rhumatologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-11T15:00:00Z", visitedAt: "2025-03-11T15:00:00Z", visitType: "clinic", status: "COMPLETED", notes: "Intérêt pour RhumaFlex nouvelles indications.", feedback: "Neutre", productsDiscussed: ["RhumaFlex"], organizationId: "org1", createdAt: "2025-03-08T00:00:00Z" },
  { id: "v8", doctorId: "d8", doctorName: "Dr. Sylvie Petit", doctorSpeciality: "Pneumologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-16T10:00:00Z", visitedAt: "2025-03-16T10:00:00Z", visitType: "hospital", status: "APPROVED", productsDiscussed: ["Cardiorel"], organizationId: "org1", createdAt: "2025-03-13T00:00:00Z" },
  { id: "v9", doctorId: "d11", doctorName: "Dr. Nicolas Simon", doctorSpeciality: "Cardiologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-08T09:00:00Z", visitedAt: "2025-03-08T09:00:00Z", visitType: "clinic", status: "COMPLETED", feedback: "Positive", productsDiscussed: ["Cardiorel", "GastroShield"], organizationId: "org1", createdAt: "2025-03-05T00:00:00Z" },
  { id: "v10", doctorId: "d1", doctorName: "Dr. Jean-Paul Moreau", doctorSpeciality: "Cardiologie", userId: "u1", delegateName: "Sophie Martin", visitDate: "2025-03-18T11:00:00Z", visitedAt: "2025-03-18T11:00:00Z", visitType: "congress", status: "PENDING_VALIDATION", productsDiscussed: ["Cardiorel"], organizationId: "org1", createdAt: "2025-03-14T00:00:00Z" },
];

// ── Samples ─────────────────────────────────────────────────────────
export const MOCK_SAMPLES: Sample[] = [
  { id: "s1", productId: "p1", productName: "Cardiorel", doctorId: "d1", doctorName: "Dr. Jean-Paul Moreau", userId: "u1", delegateName: "Sophie Martin", quantity: 5, date: "2025-03-10T00:00:00Z", organizationId: "org1" },
  { id: "s2", productId: "p2", productName: "Neurax Pro", doctorId: "d2", doctorName: "Dr. Marie Leclerc", userId: "u1", delegateName: "Sophie Martin", quantity: 3, date: "2025-03-13T00:00:00Z", organizationId: "org1" },
  { id: "s3", productId: "p4", productName: "DiabControl", doctorId: "d3", doctorName: "Dr. Ahmed Benali", userId: "u1", delegateName: "Sophie Martin", quantity: 8, date: "2025-03-10T00:00:00Z", organizationId: "org1" },
  { id: "s4", productId: "p3", productName: "Oncotarget", doctorId: "d4", doctorName: "Dr. Isabelle Fontaine", userId: "u1", delegateName: "Sophie Martin", quantity: 2, date: "2025-03-12T00:00:00Z", organizationId: "org1" },
  { id: "s5", productId: "p5", productName: "RhumaFlex", doctorId: "d5", doctorName: "Dr. Pierre Rousseau", userId: "u1", delegateName: "Sophie Martin", quantity: 4, date: "2025-03-11T00:00:00Z", organizationId: "org1" },
  { id: "s6", productId: "p1", productName: "Cardiorel", doctorId: "d9", doctorName: "Dr. Thomas Girard", userId: "u1", delegateName: "Sophie Martin", quantity: 6, date: "2025-03-05T00:00:00Z", organizationId: "org1" },
  { id: "s7", productId: "p4", productName: "DiabControl", doctorId: "d6", doctorName: "Dr. Fatima Khalid", userId: "u1", delegateName: "Sophie Martin", quantity: 10, date: "2025-03-12T00:00:00Z", organizationId: "org1" },
  { id: "s8", productId: "p1", productName: "Cardiorel", doctorId: "d11", doctorName: "Dr. Nicolas Simon", userId: "u1", delegateName: "Sophie Martin", quantity: 5, date: "2025-03-08T00:00:00Z", organizationId: "org1" },
];

// ── Objectives ───────────────────────────────────────────────────────
export const MOCK_OBJECTIVES: Objective[] = [
  { id: "o1", userId: "u1", delegateName: "Sophie Martin", productId: "p1", productName: "Cardiorel", targetVisits: 20, achievedVisits: 14, targetCoverage: 80, achievedCoverage: 65, targetSamples: 100, achievedSamples: 74, period: "2025-Q1", organizationId: "org1" },
  { id: "o2", userId: "u1", delegateName: "Sophie Martin", productId: "p4", productName: "DiabControl", targetVisits: 15, achievedVisits: 11, targetCoverage: 70, achievedCoverage: 58, targetSamples: 80, achievedSamples: 62, period: "2025-Q1", organizationId: "org1" },
  { id: "o3", userId: "u2", delegateName: "Karim Belkadi", productId: "p1", productName: "Cardiorel", targetVisits: 18, achievedVisits: 16, targetCoverage: 75, achievedCoverage: 71, targetSamples: 90, achievedSamples: 82, period: "2025-Q1", organizationId: "org1" },
  { id: "o4", userId: "u2", delegateName: "Karim Belkadi", productId: "p2", productName: "Neurax Pro", targetVisits: 12, achievedVisits: 9, targetCoverage: 60, achievedCoverage: 50, targetSamples: 60, achievedSamples: 45, period: "2025-Q1", organizationId: "org1" },
];

// ── Analytics ──────────────────────────────────────────────────────
export const MOCK_VISITS_TREND: VisitsTrendPoint[] = [
  { month: "Sep", visits: 82, planned: 100, completed: 78 },
  { month: "Oct", visits: 95, planned: 110, completed: 90 },
  { month: "Nov", visits: 88, planned: 105, completed: 83 },
  { month: "Déc", visits: 72, planned: 90, completed: 68 },
  { month: "Jan", visits: 105, planned: 120, completed: 98 },
  { month: "Fév", visits: 118, planned: 130, completed: 112 },
  { month: "Mar", visits: 96, planned: 115, completed: 89 },
];

export const MOCK_DELEGATE_PERFORMANCE: DelegatePerformance[] = [
  { name: "Sophie M.", visits: 14, coverage: 65, samples: 74, objective: 72 },
  { name: "Karim B.", visits: 16, coverage: 71, samples: 82, objective: 85 },
  { name: "Lucas D.", visits: 12, coverage: 58, samples: 55, objective: 68 },
  { name: "Emma V.", visits: 18, coverage: 78, samples: 92, objective: 91 },
  { name: "Marc T.", visits: 10, coverage: 48, samples: 42, objective: 55 },
];

export const MOCK_REGION_COVERAGE: RegionCoverage[] = [
  { region: "Île-de-France", coverage: 72, doctors: 45, visited: 32 },
  { region: "Auvergne-RA", coverage: 68, doctors: 38, visited: 26 },
  { region: "PACA", coverage: 54, doctors: 30, visited: 16 },
  { region: "Nouvelle-Aq.", coverage: 61, doctors: 28, visited: 17 },
  { region: "Occitanie", coverage: 78, doctors: 32, visited: 25 },
  { region: "Hauts-de-France", coverage: 45, doctors: 22, visited: 10 },
];

export const MOCK_PRODUCT_COVERAGE = [
  { name: "Cardiorel", value: 35 },
  { name: "DiabControl", value: 28 },
  { name: "Neurax Pro", value: 18 },
  { name: "RhumaFlex", value: 11 },
  { name: "Oncotarget", value: 8 },
];
