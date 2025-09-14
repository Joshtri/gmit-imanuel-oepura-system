// Script untuk test dan seed data rayon
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedRayon() {
  try {
    console.log("Seeding rayon data...");

    // Create rayon data
    const rayonData = [
      { namaRayon: "I" },
      { namaRayon: "II" },
      { namaRayon: "III" },
      { namaRayon: "IV" },
      { namaRayon: "V" },
    ];

    for (const rayon of rayonData) {
      const existing = await prisma.rayon.findFirst({
        where: { namaRayon: rayon.namaRayon },
      });

      if (!existing) {
        await prisma.rayon.create({
          data: rayon,
        });
        console.log(`Created rayon: ${rayon.namaRayon}`);
      } else {
        console.log(`Rayon ${rayon.namaRayon} already exists`);
      }
    }

    console.log("Rayon seeding completed!");
  } catch (error) {
    console.error("Error seeding rayon:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function testRayon() {
  try {
    console.log("Testing rayon queries...");

    // Get all rayon
    const allRayon = await prisma.rayon.findMany({
      include: {
        _count: {
          select: {
            keluargas: true,
          },
        },
      },
    });

    console.log("All rayon:", JSON.stringify(allRayon, null, 2));
  } catch (error) {
    console.error("Error testing rayon:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run based on argument
const action = process.argv[2];

if (action === "seed") {
  seedRayon();
} else if (action === "test") {
  testRayon();
} else {
  console.log("Usage: node rayon-test.js [seed|test]");
}
