const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedMoreGaleri() {
  try {
    console.log('🌱 Seeding more galeri data...');

    const galeriList = [
      {
        namaKegiatan: "Natal Bersama 2023",
        deskripsi: "Perayaan Natal bersama keluarga besar GMIT Imanuel Oepura dengan tema 'Kasih yang Menerangi'. Acara berlangsung meriah dengan berbagai penampilan dari anak sekolah minggu hingga paduan suara dewasa.",
        tempat: "Aula Gereja GMIT Imanuel Oepura",
        tanggalKegiatan: new Date("2023-12-24"),
        isPublished: true,
        fotos: [
          {
            originalName: "natal-bersama-1.jpeg",
            fileName: "galeri/natal-2023-1.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "natal-bersama-2.jpeg",
            fileName: "galeri/natal-2023-2.jpeg", 
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          }
        ]
      },
      {
        namaKegiatan: "Sekolah Minggu - Belajar Kasih",
        deskripsi: "Kegiatan sekolah minggu dengan tema 'Belajar Kasih dari Yesus'. Anak-anak antusias mengikuti cerita Alkitab dan berbagai permainan edukatif.",
        tempat: "Ruang Sekolah Minggu",
        tanggalKegiatan: new Date("2024-01-14"),
        isPublished: false, // Draft
        fotos: [
          {
            originalName: "sekolah-minggu-1.jpeg",
            fileName: "galeri/sm-2024-1.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "sekolah-minggu-2.jpeg",
            fileName: "galeri/sm-2024-2.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "sekolah-minggu-3.jpeg",
            fileName: "galeri/sm-2024-3.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          }
        ]
      },
      {
        namaKegiatan: "Bakti Sosial di Panti Asuhan",
        deskripsi: "Kegiatan bakti sosial jemaat GMIT Imanuel Oepura di Panti Asuhan Kasih Sayang. Memberikan bantuan sembako, pakaian layak pakai, dan berbagi kasih dengan anak-anak panti.",
        tempat: "Panti Asuhan Kasih Sayang",
        tanggalKegiatan: new Date("2024-01-21"),
        isPublished: true,
        fotos: [
          {
            originalName: "baksos-1.jpeg",
            fileName: "galeri/baksos-2024-1.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "baksos-2.jpeg",
            fileName: "galeri/baksos-2024-2.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "baksos-3.jpeg", 
            fileName: "galeri/baksos-2024-3.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "baksos-4.jpeg",
            fileName: "galeri/baksos-2024-4.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          },
          {
            originalName: "baksos-5.jpeg",
            fileName: "galeri/baksos-2024-5.jpeg",
            url: "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
            size: 245760,
            mimetype: "image/jpeg",
          }
        ]
      }
    ];

    for (const galeri of galeriList) {
      const galeriData = {
        namaKegiatan: galeri.namaKegiatan,
        deskripsi: galeri.deskripsi,
        tempat: galeri.tempat,
        tanggalKegiatan: galeri.tanggalKegiatan,
        fotos: JSON.stringify(galeri.fotos),
        isActive: true,
        isPublished: galeri.isPublished,
        publishedAt: galeri.isPublished ? new Date() : null,
      };

      const newGaleri = await prisma.galeri.create({
        data: galeriData,
      });

      console.log(`✅ Created: "${newGaleri.namaKegiatan}" (${galeri.fotos.length} photos, ${newGaleri.isPublished ? 'Published' : 'Draft'})`);
    }

    // Summary
    console.log('\n📊 Database Summary:');
    const total = await prisma.galeri.count({ where: { isActive: true } });
    const published = await prisma.galeri.count({ where: { isActive: true, isPublished: true } });
    const draft = await prisma.galeri.count({ where: { isActive: true, isPublished: false } });

    console.log(`   Total Active Galeri: ${total}`);
    console.log(`   Published: ${published}`);
    console.log(`   Draft: ${draft}`);

    console.log('\n🎯 Ready for testing!');
    console.log('   - Database populated with sample data');
    console.log('   - All images point to your existing S3 file');
    console.log('   - Mix of published and draft status');
    console.log('   - Various event types and dates');

  } catch (error) {
    console.error('❌ Error seeding more galeri:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMoreGaleri();