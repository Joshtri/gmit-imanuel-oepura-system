const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupBasicData() {
  try {
    console.log('🚀 Setting up basic data untuk sistem...');

    // 1. Buat Rayon jika belum ada
    console.log('\n📍 Membuat data Rayon...');
    const rayonCount = await prisma.rayon.count();
    
    if (rayonCount === 0) {
      const rayons = [
        { namaRayon: 'Rayon 1' },
        { namaRayon: 'Rayon 2' },
        { namaRayon: 'Rayon 3' },
        { namaRayon: 'Rayon Pusat' }
      ];

      for (const rayon of rayons) {
        await prisma.rayon.create({ data: rayon });
        console.log(`✅ Rayon "${rayon.namaRayon}" dibuat`);
      }
    } else {
      console.log(`✅ Sudah ada ${rayonCount} rayon dalam database`);
    }

    // 2. Buat Jenis Jabatan jika belum ada
    console.log('\n💼 Membuat data Jenis Jabatan...');
    const jabatanCount = await prisma.jenisJabatan.count();
    
    if (jabatanCount === 0) {
      const jabatans = [
        { namaJabatan: 'Majelis Penatua' },
        { namaJabatan: 'Majelis Diaken' },
        { namaJabatan: 'Pendeta' },
        { namaJabatan: 'Karyawan' },
        { namaJabatan: 'Pengurus Persekutuan' }
      ];

      for (const jabatan of jabatans) {
        await prisma.jenisJabatan.create({ data: jabatan });
        console.log(`✅ Jenis Jabatan "${jabatan.namaJabatan}" dibuat`);
      }
    } else {
      console.log(`✅ Sudah ada ${jabatanCount} jenis jabatan dalam database`);
    }

    // 3. Buat Status Dalam Keluarga jika belum ada
    console.log('\n👨‍👩‍👧‍👦 Membuat data Status Dalam Keluarga...');
    const statusKeluargaCount = await prisma.statusDalamKeluarga.count();
    
    if (statusKeluargaCount === 0) {
      const statusKeluarga = [
        { status: 'Kepala Keluarga' },
        { status: 'Istri' },
        { status: 'Anak' },
        { status: 'Orang Tua' },
        { status: 'Mertua' },
        { status: 'Saudara' },
        { status: 'Lainnya' }
      ];

      for (const status of statusKeluarga) {
        await prisma.statusDalamKeluarga.create({ data: status });
        console.log(`✅ Status Dalam Keluarga "${status.status}" dibuat`);
      }
    } else {
      console.log(`✅ Sudah ada ${statusKeluargaCount} status dalam keluarga dalam database`);
    }

    console.log('\n🎉 Setup basic data selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupBasicData();