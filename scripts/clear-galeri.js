const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearGaleri() {
  try {
    await prisma.galeri.deleteMany({ where: { isActive: true } });
    console.log('✅ Cleared existing galeri data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearGaleri();