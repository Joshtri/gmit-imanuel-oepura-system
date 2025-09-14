const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixMajelisUser() {
  try {
    console.log('🔍 Mencari user dengan role MAJELIS yang tidak memiliki majelis record...');
    
    // Cari user majelis yang tidak memiliki idMajelis
    const majelisUsers = await prisma.user.findMany({
      where: {
        role: 'MAJELIS',
        idMajelis: null
      },
      include: {
        majelis: true
      }
    });

    console.log(`📊 Ditemukan ${majelisUsers.length} user MAJELIS tanpa majelis record`);

    if (majelisUsers.length === 0) {
      console.log('✅ Semua user MAJELIS sudah memiliki majelis record');
      return;
    }

    // Tampilkan daftar user yang bermasalah
    console.log('\n👤 User MAJELIS yang bermasalah:');
    majelisUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email}) - ID: ${user.id}`);
    });

    // Cek apakah ada rayon yang bisa digunakan
    const rayons = await prisma.rayon.findMany({
      select: { id: true, namaRayon: true }
    });

    console.log(`\n🏘️ Ditemukan ${rayons.length} rayon:`);
    rayons.forEach((rayon, index) => {
      console.log(`${index + 1}. ${rayon.namaRayon} (ID: ${rayon.id})`);
    });

    if (rayons.length === 0) {
      console.log('❌ Tidak ada rayon yang ditemukan. Silakan buat rayon terlebih dahulu.');
      return;
    }

    // Cek apakah ada jenis jabatan
    const jenisJabatans = await prisma.jenisJabatan.findMany({
      select: { id: true, namaJabatan: true }
    });

    console.log(`\n💼 Ditemukan ${jenisJabatans.length} jenis jabatan:`);
    jenisJabatans.forEach((jabatan, index) => {
      console.log(`${index + 1}. ${jabatan.namaJabatan} (ID: ${jabatan.id})`);
    });

    // Untuk setiap user majelis, buat record majelis
    for (const user of majelisUsers) {
      console.log(`\n🔧 Membuat record Majelis untuk user: ${user.username}`);
      
      // Ambil rayon pertama sebagai default (bisa disesuaikan)
      const defaultRayon = rayons[0];
      const defaultJabatan = jenisJabatans.find(j => j.namaJabatan.toLowerCase().includes('majelis')) || jenisJabatans[0];
      
      // Buat record Majelis baru
      const newMajelis = await prisma.majelis.create({
        data: {
          namaLengkap: user.username || `Majelis ${user.email}`,
          mulai: new Date(), // Tanggal hari ini
          selesai: null, // Masih aktif
          idRayon: defaultRayon.id,
          jenisJabatanId: defaultJabatan?.id || null
        }
      });

      console.log(`✅ Record Majelis dibuat dengan ID: ${newMajelis.id}`);

      // Update user untuk link ke majelis yang baru dibuat
      await prisma.user.update({
        where: { id: user.id },
        data: {
          idMajelis: newMajelis.id
        }
      });

      console.log(`✅ User ${user.username} berhasil di-link ke Majelis record`);
    }

    console.log('\n🎉 Semua user MAJELIS berhasil diperbaiki!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixMajelisUser();