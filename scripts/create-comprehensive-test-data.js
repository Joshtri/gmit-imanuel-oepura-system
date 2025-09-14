const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createComprehensiveTestData() {
  try {
    console.log('🧪 Creating comprehensive test data...');

    // Get existing kategori and periode
    const penerimaan = await prisma.kategoriKeuangan.findFirst({ where: { kode: 'A' } });
    const pengeluaran = await prisma.kategoriKeuangan.findFirst({ where: { kode: 'B' } });
    const periode = await prisma.periodeAnggaran.findFirst({ where: { tahun: 2024 } });

    if (!penerimaan || !pengeluaran || !periode) {
      throw new Error('Kategori atau periode tidak ditemukan');
    }

    console.log(`📋 Using periode: ${periode.nama} (${periode.id})`);

    // Delete existing test data
    await prisma.itemKeuangan.deleteMany({
      where: { periodeId: periode.id }
    });

    // Create PENERIMAAN items with full hierarchy
    const penerimaan1 = await prisma.itemKeuangan.create({
      data: {
        kategoriId: penerimaan.id,
        periodeId: periode.id,
        kode: 'A',
        nama: 'PENERIMAAN GEREJA',
        deskripsi: 'Total penerimaan gereja per tahun',
        level: 1,
        urutan: 1,
        targetFrekuensi: 52,
        satuanFrekuensi: 'minggu',
        nominalSatuan: 15000000,
        totalTarget: 780000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      }
    });

    const penerimaan11 = await prisma.itemKeuangan.create({
      data: {
        kategoriId: penerimaan.id,
        periodeId: periode.id,
        parentId: penerimaan1.id,
        kode: 'A.1',
        nama: 'Persembahan Minggu',
        deskripsi: 'Persembahan ibadah minggu reguler',
        level: 2,
        urutan: 1,
        targetFrekuensi: 52,
        satuanFrekuensi: 'minggu',
        nominalSatuan: 8000000,
        totalTarget: 416000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      }
    });

    const penerimaan12 = await prisma.itemKeuangan.create({
      data: {
        kategoriId: penerimaan.id,
        periodeId: periode.id,
        parentId: penerimaan1.id,
        kode: 'A.2',
        nama: 'Persembahan Khusus',
        deskripsi: 'Persembahan untuk acara khusus',
        level: 2,
        urutan: 2,
        targetFrekuensi: 12,
        satuanFrekuensi: 'bulan',
        nominalSatuan: 5000000,
        totalTarget: 60000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      }
    });

    // Create PENGELUARAN items
    const pengeluaran1 = await prisma.itemKeuangan.create({
      data: {
        kategoriId: pengeluaran.id,
        periodeId: periode.id,
        kode: 'B',
        nama: 'PENGELUARAN GEREJA',
        deskripsi: 'Total pengeluaran operasional gereja',
        level: 1,
        urutan: 1,
        targetFrekuensi: 12,
        satuanFrekuensi: 'bulan',
        nominalSatuan: 25000000,
        totalTarget: 300000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      }
    });

    const pengeluaran11 = await prisma.itemKeuangan.create({
      data: {
        kategoriId: pengeluaran.id,
        periodeId: periode.id,
        parentId: pengeluaran1.id,
        kode: 'B.1',
        nama: 'Listrik & Air',
        deskripsi: 'Biaya listrik dan air bulanan',
        level: 2,
        urutan: 1,
        targetFrekuensi: 12,
        satuanFrekuensi: 'bulan',
        nominalSatuan: 3000000,
        totalTarget: 36000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      }
    });

    console.log('✅ Comprehensive test data created successfully:');
    console.log(`   - PENERIMAAN GEREJA (A) - Target: 780M`);
    console.log(`     - A.1 Persembahan Minggu - 52 minggu × 8M = 416M`);
    console.log(`     - A.2 Persembahan Khusus - 12 bulan × 5M = 60M`);
    console.log(`   - PENGELUARAN GEREJA (B) - Target: 300M`);
    console.log(`     - B.1 Listrik & Air - 12 bulan × 3M = 36M`);

    return { periode, penerimaan, pengeluaran };

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createComprehensiveTestData();