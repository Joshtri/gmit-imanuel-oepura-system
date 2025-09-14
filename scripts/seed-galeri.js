const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedGaleri() {
  try {
    console.log('🌱 Seeding galeri data...');

    // Hardcode data galeri dengan gambar yang sudah ada di S3
    const galeriData = {
      namaKegiatan: "Ibadah Minggu Januari 2024",
      deskripsi: "Dokumentasi ibadah minggu pertama bulan Januari 2024 di GMIT Imanuel Oepura. Ibadah dihadiri oleh jemaat dengan khidmat dan penuh sukacita.",
      tempat: "Gereja GMIT Imanuel Oepura",
      tanggalKegiatan: new Date("2024-01-07"),
      fotos: JSON.stringify([
        {
          originalName: "ibadah-minggu-1.jpeg",
          fileName: "galeri/1756789428652.jpeg",
          url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
          size: 245760, // Approximate size
          mimetype: "image/jpeg",
        },
        {
          originalName: "ibadah-minggu-2.jpeg", 
          fileName: "galeri/1756789428652-2.jpeg",
          url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg", // Same image for demo
          size: 245760,
          mimetype: "image/jpeg",
        },
        {
          originalName: "ibadah-minggu-3.jpeg",
          fileName: "galeri/1756789428652-3.jpeg", 
          url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg", // Same image for demo
          size: 245760,
          mimetype: "image/jpeg",
        },
        {
          originalName: "ibadah-minggu-4.jpeg",
          fileName: "galeri/1756789428652-4.jpeg", 
          url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg", // Same image for demo
          size: 245760,
          mimetype: "image/jpeg",
        }
      ]),
      isActive: true,
      isPublished: true,
      publishedAt: new Date(),
    };

    // Insert ke database
    const newGaleri = await prisma.galeri.create({
      data: galeriData,
    });

    console.log('✅ Galeri berhasil dibuat:');
    console.log('ID:', newGaleri.id);
    console.log('Nama Kegiatan:', newGaleri.namaKegiatan);
    console.log('Tempat:', newGaleri.tempat);
    console.log('Tanggal:', newGaleri.tanggalKegiatan);
    console.log('Jumlah Foto:', JSON.parse(newGaleri.fotos).length);
    console.log('Status:', newGaleri.isPublished ? 'Published' : 'Draft');
    
    // Test parse fotos
    const fotos = JSON.parse(newGaleri.fotos);
    console.log('\n📸 Foto yang tersimpan:');
    fotos.forEach((foto, index) => {
      console.log(`${index + 1}. ${foto.originalName} - ${foto.url}`);
    });

    console.log('\n🔗 Test akses gambar:');
    console.log('URL: https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg');
    console.log('Silakan buka URL di browser untuk memastikan gambar bisa diakses');

  } catch (error) {
    console.error('❌ Error seeding galeri:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGaleri();