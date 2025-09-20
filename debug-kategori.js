const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugKategori() {
  try {
    console.log('=== DEBUG KATEGORI PENGUMUMAN ===');

    const data = await prisma.kategoriPengumuman.findMany({
      take: 5
    });

    console.log('Raw data from database:');
    data.forEach((item, index) => {
      console.log(`\n[${index + 1}] ${item.nama}:`);
      console.log('  isActive:', item.isActive);
      console.log('  isActive type:', typeof item.isActive);
      console.log('  isActive value:', JSON.stringify(item.isActive));
      console.log('  Boolean(isActive):', Boolean(item.isActive));
      console.log('  isActive ? "Aktif" : "Tidak Aktif":', item.isActive ? "Aktif" : "Tidak Aktif");
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugKategori();