// scripts/seed-addons.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed KategoriJadwal
  console.log('📅 Seeding KategoriJadwal...');
  const kategoriJadwalData = [
    {
      namaKategori: 'Mingguan',
      deskripsi: 'Jadwal ibadah yang dilaksanakan setiap minggu secara rutin',
      isActive: true,
    },
    {
      namaKategori: 'Bulanan',
      deskripsi: 'Jadwal ibadah yang dilaksanakan setiap bulan',
      isActive: true,
    },
    {
      namaKategori: 'Keluarga',
      deskripsi: 'Ibadah khusus untuk keluarga dan anak-anak',
      isActive: true,
    },
    {
      namaKategori: 'Remaja',
      deskripsi: 'Ibadah khusus untuk kelompok remaja dan pemuda',
      isActive: true,
    },
    {
      namaKategori: 'Khusus',
      deskripsi: 'Ibadah untuk acara-acara khusus dan perayaan',
      isActive: true,
    },
    {
      namaKategori: 'Persekutuan',
      deskripsi: 'Jadwal untuk kegiatan persekutuan kelompok kecil',
      isActive: true,
    },
    {
      namaKategori: 'Pelatihan',
      deskripsi: 'Jadwal untuk seminar, pelatihan, dan pengembangan rohani',
      isActive: true,
    },
    {
      namaKategori: 'Pelayanan',
      deskripsi: 'Jadwal untuk kegiatan pelayanan dan outreach',
      isActive: true,
    },
  ];

  for (const kategori of kategoriJadwalData) {
    // Check if kategori already exists
    const existingKategori = await prisma.kategoriJadwal.findFirst({
      where: { namaKategori: kategori.namaKategori }
    });
    
    if (!existingKategori) {
      await prisma.kategoriJadwal.create({
        data: kategori,
      });
      console.log(`✅ Created kategori: ${kategori.namaKategori}`);
    } else {
      console.log(`⏭️ Skipping existing kategori: ${kategori.namaKategori}`);
    }
  }

  // Seed JenisIbadah
  console.log('🙏 Seeding JenisIbadah...');
  const jenisIbadahData = [
    'Ibadah Minggu Pagi',
    'Ibadah Minggu Sore',
    'Ibadah Pemuda',
    'Ibadah Anak',
    'Ibadah Remaja',
    'Doa Pagi',
    'Doa Malam',
    'Ibadah Keluarga',
    'Kebaktian Kebangunan Rohani (KKR)',
    'Ibadah Natal',
    'Ibadah Paskah',
    'Ibadah Tahun Baru',
    'Persekutuan Doa',
    'Persekutuan Wanita',
    'Persekutuan Pria',
    'Sekolah Minggu',
    'Katekisasi',
    'Baptisan',
    'Perjamuan Kudus',
    'Ibadah Syukur',
    'Ibadah Pernikahan',
    'Ibadah Pemakaman',
    'Retreat Rohani',
    'Seminar Kristen',
    'Pelayanan Sosial',
    'Kunjungan Pastoral',
    'Ibadah Online',
    'Cell Group/Kelompok Kecil',
    'Ibadah Penyembuhan',
    'Vigili (Doa Semalam Suntuk)',
  ];

  for (const namaIbadah of jenisIbadahData) {
    // Check if jenis ibadah already exists
    const existingJenis = await prisma.jenisIbadah.findFirst({
      where: { namaIbadah: namaIbadah }
    });
    
    if (!existingJenis) {
      await prisma.jenisIbadah.create({
        data: {
          namaIbadah: namaIbadah,
          isActive: true,
        },
      });
      console.log(`✅ Created jenis ibadah: ${namaIbadah}`);
    } else {
      console.log(`⏭️ Skipping existing jenis ibadah: ${namaIbadah}`);
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });