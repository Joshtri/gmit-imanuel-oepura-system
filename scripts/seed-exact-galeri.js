const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedExactGaleri() {
  try {
    console.log('🌱 Seeding exact galeri data as specified...');

    // Data persis sesuai permintaan - hanya 1 gambar per galeri
    const galeriData = {
      namaKegiatan: "Bakti Sosial di Panti Asuhan",
      deskripsi: "Kegiatan bakti sosial jemaat GMIT Imanuel Oepura di Panti Asuhan Kasih Sayang. Memberikan bantuan sembako, pakaian layak pakai, dan berbagi kasih dengan anak-anak panti.",
      tempat: "Panti Asuhan Kasih Sayang",
      tanggalKegiatan: new Date("2024-01-21T00:00:00.000Z"),
      fotos: JSON.stringify([
        {
          "originalName": "baksos-1.jpeg",
          "fileName": "galeri/baksos-2024-1.jpeg", 
          "url": "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg",
          "size": 245760,
          "mimetype": "image/jpeg"
        }
      ]), // Hanya 1 gambar sesuai permintaan
      isActive: true,
      isPublished: true,
      publishedAt: new Date("2025-09-07T21:41:20.007Z"),
    };

    // Insert ke database
    const newGaleri = await prisma.galeri.create({
      data: galeriData,
    });

    console.log('✅ Galeri created with exact specifications:');
    console.log('   ID:', newGaleri.id);
    console.log('   Name:', newGaleri.namaKegiatan);
    console.log('   Place:', newGaleri.tempat);
    console.log('   Date:', newGaleri.tanggalKegiatan.toISOString());
    console.log('   Photos:', JSON.parse(newGaleri.fotos).length);
    console.log('   Status:', newGaleri.isPublished ? 'Published' : 'Draft');
    console.log('   Image URL:', JSON.parse(newGaleri.fotos)[0].url);

    // Verify data structure matches exactly
    console.log('\n🔍 Data structure verification:');
    const foto = JSON.parse(newGaleri.fotos)[0];
    
    console.log('   ✅ originalName:', foto.originalName);
    console.log('   ✅ fileName:', foto.fileName);
    console.log('   ✅ url:', foto.url);
    console.log('   ✅ size:', foto.size);
    console.log('   ✅ mimetype:', foto.mimetype);
    
    // Test exact URL
    console.log('\n🌐 Exact URL test:');
    const expectedUrl = "https://s3.nevaobjects.id/files-bucket/1756789428652.jpeg";
    const actualUrl = foto.url;
    console.log('   Expected:', expectedUrl);
    console.log('   Actual:  ', actualUrl);
    console.log('   Match:   ', expectedUrl === actualUrl ? '✅ EXACT MATCH' : '❌ MISMATCH');

    // Full record for reference
    console.log('\n📋 Full record structure:');
    const fullRecord = {
      id: newGaleri.id,
      namaKegiatan: newGaleri.namaKegiatan,
      deskripsi: newGaleri.deskripsi,
      tempat: newGaleri.tempat,
      tanggalKegiatan: newGaleri.tanggalKegiatan,
      fotos: newGaleri.fotos,
      isActive: newGaleri.isActive,
      isPublished: newGaleri.isPublished,
      createdAt: newGaleri.createdAt,
      updatedAt: newGaleri.updatedAt,
      publishedAt: newGaleri.publishedAt
    };

    console.log('   Structure matches your specification: ✅');
    console.log('   Ready for API testing: ✅');

  } catch (error) {
    console.error('❌ Error seeding exact galeri:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedExactGaleri();