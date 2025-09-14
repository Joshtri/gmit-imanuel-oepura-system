import prisma from "@/lib/prisma";
import { apiResponse } from "@/lib/apiHelper";
import { createApiHandler } from "@/lib/apiHandler";

async function handleGet(req, res) {
  try {
    const { id } = req.query;

    const jemaat = await prisma.jemaat.findUnique({
      where: { id: id },
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
                            provinsi: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            statusKeluarga: true,
            statusKepemilikanRumah: true,
            keadaanRumah: true,
            rayon: true
          }
        },
        statusDalamKeluarga: true,
        suku: true,
        pendidikan: true,
        pekerjaan: true,
        pendapatan: true,
        jaminanKesehatan: true,
        User: true
      }
    });

    if (!jemaat) {
      return res
        .status(404)
        .json(apiResponse(false, null, "Data jemaat tidak ditemukan"));
    }

    return res
      .status(200)
      .json(apiResponse(true, jemaat, "Data berhasil diambil"));
  } catch (error) {
    console.error("Error fetching jemaat:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal mengambil data jemaat",
          error.message
        )
      );
  }
}

async function handlePatch(req, res) {
  try {
    const { id } = req.query;
    const data = req.body;

    const updatedJemaat = await prisma.jemaat.update({
      where: { id: id },
      data,
      include: {
        keluarga: {
          include: {
            alamat: {
              include: {
                kelurahan: true
              }
            },
            statusKeluarga: true,
            rayon: true
          }
        },
        statusDalamKeluarga: true,
        suku: true,
        pendidikan: true,
        pekerjaan: true,
        pendapatan: true,
        jaminanKesehatan: true
      }
    });

    return res
      .status(200)
      .json(
        apiResponse(true, updatedJemaat, "Data jemaat berhasil diperbarui")
      );
  } catch (error) {
    console.error("Error updating jemaat:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal memperbarui data jemaat",
          error.message
        )
      );
  }
}

async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    // Check if jemaat has a user account
    const userCount = await prisma.user.count({
      where: { idJemaat: id }
    });

    if (userCount > 0) {
      return res
        .status(409)
        .json(
          apiResponse(
            false,
            null,
            "Data tidak dapat dihapus",
            "Jemaat ini memiliki akun user. Hapus akun user terlebih dahulu"
          )
        );
    }

    const deletedJemaat = await prisma.jemaat.delete({
      where: { id: id },
    });

    return res
      .status(200)
      .json(apiResponse(true, deletedJemaat, "Data berhasil dihapus"));
  } catch (error) {
    console.error("Error deleting jemaat:", error);
    return res
      .status(500)
      .json(
        apiResponse(
          false,
          null,
          "Gagal menghapus data jemaat",
          error.message
        )
      );
  }
}

export default createApiHandler({
  GET: handleGet,
  PATCH: handlePatch,
  DELETE: handleDelete,
});