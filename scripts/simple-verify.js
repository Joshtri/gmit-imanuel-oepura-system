const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Quick Data Verification...\n');

  try {
    // Check Users
    const userCount = await prisma.user.count();
    console.log(`👥 Users: ${userCount} records`);

    // Check some master data
    const jaminanCount = await prisma.jaminanKesehatan.count();
    console.log(`💊 Jaminan Kesehatan: ${jaminanCount} records`);

    const pekerjaanCount = await prisma.pekerjaan.count();
    console.log(`💼 Pekerjaan: ${pekerjaanCount} records`);

    const pendidikanCount = await prisma.pendidikan.count();
    console.log(`🎓 Pendidikan: ${pendidikanCount} records`);

    const sukuCount = await prisma.suku.count();
    console.log(`🏛️ Suku: ${sukuCount} records`);

    // Check if we have Jenis Ibadah
    try {
      const jenisIbadahCount = await prisma.jenisIbadah.count();
      console.log(`🙏 Jenis Ibadah: ${jenisIbadahCount} records`);
    } catch (e) {
      console.log(`🙏 Jenis Ibadah: Table not found or no data`);
    }

    // Check if we have Galeri
    try {
      const galeriCount = await prisma.galeri.count();
      console.log(`📸 Galeri: ${galeriCount} records`);
    } catch (e) {
      console.log(`📸 Galeri: Table not found or no data`);
    }

    // Show sample users
    console.log('\n👥 Sample Users:');
    const users = await prisma.user.findMany({ take: 5 });
    users.forEach(user => {
      console.log(`  • ${user.username} (${user.role}) - ${user.email}`);
    });

    console.log('\n✅ Verification completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();