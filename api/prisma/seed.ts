import {
  PrismaClient,
  PlatformRole,
  OrganizationRole,
  BusinessRole,
  PromoItemType,
  DoctorType,
  VisitStatus,
} from "@prisma/client";

import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Pharma gamme options
const GAMMES = ["Cardio", "Neuro", "Dermato", "ORL", "Ophtalmo", "Gynéco"];
const CITIES = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif", "Tizi Ouzou", "Béjaïa", "Batna", "Djelfa"];
const POTENTIALS = ["A+", "A", "B+", "B", "C"];
const SPECIALITIES = [
  "Cardiologie", "Neurologie", "Dermatologie", "Médecine Générale",
  "ORL", "Ophtalmologie", "Gynécologie", "Pédiatrie", "Rhumatologie",
];

async function main() {
  console.log("🌱 Seeding started...");

  const password = await bcrypt.hash("password123", 10);

  /* =====================================================
     ORGANIZATION
  ===================================================== */

  const organization = await prisma.organization.create({
    data: {
      name: "PharmaFlow Demo",
      primaryColor: "#2563eb",
      secondaryColor: "#1e293b",
    },
  });

  /* =====================================================
     SUPER ADMIN
  ===================================================== */

  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@demo.com",
      passwordHash: password,
      firstName: "Super",
      lastName: "Admin",
      platformRole: PlatformRole.SUPER_ADMIN,
    },
  });

  /* =====================================================
     NSM
  ===================================================== */

  const nsmUser = await prisma.user.create({
    data: {
      email: "nsm@demo.com",
      passwordHash: password,
      firstName: "Mohamed",
      lastName: "Benali",
      phone: "0551000001",
    },
  });

  const nsm = await prisma.organizationUser.create({
    data: {
      id: faker.string.uuid(),
      userId: nsmUser.id,
      organizationId: organization.id,
      businessRole: BusinessRole.NSM,
      organizationRole: OrganizationRole.ADMIN,
      fullName: "Mohamed Benali",
      phone: "0551000001",
      city: "Alger",
      updatedAt: new Date(),
    },
  });

  /* =====================================================
     DSMs (3)
  ===================================================== */

  const dsms = [];
  const dsmData = [
    { firstName: "Karim", lastName: "Hadj", city: "Alger", gamme: "Cardio" },
    { firstName: "Nadia", lastName: "Merabti", city: "Oran", gamme: "Neuro" },
    { firstName: "Hichem", lastName: "Bouzid", city: "Constantine", gamme: "Dermato" },
  ];

  for (let i = 0; i < 3; i++) {
    const d = dsmData[i];
    const user = await prisma.user.create({
      data: {
        email: `dsm${i}@demo.com`,
        passwordHash: password,
        firstName: d.firstName,
        lastName: d.lastName,
        phone: `055100000${i + 2}`,
      },
    });

    const dsm = await prisma.organizationUser.create({
      data: {
        id: faker.string.uuid(),
        userId: user.id,
        organizationId: organization.id,
        businessRole: BusinessRole.DSM,
        managerId: nsm.id,
        fullName: `${d.firstName} ${d.lastName}`,
        phone: `055100000${i + 2}`,
        city: d.city,
        gamme: d.gamme,
        updatedAt: new Date(),
      },
    });

    dsms.push(dsm);
  }

  /* =====================================================
     TEAMS (2 per DSM = 6 total)
  ===================================================== */

  const teamNames = [
    ["Équipe Alger Centre", "Équipe Alger Est"],
    ["Équipe Oran Nord", "Équipe Oran Sud"],
    ["Équipe Constantine A", "Équipe Constantine B"],
  ];

  const teams = [];

  for (let di = 0; di < dsms.length; di++) {
    const dsm = dsms[di];
    for (let i = 0; i < 2; i++) {
      const team = await prisma.team.create({
        data: {
          id: faker.string.uuid(),
          name: teamNames[di][i],
          organizationId: organization.id,
          managerId: dsm.id,
          updatedAt: new Date(),
        },
      });

      teams.push({ team, dsm });
    }
  }

  /* =====================================================
     ASSISTANTS (2)
  ===================================================== */

  for (let i = 0; i < 2; i++) {
    const user = await prisma.user.create({
      data: {
        email: `assistant${i}@demo.com`,
        passwordHash: password,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: `055200000${i + 1}`,
      },
    });

    await prisma.organizationUser.create({
      data: {
        id: faker.string.uuid(),
        userId: user.id,
        organizationId: organization.id,
        businessRole: BusinessRole.ASSISTANT,
        organizationRole: OrganizationRole.ADMIN,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: `055200000${i + 1}`,
        city: faker.helpers.arrayElement(CITIES),
        updatedAt: new Date(),
      },
    });
  }

  /* =====================================================
     SECTORS (1 per DSM = 3 total)
  ===================================================== */

  const sectorNames = ["Secteur Alger 1", "Secteur Oran 1", "Secteur Constantine 1"];
  const imsIds = ["IMS-ALG-001", "IMS-ORA-001", "IMS-CST-001"];

  const sectors = [];

  for (let i = 0; i < dsms.length; i++) {
    const sector = await prisma.sector.create({
      data: {
        id: faker.string.uuid(),
        name: sectorNames[i],
        organizationId: organization.id,
        managerId: dsms[i].id,
        updatedAt: new Date(),
      },
    });

    sectors.push(sector);
  }

  /* =====================================================
     DELEGATES (3 per team = 18 total)
  ===================================================== */

  const delegates = [];

  for (const { team, dsm } of teams) {
    // Determine sector for this team's DSM
    const dsmIndex = dsms.findIndex((d) => d.id === dsm.id);
    const teamSector = sectors[dsmIndex];
    const teamGamme = GAMMES[dsmIndex % GAMMES.length];

    for (let i = 0; i < 3; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const city = faker.helpers.arrayElement(CITIES);
      const phone = `07${faker.string.numeric(8)}`;

      const user = await prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          passwordHash: password,
          firstName,
          lastName,
          phone,
        },
      });

      const delegate = await prisma.organizationUser.create({
        data: {
          id: faker.string.uuid(),
          userId: user.id,
          organizationId: organization.id,
          businessRole: BusinessRole.DELEGATE,
          managerId: dsm.id,
          teamId: team.id,
          fullName: `${firstName} ${lastName}`,
          gender: faker.helpers.arrayElement(["M", "F"]),
          phone,
          city,
          gamme: teamGamme,
          assignedSectors: [teamSector.name],
          updatedAt: new Date(),
        },
      });

      delegates.push({ delegate, sector: teamSector });
    }
  }

  /* =====================================================
     DOCTORS (120) — with extended pharma fields
  ===================================================== */

  const doctors = [];

  for (let i = 0; i < 120; i++) {
    const sectorEntry = faker.helpers.arrayElement(sectors.map((s, idx) => ({ sector: s, dsmIndex: idx })));
    const city = faker.helpers.arrayElement(CITIES);
    const potential = faker.helpers.arrayElement(POTENTIALS);
    const gamme = faker.helpers.arrayElement(GAMMES);

    const doctor = await prisma.doctor.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        speciality: faker.helpers.arrayElement(SPECIALITIES),
        type: faker.helpers.arrayElement([DoctorType.PUBLIC, DoctorType.PRIVATE, DoctorType.CHU]),
        organizationId: organization.id,
        sectorId: sectorEntry.sector.id,
        phone: `05${faker.string.numeric(8)}`,
        address: `${faker.location.streetAddress()}, ${city}`,
        city,
        sectorName: sectorEntry.sector.name,
        sectorIMS: imsIds[sectorEntry.dsmIndex],
        gamme,
        potential,
        lap: faker.helpers.arrayElement(["Nord", "Sud", "Est", "Ouest", "Centre"]),
        code: `DR-${faker.string.alphanumeric(6).toUpperCase()}`,
      },
    });

    doctors.push(doctor);
  }

  /* =====================================================
     PROMOTIONAL ITEMS — EMG + GADGET only (no SAMPLE)
  ===================================================== */

  const items = [];

  const emgItems = [
    { name: "Brochure Cardio Pro", type: PromoItemType.EMG },
    { name: "Guide Neuro 2024", type: PromoItemType.EMG },
    { name: "Fiche Technique Dermato", type: PromoItemType.EMG },
  ];

  const gadgetItems = [
    { name: "Stylo Logo PharmaFlow", type: PromoItemType.GADGET },
    { name: "Carnet de Notes", type: PromoItemType.GADGET },
    { name: "Agenda Médical", type: PromoItemType.GADGET },
  ];

  for (const itemData of [...emgItems, ...gadgetItems]) {
    const item = await prisma.promotionalItem.create({
      data: {
        id: faker.string.uuid(),
        name: itemData.name,
        type: itemData.type,
        organizationId: organization.id,
        totalStock: faker.number.int({ min: 300, max: 600 }),
        minStockLevel: 50,
        updatedAt: new Date(),
      },
    });

    items.push(item);
  }

  /* =====================================================
     STOCK ALLOCATION
  ===================================================== */

  for (const { delegate } of delegates) {
    for (const item of items) {
      await prisma.stockAllocation.create({
        data: {
          id: faker.string.uuid(),
          organizationId: organization.id,
          itemId: item.id,
          delegateId: delegate.id,
          quantity: faker.number.int({ min: 20, max: 100 }),
          updatedAt: new Date(),
        },
      });
    }
  }

  /* =====================================================
     VISITS + REPORTS (150)
  ===================================================== */

  for (let i = 0; i < 150; i++) {
    const { delegate } = faker.helpers.arrayElement(delegates);
    const doctor = faker.helpers.arrayElement(doctors);

    const status = faker.helpers.arrayElement([
      VisitStatus.PENDING_VALIDATION,
      VisitStatus.APPROVED,
      VisitStatus.COMPLETED,
    ]);

    const visit = await prisma.visit.create({
      data: {
        organizationId: organization.id,
        doctorId: doctor.id,
        delegateId: delegate.id,
        visitedAt: faker.date.recent({ days: 90 }),
        status,
        notes: faker.lorem.sentence(),
        description: status === VisitStatus.COMPLETED ? faker.lorem.paragraph() : null,
        completedAt: status === VisitStatus.COMPLETED ? faker.date.recent({ days: 30 }) : null,
      },
    });

    /* DISTRIBUTIONS — only EMG and GADGET */
    if (status === VisitStatus.COMPLETED) {
      const selectedItems = faker.helpers.arrayElements(items, faker.number.int({ min: 1, max: 2 }));
      for (const item of selectedItems) {
        await prisma.visitDistribution.create({
          data: {
            id: faker.string.uuid(),
            organizationId: organization.id,
            visitId: visit.id,
            itemId: item.id,
            quantity: faker.number.int({ min: 1, max: 5 }),
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  console.log("✅ Seed completed successfully");
  console.log(`   → ${sectors.length} secteurs`);
  console.log(`   → ${teams.length} équipes`);
  console.log(`   → ${delegates.length} délégués`);
  console.log(`   → ${doctors.length} médecins`);
  console.log(`   → ${items.length} matériaux promotionnels (EMG + GADGET uniquement)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });