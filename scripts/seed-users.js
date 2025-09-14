// seed-users.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function seedUsers() {
  console.log("🌱 Seeding data users...");

  // Hash password untuk semua user
  const defaultPassword = await bcrypt.hash("password123", 10);

  // 1. User ADMIN
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@gmit.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@gmit.com",
      password: defaultPassword,
      role: "ADMIN",
      noWhatsapp: "081234567890",
    },
  });

  // 2. User EMPLOYEE  
  const employeeUser = await prisma.user.upsert({
    where: { email: "employee@gmit.com" },
    update: {},
    create: {
      username: "employee",
      email: "employee@gmit.com", 
      password: defaultPassword,
      role: "EMPLOYEE",
      noWhatsapp: "081234567891",
    },
  });

  // 3. User PENDETA
  const pendetaUser = await prisma.user.upsert({
    where: { email: "pendeta@gmit.com" },
    update: {},
    create: {
      username: "pendeta",
      email: "pendeta@gmit.com",
      password: defaultPassword, 
      role: "PENDETA",
      noWhatsapp: "081234567892",
    },
  });

  // 4. User MAJELIS (contoh)
  const majelisUser = await prisma.user.upsert({
    where: { email: "majelis@gmit.com" },
    update: {},
    create: {
      username: "majelis",
      email: "majelis@gmit.com",
      password: defaultPassword,
      role: "MAJELIS", 
      noWhatsapp: "081234567893",
    },
  });

  // 5. User JEMAAT (contoh)
  const jemaatUser = await prisma.user.upsert({
    where: { email: "jemaat@gmit.com" },
    update: {},
    create: {
      username: "jemaat",
      email: "jemaat@gmit.com",
      password: defaultPassword,
      role: "JEMAAT",
      noWhatsapp: "081234567894",
    },
  });

  console.log("✅ Seed data users selesai!");
  console.log("📋 Users yang dibuat:");
  console.log("- Admin: admin@gmit.com / password123");
  console.log("- Employee: employee@gmit.com / password123"); 
  console.log("- Pendeta: pendeta@gmit.com / password123");
  console.log("- Majelis: majelis@gmit.com / password123");
  console.log("- Jemaat: jemaat@gmit.com / password123");
}

// Export untuk digunakan
module.exports = { seedUsers };

// Jika dijalankan langsung
if (require.main === module) {
  seedUsers()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}