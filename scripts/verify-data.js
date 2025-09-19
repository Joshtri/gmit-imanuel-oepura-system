const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyData() {
  console.log('🔍 Verifying seeded data...\n');

  try {
    // Check Users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        noWhatsapp: true
      }
    });
    console.log('👥 USERS (' + users.length + ' records):');
    users.forEach(user => {
      console.log(`  • ${user.username} (${user.role}) - ${user.email} - WA: ${user.noWhatsapp}`);
    });

    // Check Master Data counts
    console.log('\n📊 MASTER DATA COUNTS:');
    const counts = await Promise.all([
      prisma.jaminanKesehatan.count(),
      prisma.pendapatan.count(),
      prisma.pendidikan.count(),
      prisma.suku.count(),
      prisma.statusDalamKeluarga.count(),
      prisma.statusKepemilikanRumah.count(),
      prisma.keadaanRumah.count(),
      prisma.statusKeluarga.count(),
      prisma.pekerjaan.count(),
      prisma.kategoriJadwal.count(),
      prisma.jenisIbadah.count(),
      prisma.galeri.count(),
      prisma.fotoGaleri.count(),
    ]);

    const labels = [
      'Jaminan Kesehatan',
      'Pendapatan',
      'Pendidikan',
      'Suku',
      'Status Dalam Keluarga',
      'Status Kepemilikan Rumah',
      'Keadaan Rumah',
      'Status Keluarga',
      'Pekerjaan',
      'Kategori Jadwal',
      'Jenis Ibadah',
      'Galeri',
      'Foto Galeri'
    ];

    labels.forEach((label, index) => {
      console.log(`  • ${label}: ${counts[index]} records`);
    });

    // Show some sample data
    console.log('\n📋 SAMPLE DATA:');

    // Sample Pekerjaan
    const samplePekerjaan = await prisma.pekerjaan.findMany({ take: 5 });
    console.log('\n💼 Sample Pekerjaan:');
    samplePekerjaan.forEach(item => console.log(`  • ${item.namaPekerjaan}`));

    // Sample Jenis Ibadah
    const sampleJenisIbadah = await prisma.jenisIbadah.findMany({ take: 5 });
    console.log('\n🙏 Sample Jenis Ibadah:');
    sampleJenisIbadah.forEach(item => console.log(`  • ${item.namaIbadah}`));

    // Sample Galeri
    const sampleGaleri = await prisma.galeri.findMany({
      take: 3,
      include: {
        fotos: true
      }
    });
    console.log('\n📸 Sample Galeri:');
    sampleGaleri.forEach(item => {
      console.log(`  • ${item.namaKegiatan} (${item.fotos.length} fotos) - ${item.tempat}`);
    });

    console.log('\n✅ Data verification completed!');
    console.log(`\n🎯 Total Records: ${counts.reduce((a, b) => a + b, 0) + users.length}`);

  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();