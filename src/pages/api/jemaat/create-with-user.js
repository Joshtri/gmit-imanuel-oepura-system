import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";
import bcrypt from "bcryptjs";

async function handlePost(req, res) {
  try {
    const {
      // Jemaat data
      idKeluarga,
      idStatusDalamKeluarga,
      idSuku,
      idPendidikan,
      idPekerjaan,
      idPendapatan,
      idJaminanKesehatan,
      nama,
      jenisKelamin,
      tanggalLahir,
      golonganDarah,
      // User data
      createUser,
      email,
      password,
      role = "JEMAAT",
      // Keluarga data (if status is Kepala Keluarga)
      createKeluarga,
      keluargaData,
      // Alamat data (if creating keluarga)
      createAlamat,
      alamatData,
    } = req.body;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      let alamatId = null;
      let keluargaId = idKeluarga;

      // Step 1: Create Alamat if needed (for new Keluarga)
      if (createKeluarga && createAlamat && alamatData) {
        // Validate kelurahan exists
        const kelurahan = await tx.kelurahan.findUnique({
          where: { id: alamatData.idKelurahan }
        });
        
        if (!kelurahan) {
          throw new Error(`Kelurahan dengan ID ${alamatData.idKelurahan} tidak ditemukan`);
        }
        
        const newAlamat = await tx.alamat.create({
          data: alamatData,
        });
        alamatId = newAlamat.id;
      }

      // Step 2: Create Keluarga if status is Kepala Keluarga
      if (createKeluarga && keluargaData) {
        const newKeluarga = await tx.keluarga.create({
          data: {
            ...keluargaData,
            idAlamat: alamatId || keluargaData.idAlamat,
          },
        });
        keluargaId = newKeluarga.id;
      }

      // Step 3: Create Jemaat
      const newJemaat = await tx.jemaat.create({
        data: {
          idKeluarga: keluargaId,
          idStatusDalamKeluarga,
          idSuku,
          idPendidikan,
          idPekerjaan,
          idPendapatan,
          idJaminanKesehatan,
          nama,
          jenisKelamin: jenisKelamin === "true" || jenisKelamin === true,
          tanggalLahir: new Date(tanggalLahir),
          golonganDarah,
        },
      });

      // Step 4: Create User if requested
      let newUser = null;
      if (createUser && email && password) {
        // Check if email already exists
        const existingUser = await tx.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error("Email sudah terdaftar");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            role,
            idJemaat: newJemaat.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
            idJemaat: true,
          },
        });
      }

      // Return complete data with includes
      const completeJemaat = await tx.jemaat.findUnique({
        where: { id: newJemaat.id },
        include: {
          keluarga: {
            include: {
              alamat: {
                include: {
                  kelurahan: {
                    include: {
                      kecamatan: {
                        include: {
                          kotaKab: {
                            include: {
                              provinsi: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              statusKeluarga: true,
              statusKepemilikanRumah: true,
              keadaanRumah: true,
              rayon: true,
            },
          },
          statusDalamKeluarga: true,
          suku: true,
          pendidikan: true,
          pekerjaan: true,
          pendapatan: true,
          jaminanKesehatan: true,
        },
      });

      return {
        jemaat: completeJemaat,
        user: newUser,
        createdKeluarga: createKeluarga,
        createdAlamat: createAlamat,
      };
    });

    return res
      .status(201)
      .json(apiResponse(true, result, "Data jemaat berhasil ditambahkan"));
  } catch (error) {
    console.error("Error creating jemaat with user:", error);
    return res
      .status(500)
      .json(
        apiResponse(false, null, "Gagal menambahkan data jemaat", error.message)
      );
  }
}

export default createApiHandler({
  POST: handlePost,
});
