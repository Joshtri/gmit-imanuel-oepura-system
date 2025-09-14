const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTargetFields() {
  try {
    console.log('🧪 Testing target fields...');

    // Get existing kategori and periode
    const kategori = await prisma.kategoriKeuangan.findFirst({ where: { kode: 'A' } });
    const periode = await prisma.periodeAnggaran.findFirst({ where: { tahun: 2024 } });

    if (!kategori || !periode) {
      throw new Error('Kategori atau periode tidak ditemukan');
    }

    console.log(`📋 Using kategori: ${kategori.nama} (${kategori.id})`);
    console.log(`📅 Using periode: ${periode.nama} (${periode.id})`);

    // Create item with target fields
    const item = await prisma.itemKeuangan.create({
      data: {
        kategoriId: kategori.id,
        periodeId: periode.id,
        kode: 'A.TEST',
        nama: 'Test Target Fields Item',
        deskripsi: 'Testing all target fields',
        level: 1,
        urutan: 1,
        targetFrekuensi: 12,
        satuanFrekuensi: 'bulan',
        nominalSatuan: 500000,
        totalTarget: 6000000,
        nominalActual: 0,
        jumlahTransaksi: 0,
        isActive: true
      },
      include: {
        kategori: { select: { nama: true, kode: true } },
        periode: { select: { nama: true, tahun: true } }
      }
    });

    console.log('✅ Item created successfully with target fields:');
    console.log(`   - ID: ${item.id}`);
    console.log(`   - Nama: ${item.nama}`);
    console.log(`   - Target Frekuensi: ${item.targetFrekuensi}`);
    console.log(`   - Satuan Frekuensi: ${item.satuanFrekuensi}`);
    console.log(`   - Nominal Satuan: ${item.nominalSatuan}`);
    console.log(`   - Total Target: ${item.totalTarget}`);
    console.log(`   - Kategori: ${item.kategori.nama}`);
    console.log(`   - Periode: ${item.periode.nama}`);

    return item;

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testTargetFields();