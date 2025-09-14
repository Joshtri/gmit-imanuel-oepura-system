// seed-pengeluaran.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedPengeluaran() {
  console.log("🌱 Seeding data pengeluaran...");

  // 1. Buat kategori PENGELUARAN
  const kategoriPengeluaran = await prisma.kategoriKeuangan.upsert({
    where: { kode: "B" },
    update: {},
    create: {
      nama: "PENGELUARAN",
      kode: "B",
      isActive: true,
    },
  });

  // 2. Level 1 - BAGIAN BELANJA RUTIN
  const bagianBelanjaRutin = await prisma.itemKeuangan.create({
    data: {
      kategoriId: kategoriPengeluaran.id,
      kode: "A", // Sesuai dokumen, pengeluaran pakai A juga
      nama: "BAGIAN BELANJA RUTIN",
      level: 1,
      urutan: 1,
      isActive: true,
    },
  });

  // 3. Level 2 - POS-POS UTAMA
  const posPelayan = await prisma.itemKeuangan.create({
    data: {
      kategoriId: kategoriPengeluaran.id,
      parentId: bagianBelanjaRutin.id,
      kode: "A.1",
      nama: "POS PELAYAN",
      level: 2,
      urutan: 1,
      isActive: true,
    },
  });

  const posMajelis = await prisma.itemKeuangan.create({
    data: {
      kategoriId: kategoriPengeluaran.id,
      parentId: bagianBelanjaRutin.id,
      kode: "A.2",
      nama: "POS MAJELIS JEMAAT HARIAN",
      level: 2,
      urutan: 2,
      isActive: true,
    },
  });

  const posKaryawan = await prisma.itemKeuangan.create({
    data: {
      kategoriId: kategoriPengeluaran.id,
      parentId: bagianBelanjaRutin.id,
      kode: "A.3",
      nama: "POS KARYAWAN/SEKRETARIAT",
      level: 2,
      urutan: 3,
      isActive: true,
    },
  });

  // 4. Level 3 - Detail POS PELAYAN
  const detailPosPelayan = [
    {
      kode: "A.1.1",
      nama: "Tunjangan Kesra (4 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 20550000,
    },
    {
      kode: "A.1.2",
      nama: "Tunjangan khusus (4 Org x 1 Tahun)",
      target: 1,
      satuan: "Kali",
      nominal: 20550000,
    },
    {
      kode: "A.1.3",
      nama: "Tunjangan Hari Raya (4 Org x 1 Tahun)",
      target: 1,
      satuan: "Kali",
      nominal: 20550000,
    },
    {
      kode: "A.1.4",
      nama: "Biaya Chek Up Pendeta (4 Org x 1 Tahun)",
      target: 1,
      satuan: "Kali",
      nominal: 6000000,
    },
  ];

  for (let i = 0; i < detailPosPelayan.length; i++) {
    const item = detailPosPelayan[i];
    await prisma.itemKeuangan.create({
      data: {
        kategoriId: kategoriPengeluaran.id,
        parentId: posPelayan.id,
        kode: item.kode,
        nama: item.nama,
        level: 3,
        urutan: i + 1,
        targetFrekuensi: item.target,
        satuanFrekuensi: item.satuan,
        nominalSatuan: item.nominal,
        totalTarget: item.target * item.nominal,
        isActive: true,
      },
    });
  }

  // 5. Level 3 - Detail POS MAJELIS
  const detailPosMajelis = [
    {
      kode: "A.2.1",
      nama: "Honor Wakil Ketua Non Pendeta (2 Org x 1 Tahun)",
      target: 1,
      satuan: "Kali",
      nominal: 10000000,
    },
    {
      kode: "A.2.2",
      nama: "Honor Sekretaris (1 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 2500000,
    },
    {
      kode: "A.2.3",
      nama: "Honor Wakil Sekretaris (1 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 2250000,
    },
    {
      kode: "A.2.4",
      nama: "Honor Bendahara (1 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 2500000,
    },
    {
      kode: "A.2.5",
      nama: "Honor Wakil Bendahara (1 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 2250000,
    },
    {
      kode: "A.2.6",
      nama: "Tunjangan Khusus (4 Org)",
      target: 1,
      satuan: "Kali",
      nominal: 9500000,
    },
    {
      kode: "A.2.7",
      nama: "Tunjangan Hari Raya (4 Org)",
      target: 1,
      satuan: "Kali",
      nominal: 9500000,
    },
    {
      kode: "A.2.8",
      nama: "Tunjangan kesehatan MJH non Pendeta (6 Org x 1 tahun)",
      target: 1,
      satuan: "Kali",
      nominal: 6000000,
    },
  ];

  for (let i = 0; i < detailPosMajelis.length; i++) {
    const item = detailPosMajelis[i];
    await prisma.itemKeuangan.create({
      data: {
        kategoriId: kategoriPengeluaran.id,
        parentId: posMajelis.id,
        kode: item.kode,
        nama: item.nama,
        level: 3,
        urutan: i + 1,
        targetFrekuensi: item.target,
        satuanFrekuensi: item.satuan,
        nominalSatuan: item.nominal,
        totalTarget: item.target * item.nominal,
        isActive: true,
      },
    });
  }

  // 6. Level 3 - Detail POS KARYAWAN/SEKRETARIAT
  const detailPosKaryawan = [
    {
      kode: "A.3.1",
      nama: "Honor Pegawai Sekretariat (5 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 8250000,
    },
    {
      kode: "A.3.2",
      nama: "Honor Koster (4 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 6800000,
    },
    {
      kode: "A.3.3",
      nama: "Honor SatPam (3 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 4700000,
    },
    {
      kode: "A.3.4",
      nama: "Honor CaVik (6 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 4500000,
    },
    {
      kode: "A.3.5",
      nama: "Uang Saku/Lembur Sopir (1 org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 250000,
    },
    {
      kode: "A.3.6",
      nama: "Tunjangan Khusus & THR Pegawai Sekretariat (5 Org)",
      target: 2,
      satuan: "Kali",
      nominal: 8250000,
    },
    {
      kode: "A.3.7",
      nama: "Tunjangan Khusus & THR Koster (4 Org)",
      target: 2,
      satuan: "Kali",
      nominal: 6800000,
    },
    {
      kode: "A.3.8",
      nama: "Tunjangan Khusus & THR Satpam (3 Org)",
      target: 2,
      satuan: "Kali",
      nominal: 4700000,
    },
    {
      kode: "A.3.9",
      nama: "Tunjangan Khusus & THR CaVik (6 Org)",
      target: 2,
      satuan: "Kali",
      nominal: 4500000,
    },
    {
      kode: "A.3.10",
      nama: "BPJS Karyawan Sekretariat (7 Org x 12 Bln)",
      target: 12,
      satuan: "Kali",
      nominal: 1551200,
    },
    {
      kode: "A.3.11",
      nama: "Tunjangan kesehatan karyawan sekretariat (12 orang x 1 tahun)",
      target: 12,
      satuan: "Orang",
      nominal: 1000000,
    },
  ];

  for (let i = 0; i < detailPosKaryawan.length; i++) {
    const item = detailPosKaryawan[i];
    await prisma.itemKeuangan.create({
      data: {
        kategoriId: kategoriPengeluaran.id,
        parentId: posKaryawan.id,
        kode: item.kode,
        nama: item.nama,
        level: 3,
        urutan: i + 1,
        targetFrekuensi: item.target,
        satuanFrekuensi: item.satuan,
        nominalSatuan: item.nominal,
        totalTarget: item.target * item.nominal,
        isActive: true,
      },
    });
  }

  console.log("✅ Seed data pengeluaran selesai!");
}

// Export untuk digunakan
module.exports = { seedPengeluaran };

// Jika dijalankan langsung
if (require.main === module) {
  seedPengeluaran()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
