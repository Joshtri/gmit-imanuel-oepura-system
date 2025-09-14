const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed master data...');

  try {
    // 1. JAMINAN KESEHATAN
    console.log('📋 Seeding Jaminan Kesehatan...');
    const jaminanKesehatanData = [
      { jenisJaminan: 'BPJS Kesehatan' },
      { jenisJaminan: 'Asuransi Swasta' },
      { jenisJaminan: 'Jamkesmas' },
      { jenisJaminan: 'Jamkesda' },
      { jenisJaminan: 'Tidak Ada' },
      { jenisJaminan: 'KIS (Kartu Indonesia Sehat)' },
      { jenisJaminan: 'Askes TNI/Polri' },
      { jenisJaminan: 'Jaminan Perusahaan' },
    ];

    for (const item of jaminanKesehatanData) {
      const exists = await prisma.jaminanKesehatan.findFirst({
        where: { jenisJaminan: item.jenisJaminan }
      });
      if (!exists) {
        await prisma.jaminanKesehatan.create({ data: item });
      }
    }
    console.log('✅ Jaminan Kesehatan seeded');

    // 2. PENDAPATAN
    console.log('💰 Seeding Pendapatan...');
    const pendapatanData = [
      { label: 'Kurang dari Rp 1.000.000', min: 0, max: 999999 },
      { label: 'Rp 1.000.000 - Rp 2.500.000', min: 1000000, max: 2500000 },
      { label: 'Rp 2.500.000 - Rp 5.000.000', min: 2500000, max: 5000000 },
      { label: 'Rp 5.000.000 - Rp 10.000.000', min: 5000000, max: 10000000 },
      { label: 'Rp 10.000.000 - Rp 25.000.000', min: 10000000, max: 25000000 },
      { label: 'Rp 25.000.000 - Rp 50.000.000', min: 25000000, max: 50000000 },
      { label: 'Lebih dari Rp 50.000.000', min: 50000000, max: 999999999 },
      { label: 'Tidak Berpenghasilan', min: 0, max: 0 },
    ];

    for (const item of pendapatanData) {
      const exists = await prisma.pendapatan.findFirst({
        where: { label: item.label }
      });
      if (!exists) {
        await prisma.pendapatan.create({ data: item });
      }
    }
    console.log('✅ Pendapatan seeded');

    // 3. PENDIDIKAN
    console.log('🎓 Seeding Pendidikan...');
    const pendidikanData = [
      { jenjang: 'Tidak Sekolah' },
      { jenjang: 'SD/MI' },
      { jenjang: 'SMP/MTs' },
      { jenjang: 'SMA/SMK/MA' },
      { jenjang: 'Diploma I/II' },
      { jenjang: 'Diploma III' },
      { jenjang: 'Diploma IV/S1' },
      { jenjang: 'S2' },
      { jenjang: 'S3' },
      { jenjang: 'Pondok Pesantren' },
      { jenjang: 'Paket A' },
      { jenjang: 'Paket B' },
      { jenjang: 'Paket C' },
    ];

    for (const item of pendidikanData) {
      const exists = await prisma.pendidikan.findFirst({
        where: { jenjang: item.jenjang }
      });
      if (!exists) {
        await prisma.pendidikan.create({ data: item });
      }
    }
    console.log('✅ Pendidikan seeded');

    // 4. SUKU
    console.log('🏛️ Seeding Suku...');
    const sukuData = [
      { namaSuku: 'Jawa' },
      { namaSuku: 'Sunda' },
      { namaSuku: 'Batak' },
      { namaSuku: 'Bugis' },
      { namaSuku: 'Betawi' },
      { namaSuku: 'Minangkabau' },
      { namaSuku: 'Banjar' },
      { namaSuku: 'Bali' },
      { namaSuku: 'Sasak' },
      { namaSuku: 'Makassar' },
      { namaSuku: 'Cina' },
      { namaSuku: 'Arab' },
      { namaSuku: 'India' },
      { namaSuku: 'Dayak' },
      { namaSuku: 'Toraja' },
      { namaSuku: 'Ambon' },
      { namaSuku: 'Papua' },
      { namaSuku: 'Flores' },
      { namaSuku: 'Timor' },
      { namaSuku: 'Lainnya' },
    ];

    for (const item of sukuData) {
      const exists = await prisma.suku.findFirst({
        where: { namaSuku: item.namaSuku }
      });
      if (!exists) {
        await prisma.suku.create({ data: item });
      }
    }
    console.log('✅ Suku seeded');

    // 5. STATUS DALAM KELUARGA
    console.log('👨‍👩‍👧‍👦 Seeding Status Dalam Keluarga...');
    const statusDalamKeluargaData = [
      { status: 'Kepala Keluarga' },
      { status: 'Istri' },
      { status: 'Anak' },
      { status: 'Cucu' },
      { status: 'Orang Tua' },
      { status: 'Mertua' },
      { status: 'Menantu' },
      { status: 'Saudara' },
      { status: 'Keponakan' },
      { status: 'Lainnya' },
    ];

    for (const item of statusDalamKeluargaData) {
      const exists = await prisma.statusDalamKeluarga.findFirst({
        where: { status: item.status }
      });
      if (!exists) {
        await prisma.statusDalamKeluarga.create({ data: item });
      }
    }
    console.log('✅ Status Dalam Keluarga seeded');

    // 6. STATUS KEPEMILIKAN RUMAH
    console.log('🏠 Seeding Status Kepemilikan Rumah...');
    const statusKepemilikanRumahData = [
      { status: 'Milik Sendiri' },
      { status: 'Kontrak/Sewa' },
      { status: 'Menumpang' },
      { status: 'Milik Orang Tua' },
      { status: 'Milik Kerabat' },
      { status: 'Kredit/KPR' },
      { status: 'Wakaf' },
      { status: 'Tanah Negara' },
      { status: 'Lainnya' },
    ];

    for (const item of statusKepemilikanRumahData) {
      const exists = await prisma.statusKepemilikanRumah.findFirst({
        where: { status: item.status }
      });
      if (!exists) {
        await prisma.statusKepemilikanRumah.create({ data: item });
      }
    }
    console.log('✅ Status Kepemilikan Rumah seeded');

    // 7. KEADAAN RUMAH
    console.log('🏘️ Seeding Keadaan Rumah...');
    const keadaanRumahData = [
      { keadaan: 'Sangat Baik' },
      { keadaan: 'Baik' },
      { keadaan: 'Sedang' },
      { keadaan: 'Kurang Baik' },
      { keadaan: 'Rusak Ringan' },
      { keadaan: 'Rusak Berat' },
      { keadaan: 'Tidak Layak Huni' },
    ];

    for (const item of keadaanRumahData) {
      const exists = await prisma.keadaanRumah.findFirst({
        where: { keadaan: item.keadaan }
      });
      if (!exists) {
        await prisma.keadaanRumah.create({ data: item });
      }
    }
    console.log('✅ Keadaan Rumah seeded');

    // 8. STATUS KELUARGA
    console.log('💑 Seeding Status Keluarga...');
    const statusKeluargaData = [
      { status: 'Belum Kawin' },
      { status: 'Kawin' },
      { status: 'Cerai Hidup' },
      { status: 'Cerai Mati' },
    ];

    for (const item of statusKeluargaData) {
      const exists = await prisma.statusKeluarga.findFirst({
        where: { status: item.status }
      });
      if (!exists) {
        await prisma.statusKeluarga.create({ data: item });
      }
    }
    console.log('✅ Status Keluarga seeded');

    // 9. PEKERJAAN
    console.log('💼 Seeding Pekerjaan...');
    const pekerjaanData = [
      { namaPekerjaan: 'Petani' },
      { namaPekerjaan: 'Buruh Tani' },
      { namaPekerjaan: 'Nelayan' },
      { namaPekerjaan: 'Pedagang' },
      { namaPekerjaan: 'Wiraswasta' },
      { namaPekerjaan: 'PNS' },
      { namaPekerjaan: 'TNI' },
      { namaPekerjaan: 'Polri' },
      { namaPekerjaan: 'Guru' },
      { namaPekerjaan: 'Dokter' },
      { namaPekerjaan: 'Perawat' },
      { namaPekerjaan: 'Bidan' },
      { namaPekerjaan: 'Driver' },
      { namaPekerjaan: 'Buruh Pabrik' },
      { namaPekerjaan: 'Karyawan Swasta' },
      { namaPekerjaan: 'Teknisi' },
      { namaPekerjaan: 'Mekanik' },
      { namaPekerjaan: 'Tukang' },
      { namaPekerjaan: 'Penjahit' },
      { namaPekerjaan: 'Ibu Rumah Tangga' },
      { namaPekerjaan: 'Mahasiswa' },
      { namaPekerjaan: 'Pelajar' },
      { namaPekerjaan: 'Pensiunan' },
      { namaPekerjaan: 'Tidak Bekerja' },
      { namaPekerjaan: 'Lainnya' },
    ];

    for (const item of pekerjaanData) {
      const exists = await prisma.pekerjaan.findFirst({
        where: { namaPekerjaan: item.namaPekerjaan }
      });
      if (!exists) {
        await prisma.pekerjaan.create({ data: item });
      }
    }
    console.log('✅ Pekerjaan seeded');


    console.log('🎉 All master data seeded successfully!');
    
    // Print summary
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
    ]);

    console.log('\n📊 Summary:');
    console.log(`• Jaminan Kesehatan: ${counts[0]} records`);
    console.log(`• Pendapatan: ${counts[1]} records`);
    console.log(`• Pendidikan: ${counts[2]} records`);
    console.log(`• Suku: ${counts[3]} records`);
    console.log(`• Status Dalam Keluarga: ${counts[4]} records`);
    console.log(`• Status Kepemilikan Rumah: ${counts[5]} records`);
    console.log(`• Keadaan Rumah: ${counts[6]} records`);
    console.log(`• Status Keluarga: ${counts[7]} records`);
    console.log(`• Pekerjaan: ${counts[8]} records`);
    console.log(`\n🎯 Total: ${counts.reduce((a, b) => a + b, 0)} records created`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });