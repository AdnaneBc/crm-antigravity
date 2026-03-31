"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
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
    const organization = await prisma.organization.create({
        data: {
            name: "PharmaFlow Demo",
            primaryColor: "#2563eb",
            secondaryColor: "#1e293b",
        },
    });
    const superAdmin = await prisma.user.create({
        data: {
            email: "superadmin@demo.com",
            passwordHash: password,
            firstName: "Super",
            lastName: "Admin",
            platformRole: client_1.PlatformRole.SUPER_ADMIN,
        },
    });
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
            id: faker_1.faker.string.uuid(),
            userId: nsmUser.id,
            organizationId: organization.id,
            businessRole: client_1.BusinessRole.NSM,
            organizationRole: client_1.OrganizationRole.ADMIN,
            fullName: "Mohamed Benali",
            phone: "0551000001",
            city: "Alger",
            updatedAt: new Date(),
        },
    });
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
                id: faker_1.faker.string.uuid(),
                userId: user.id,
                organizationId: organization.id,
                businessRole: client_1.BusinessRole.DSM,
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
                    id: faker_1.faker.string.uuid(),
                    name: teamNames[di][i],
                    organizationId: organization.id,
                    managerId: dsm.id,
                    updatedAt: new Date(),
                },
            });
            teams.push({ team, dsm });
        }
    }
    for (let i = 0; i < 2; i++) {
        const user = await prisma.user.create({
            data: {
                email: `assistant${i}@demo.com`,
                passwordHash: password,
                firstName: faker_1.faker.person.firstName(),
                lastName: faker_1.faker.person.lastName(),
                phone: `055200000${i + 1}`,
            },
        });
        await prisma.organizationUser.create({
            data: {
                id: faker_1.faker.string.uuid(),
                userId: user.id,
                organizationId: organization.id,
                businessRole: client_1.BusinessRole.ASSISTANT,
                organizationRole: client_1.OrganizationRole.ADMIN,
                fullName: `${user.firstName} ${user.lastName}`,
                phone: `055200000${i + 1}`,
                city: faker_1.faker.helpers.arrayElement(CITIES),
                updatedAt: new Date(),
            },
        });
    }
    const sectorNames = ["Secteur Alger 1", "Secteur Oran 1", "Secteur Constantine 1"];
    const imsIds = ["IMS-ALG-001", "IMS-ORA-001", "IMS-CST-001"];
    const sectors = [];
    for (let i = 0; i < dsms.length; i++) {
        const sector = await prisma.sector.create({
            data: {
                id: faker_1.faker.string.uuid(),
                name: sectorNames[i],
                organizationId: organization.id,
                managerId: dsms[i].id,
                updatedAt: new Date(),
            },
        });
        sectors.push(sector);
    }
    const delegates = [];
    for (const { team, dsm } of teams) {
        const dsmIndex = dsms.findIndex((d) => d.id === dsm.id);
        const teamSector = sectors[dsmIndex];
        const teamGamme = GAMMES[dsmIndex % GAMMES.length];
        for (let i = 0; i < 3; i++) {
            const firstName = faker_1.faker.person.firstName();
            const lastName = faker_1.faker.person.lastName();
            const city = faker_1.faker.helpers.arrayElement(CITIES);
            const phone = `07${faker_1.faker.string.numeric(8)}`;
            const user = await prisma.user.create({
                data: {
                    email: faker_1.faker.internet.email({ firstName, lastName }).toLowerCase(),
                    passwordHash: password,
                    firstName,
                    lastName,
                    phone,
                },
            });
            const delegate = await prisma.organizationUser.create({
                data: {
                    id: faker_1.faker.string.uuid(),
                    userId: user.id,
                    organizationId: organization.id,
                    businessRole: client_1.BusinessRole.DELEGATE,
                    managerId: dsm.id,
                    teamId: team.id,
                    fullName: `${firstName} ${lastName}`,
                    gender: faker_1.faker.helpers.arrayElement(["M", "F"]),
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
    const doctors = [];
    for (let i = 0; i < 120; i++) {
        const sectorEntry = faker_1.faker.helpers.arrayElement(sectors.map((s, idx) => ({ sector: s, dsmIndex: idx })));
        const city = faker_1.faker.helpers.arrayElement(CITIES);
        const potential = faker_1.faker.helpers.arrayElement(POTENTIALS);
        const gamme = faker_1.faker.helpers.arrayElement(GAMMES);
        const doctor = await prisma.doctor.create({
            data: {
                firstName: faker_1.faker.person.firstName(),
                lastName: faker_1.faker.person.lastName(),
                speciality: faker_1.faker.helpers.arrayElement(SPECIALITIES),
                type: faker_1.faker.helpers.arrayElement([client_1.DoctorType.PUBLIC, client_1.DoctorType.PRIVATE, client_1.DoctorType.CHU]),
                organizationId: organization.id,
                sectorId: sectorEntry.sector.id,
                phone: `05${faker_1.faker.string.numeric(8)}`,
                address: `${faker_1.faker.location.streetAddress()}, ${city}`,
                city,
                sectorName: sectorEntry.sector.name,
                sectorIMS: imsIds[sectorEntry.dsmIndex],
                gamme,
                potential,
                lap: faker_1.faker.helpers.arrayElement(["Nord", "Sud", "Est", "Ouest", "Centre"]),
                code: `DR-${faker_1.faker.string.alphanumeric(6).toUpperCase()}`,
            },
        });
        doctors.push(doctor);
    }
    const items = [];
    const emgItems = [
        { name: "Brochure Cardio Pro", type: client_1.PromoItemType.EMG },
        { name: "Guide Neuro 2024", type: client_1.PromoItemType.EMG },
        { name: "Fiche Technique Dermato", type: client_1.PromoItemType.EMG },
    ];
    const gadgetItems = [
        { name: "Stylo Logo PharmaFlow", type: client_1.PromoItemType.GADGET },
        { name: "Carnet de Notes", type: client_1.PromoItemType.GADGET },
        { name: "Agenda Médical", type: client_1.PromoItemType.GADGET },
    ];
    for (const itemData of [...emgItems, ...gadgetItems]) {
        const item = await prisma.promotionalItem.create({
            data: {
                id: faker_1.faker.string.uuid(),
                name: itemData.name,
                type: itemData.type,
                organizationId: organization.id,
                totalStock: faker_1.faker.number.int({ min: 300, max: 600 }),
                minStockLevel: 50,
                updatedAt: new Date(),
            },
        });
        items.push(item);
    }
    for (const { delegate } of delegates) {
        for (const item of items) {
            await prisma.stockAllocation.create({
                data: {
                    id: faker_1.faker.string.uuid(),
                    organizationId: organization.id,
                    itemId: item.id,
                    delegateId: delegate.id,
                    quantity: faker_1.faker.number.int({ min: 20, max: 100 }),
                    updatedAt: new Date(),
                },
            });
        }
    }
    for (let i = 0; i < 150; i++) {
        const { delegate } = faker_1.faker.helpers.arrayElement(delegates);
        const doctor = faker_1.faker.helpers.arrayElement(doctors);
        const status = faker_1.faker.helpers.arrayElement([
            client_1.VisitStatus.PENDING_VALIDATION,
            client_1.VisitStatus.APPROVED,
            client_1.VisitStatus.COMPLETED,
        ]);
        const visit = await prisma.visit.create({
            data: {
                organizationId: organization.id,
                doctorId: doctor.id,
                delegateId: delegate.id,
                visitedAt: faker_1.faker.date.recent({ days: 90 }),
                status,
                notes: faker_1.faker.lorem.sentence(),
                description: status === client_1.VisitStatus.COMPLETED ? faker_1.faker.lorem.paragraph() : null,
                completedAt: status === client_1.VisitStatus.COMPLETED ? faker_1.faker.date.recent({ days: 30 }) : null,
            },
        });
        if (status === client_1.VisitStatus.COMPLETED) {
            const selectedItems = faker_1.faker.helpers.arrayElements(items, faker_1.faker.number.int({ min: 1, max: 2 }));
            for (const item of selectedItems) {
                await prisma.visitDistribution.create({
                    data: {
                        id: faker_1.faker.string.uuid(),
                        organizationId: organization.id,
                        visitId: visit.id,
                        itemId: item.id,
                        quantity: faker_1.faker.number.int({ min: 1, max: 5 }),
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
//# sourceMappingURL=seed.js.map