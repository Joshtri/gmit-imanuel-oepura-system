const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function setupKeuanganData() {
  try {
    console.log('🚀 Setting up keuangan data...');

    // 1. Buat user admin jika belum ada
    console.log('\n👤 Membuat user admin...');
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@gmit.com',
          password: hashedPassword,
          role: 'ADMIN',
          noWhatsapp: '081234567890'
        }
      });
      console.log('✅ User admin dibuat');
    } else {
      console.log('✅ User admin sudah ada');
    }

    // 2. Buat user majelis jika belum ada
    console.log('\n👤 Membuat user majelis...');
    const majelisUser = await prisma.user.findFirst({
      where: { role: 'MAJELIS' }
    });

    if (!majelisUser) {
      const hashedPassword = await bcrypt.hash('majelis123', 10);
      
      // Buat user majelis
      const newMajelisUser = await prisma.user.create({
        data: {
          username: 'majelis',
          email: 'majelis@gmit.com',
          password: hashedPassword,
          role: 'MAJELIS',
          noWhatsapp: '081234567893'
        }
      });

      // Ambil rayon pertama
      const rayon = await prisma.rayon.findFirst();
      const jenisJabatan = await prisma.jenisJabatan.findFirst({
        where: { namaJabatan: { contains: 'Majelis' } }
      });

      // Buat record Majelis
      const newMajelis = await prisma.majelis.create({
        data: {
          namaLengkap: 'Majelis User',
          mulai: new Date(),
          selesai: null,
          idRayon: rayon?.id,
          jenisJabatanId: jenisJabatan?.id
        }
      });

      // Link user ke majelis
      await prisma.user.update({
        where: { id: newMajelisUser.id },
        data: { idMajelis: newMajelis.id }
      });

      console.log('✅ User majelis dibuat dan di-link');
    } else {
      console.log('✅ User majelis sudah ada');
    }

    // 3. Buat kategori keuangan jika belum ada
    console.log('\n💰 Membuat kategori keuangan...');
    const kategoriCount = await prisma.kategoriKeuangan.count();
    
    if (kategoriCount === 0) {
      const kategoris = [
        { nama: 'PENERIMAAN', kode: 'A' },
        { nama: 'PENGELUARAN', kode: 'B' }
      ];

      for (const kategori of kategoris) {
        await prisma.kategoriKeuangan.create({ data: kategori });
        console.log(`✅ Kategori "${kategori.nama}" dibuat`);
      }
    } else {
      console.log(`✅ Sudah ada ${kategoriCount} kategori keuangan dalam database`);
    }

    // 4. Buat periode anggaran jika belum ada
    console.log('\n📅 Membuat periode anggaran...');
    const periodeCount = await prisma.periodeAnggaran.count();
    
    if (periodeCount === 0) {
      const periodes = [
        {
          nama: 'Anggaran 2024',
          tahun: 2024,
          tanggalMulai: new Date('2024-01-01'),
          tanggalAkhir: new Date('2024-12-31'),
          status: 'ACTIVE'
        },
        {
          nama: 'Anggaran 2025', 
          tahun: 2025,
          tanggalMulai: new Date('2025-01-01'),
          tanggalAkhir: new Date('2025-12-31'),
          status: 'DRAFT'
        }
      ];

      for (const periode of periodes) {
        await prisma.periodeAnggaran.create({ data: periode });
        console.log(`✅ Periode "${periode.nama}" dibuat`);
      }
    } else {
      console.log(`✅ Sudah ada ${periodeCount} periode anggaran dalam database`);
    }

    console.log('\n🎉 Setup keuangan data selesai!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupKeuanganData();